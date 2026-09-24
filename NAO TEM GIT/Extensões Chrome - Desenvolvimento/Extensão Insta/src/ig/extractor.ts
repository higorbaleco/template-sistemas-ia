import type { ContentType, ExportFilters, ExportPayload, PostRecord } from '../shared/types';
import { parseCount } from '../shared/parseCount';
import { sleep } from '../shared/sleep';
import { isoDateOnly, nowIso } from '../shared/time';

export type ExtractOptions = {
  limit: number;
  contentTypes: ContentType[];
  startDate?: string | null;
  endDate?: string | null;
};

export type ExtractProgress = {
  phase: 'collecting_urls' | 'extracting_posts' | 'done' | 'stopped' | 'error';
  totalDiscovered: number;
  processed: number;
  currentUrl?: string;
  lastError?: string;
};

export type StopSignal = { readonly stopped: boolean };

export async function extractProfilePosts(
  profile: string,
  options: ExtractOptions,
  stop: StopSignal,
  onProgress: (p: ExtractProgress) => void
): Promise<ExportPayload> {
  const filters: ExportFilters = {
    limit: options.limit,
    start_date: options.startDate ?? null,
    end_date: options.endDate ?? null,
    content_types: options.contentTypes,
    order: 'recent',
  };

  const collected_at = nowIso();

  onProgress({ phase: 'collecting_urls', totalDiscovered: 0, processed: 0 });
  const urls = await collectPostUrls({
    limit: options.limit,
    contentTypes: options.contentTypes,
    stop,
    onProgress: (totalDiscovered) =>
      onProgress({ phase: 'collecting_urls', totalDiscovered, processed: 0 }),
  });

  const posts: PostRecord[] = [];
  onProgress({ phase: 'extracting_posts', totalDiscovered: urls.length, processed: 0 });

  for (let i = 0; i < urls.length; i++) {
    if (stop.stopped) {
      onProgress({ phase: 'stopped', totalDiscovered: urls.length, processed: i });
      break;
    }

    const url = urls[i]!;
    onProgress({
      phase: 'extracting_posts',
      totalDiscovered: urls.length,
      processed: i,
      currentUrl: url,
    });

    const post = await extractSinglePost(url, i + 1, stop).catch((err) => {
      const type = inferTypeFromUrl(url);
      return {
        index: i + 1,
        url,
        type,
        caption: null,
        alt_text: null,
        published_at: null,
        thumbnail_url: null,
        metrics: { views: null, likes: null, comments: null },
        source: { from_grid: true, from_modal: false },
        error: String(err),
      } satisfies PostRecord;
    });

    // Date filtering is best-effort and applied after extraction
    if (options.startDate || options.endDate) {
      if (post.published_at) {
        const d = post.published_at;
        if (options.startDate && d < options.startDate) continue;
        if (options.endDate && d > options.endDate) continue;
      }
    }

    posts.push(post);
  }

  onProgress({ phase: 'done', totalDiscovered: urls.length, processed: posts.length });
  return { profile, collected_at, filters, posts };
}

async function collectPostUrls(params: {
  limit: number;
  contentTypes: ContentType[];
  stop: StopSignal;
  onProgress: (totalDiscovered: number) => void;
}): Promise<string[]> {
  const found = new Map<string, { type: ContentType }>();
  const maxScrolls = 40;

  for (let scrolls = 0; scrolls < maxScrolls; scrolls++) {
    if (params.stop.stopped) break;

    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/p/"], a[href^="/reel/"], a[href^="/tv/"]')
    );

    for (const a of anchors) {
      const href = a.getAttribute('href');
      if (!href) continue;
      if (!href.startsWith('/')) continue;
      const abs = new URL(href, location.origin).toString();
      const type = inferTypeFromUrl(abs);
      if (!params.contentTypes.includes(type) && type !== 'unknown') continue;
      if (!found.has(abs)) found.set(abs, { type });
      if (found.size >= params.limit) break;
    }

    params.onProgress(found.size);
    if (found.size >= params.limit) break;

    // Scroll a bit to load more grid items
    window.scrollBy({ top: Math.max(600, window.innerHeight * 0.9), behavior: 'smooth' });
    await sleep(800);
  }

  return Array.from(found.keys()).slice(0, params.limit);
}

async function extractSinglePost(url: string, index: number, stop: StopSignal): Promise<PostRecord> {
  const type = inferTypeFromUrl(url);
  const anchor = findBestAnchorForUrl(url);
  if (!anchor) throw new Error('post_link_not_found_in_dom');

  anchor.click();
  const dialog = await waitForDialog(stop, 12_000);

  const published_at = extractPublishedAt(dialog);
  const caption = extractCaption(dialog);
  const { likes, comments, views } = extractMetrics(dialog);
  const alt_text = extractAltText(dialog);
  const thumbnail_url = extractThumbnailUrl(dialog);

  await closeDialog(dialog);

  return {
    index,
    url,
    type,
    caption,
    alt_text,
    published_at,
    thumbnail_url,
    metrics: { views, likes, comments },
    source: { from_grid: true, from_modal: true },
    error: null,
  };
}

