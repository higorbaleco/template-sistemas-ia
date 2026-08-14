import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN")!;
const APIFY_TOKEN = Deno.env.get("APIFY_TOKEN")!;
const INSTAGRAM_SESSION = Deno.env.get("INSTAGRAM_SESSION_COOKIE")!;

const NOTION_VERSION = "2022-06-28";
const DB_INSPIRACOES = "1d748ed258c94f5480f1f95ebbde4666";
const DB_GANCHOS = "623cb39e06864fd9b8a07b1da5d8ab37";
const DB_CONCORRENTES = "8514a23ab2b6427aae6cbb0be263b406";

const notionHeaders = {
  "Authorization": `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

async function notionCreate(databaseId: string, properties: Record<string, unknown>) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify({ parent: { database_id: databaseId }, properties }),
  });
  return res.json();
}

async function notionQuery(databaseId: string, filter?: Record<string, unknown>) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify(filter ? { filter } : {}),
  });
  return res.json();
}

// Ingest: my Instagram saves
async function ingestInstagramSaves() {
  const run = await fetch("https://api.apify.com/v2/acts/apify~instagram-scraper/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${APIFY_TOKEN}`,
    },
    body: JSON.stringify({
      directUrls: ["https://www.instagram.com/saved/"],
      resultsType: "posts",
      resultsLimit: 20,
      sessionCookie: INSTAGRAM_SESSION,
    }),
  });

  if (!run.ok) {
    console.error("Apify run failed:", await run.text());
    return 0;
  }

  const runData = await run.json();
  const runId = runData.data?.id;
  if (!runId) return 0;

  // Poll until done (max 3 min)
  let attempts = 0;
  let items: Array<Record<string, unknown>> = [];
  while (attempts < 18) {
    await new Promise((r) => setTimeout(r, 10000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: { "Authorization": `Bearer ${APIFY_TOKEN}` },
    });
    const status = await statusRes.json();
    if (status.data?.status === "SUCCEEDED") {
      const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items`, {
        headers: { "Authorization": `Bearer ${APIFY_TOKEN}` },
      });
      items = await dataRes.json();
      break;
    }
    attempts++;
  }

  let created = 0;
  for (const post of items.slice(0, 20)) {
    await notionCreate(DB_INSPIRACOES, {
      "Autor": { title: [{ text: { content: String(post.ownerUsername ?? "desconhecido") } }] },
      "URL": { url: String(post.url ?? post.shortCode ? `https://www.instagram.com/p/${post.shortCode}/` : "") },
      "Origem": { select: { name: "Save-meu" } },
      "Gancho extraído": { rich_text: [{ text: { content: String((post.caption as string ?? "").slice(0, 200)) } }] },
    });
    created++;
  }
  return created;
}

// Ingest: competitor posts
async function ingestConcorrentes() {
  const { results } = await notionQuery(DB_CONCORRENTES, {
    property: "Ativo",
    checkbox: { equals: true },
  });

  let total = 0;
  for (const page of results ?? []) {
    const handle = page.properties?.Handle?.title?.[0]?.plain_text;
    if (!handle) continue;

    const run = await fetch("https://api.apify.com/v2/acts/apify~instagram-scraper/runs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APIFY_TOKEN}`,
      },
      body: JSON.stringify({
        directUrls: [`https://www.instagram.com/${handle}/`],
        resultsType: "posts",
        resultsLimit: 5,
      }),
    });

    if (!run.ok) continue;
    const runData = await run.json();
    const runId = runData.data?.id;
    if (!runId) continue;

    let attempts = 0;
    let items: Array<Record<string, unknown>> = [];
    while (attempts < 18) {
      await new Promise((r) => setTimeout(r, 10000));
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
        headers: { "Authorization": `Bearer ${APIFY_TOKEN}` },
      });
      const status = await statusRes.json();
      if (status.data?.status === "SUCCEEDED") {
        const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items`, {
          headers: { "Authorization": `Bearer ${APIFY_TOKEN}` },
        });
        items = await dataRes.json();
        break;
      }
      attempts++;
    }

    for (const post of items) {
      await notionCreate(DB_INSPIRACOES, {
        "Autor": { title: [{ text: { content: `@${handle}` } }] },
        "URL": { url: String(post.url ?? `https://www.instagram.com/p/${post.shortCode}/`) },
        "Origem": { select: { name: "Concorrente" } },
        "Gancho extraído": { rich_text: [{ text: { content: String((post.caption as string ?? "").slice(0, 200)) } }] },
      });
      total++;
    }

    // Update last scan date
    await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          "Última varredura": { date: { start: new Date().toISOString().split("T")[0] } },
        },
      }),
    });
  }
  return total;
}

// Ingest: Google Trends BR → create Ganchos with Auto-trend origin
async function ingestGoogleTrends() {
  const res = await fetch("https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR");
  if (!res.ok) return 0;
  const xml = await res.text();

  const titles = [...xml.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g)].map((m) => m[1]).slice(0, 10);

  let created = 0;
  for (const trend of titles) {
    await notionCreate(DB_GANCHOS, {
      "Título": { title: [{ text: { content: `[Trend] ${trend}` } }] },
      "Origem": { select: { name: "Auto-trend" } },
      "Intenção": { select: { name: "Engajar" } },
    });
    created++;
  }
  return created;
}

serve(async (req) => {
  // Allow manual trigger via POST or scheduled invocation
  try {
    const [saves, concorrentes, trends] = await Promise.allSettled([
      ingestInstagramSaves(),
      ingestConcorrentes(),
      ingestGoogleTrends(),
    ]);

    return Response.json({
      saves: saves.status === "fulfilled" ? saves.value : saves.reason,
      concorrentes: concorrentes.status === "fulfilled" ? concorrentes.value : concorrentes.reason,
      trends: trends.status === "fulfilled" ? trends.value : trends.reason,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