function inferTypeFromUrl(url: string): ContentType {
  if (url.includes('/reel/')) return 'reel';
  if (url.includes('/tv/')) return 'video';
  if (url.includes('/p/')) return 'unknown';
  return 'unknown';
}

function findBestAnchorForUrl(url: string): HTMLAnchorElement | null {
  const target = new URL(url);
  const hrefPath = target.pathname;
  const anchors = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/p/"], a[href^="/reel/"], a[href^="/tv/"]')
  );
  return (
    anchors.find((a) => {
      const href = a.getAttribute('href') || '';
      return href.startsWith(hrefPath);
    }) ?? null
  );
}

async function waitForDialog(stop: StopSignal, timeoutMs: number): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (stop.stopped) throw new Error('stopped');
    const dialog = document.querySelector<HTMLElement>('div[role="dialog"]');
    if (dialog) return dialog;
    await sleep(100);
  }
  throw new Error('dialog_timeout');
}

function extractPublishedAt(dialog: HTMLElement): string | null {
  const timeEl = dialog.querySelector<HTMLTimeElement>('time[datetime]');
  const dt = timeEl?.getAttribute('datetime');
  if (!dt) return null;
  try {
    return isoDateOnly(new Date(dt).toISOString());
  } catch {
    return null;
  }
}

function extractCaption(dialog: HTMLElement): string | null {
  // Heuristic: caption is usually in the first list item under the dialog article content.
  const article = dialog.querySelector<HTMLElement>('article') ?? dialog;
  const ul = article.querySelector('ul');
  const firstLi = ul?.querySelector('li');
  if (firstLi) {
    const spans = Array.from(firstLi.querySelectorAll('span'));
    const text = spans
      .map((s) => s.textContent?.trim() || '')
      .filter(Boolean)
      .filter((t) => t.length >= 2)
      .join('\n')
      .trim();
    if (text) return text;
  }

  // Fallback: pick a medium-long text block in the dialog.
  const candidates = Array.from(dialog.querySelectorAll('span'))
    .map((s) => s.textContent?.trim() || '')
    .filter((t) => t.length >= 20 && t.length <= 2200);
  return candidates[0] ?? null;
}

function extractMetrics(dialog: HTMLElement): { likes: number | null; comments: number | null; views: number | null } {
  const text = dialog.innerText || '';
  // Likes often appear near bottom; use best-effort regex.
  const likesMatch =
    text.match(/([\d.,]+)\s*(mil|k|m|mi|milh(?:ões|oes)?)?\s*(curtidas|likes)\b/i) ??
    text.match(/\b(curtiu|curtidas)\b.*?([\d.,]+)\s*(mil|k|m|mi)?/i);
  const commentsMatch = text.match(/([\d.,]+)\s*(mil|k|m|mi|milh(?:ões|oes)?)?\s*(coment[aá]rios|comments)\b/i);
  const viewsMatch = text.match(/([\d.,]+)\s*(mil|k|m|mi|milh(?:ões|oes)?)?\s*(visualiza[cç][oõ]es|views)\b/i);

  const likes = likesMatch ? parseCount(likesMatch[0]) : null;
  const comments = commentsMatch ? parseCount(commentsMatch[0]) : null;
  const views = viewsMatch ? parseCount(viewsMatch[0]) : null;
  return { likes, comments, views };
}

function extractAltText(dialog: HTMLElement): string | null {
  const imgs = Array.from(dialog.querySelectorAll<HTMLImageElement>('img[alt]'));
  const alt = imgs.map((i) => i.getAttribute('alt')?.trim() || '').filter(Boolean);
  if (alt.length === 0) return null;
  // Return the first non-generic alt.
  return alt[0] ?? null;
}

function extractThumbnailUrl(dialog: HTMLElement): string | null {
  const video = dialog.querySelector<HTMLVideoElement>('video');
  const poster = (video?.getAttribute('poster') || '').trim();
  if (poster) return poster;

  const img = dialog.querySelector<HTMLImageElement>('img[src], img[srcset]');
  const src = (img?.getAttribute('src') || '').trim();
  if (src) return src;
  return null;
}

async function closeDialog(dialog: HTMLElement): Promise<void> {
  // Try Escape first
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(250);

  if (!document.contains(dialog)) return;

  const closeBtn =
    dialog.querySelector<HTMLButtonElement>('button[aria-label="Close"], button[aria-label="Fechar"]') ??
    dialog.querySelector<HTMLButtonElement>('svg[aria-label="Close"]')?.closest('button') ??
    null;
  if (closeBtn) closeBtn.click();

  // Wait briefly for dialog removal
  for (let i = 0; i < 20; i++) {
    if (!document.contains(dialog)) return;
    await sleep(100);
  }
}

