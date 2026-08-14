export type ContentType = 'reel' | 'carousel' | 'image' | 'video' | 'unknown';

export type Metrics = {
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
};

export type PostRecord = {
  index: number;
  url: string;
  type: ContentType;
  caption?: string | null;
  alt_text?: string | null;
  published_at?: string | null;
  thumbnail_url?: string | null;
  metrics: Metrics;
  source: {
    from_grid: boolean;
    from_modal: boolean;
  };
  error?: string | null;
};

export type ExportFilters = {
  limit: number;
  start_date?: string | null;
  end_date?: string | null;
  content_types: ContentType[];
  order: 'recent';
};

export type ExportPayload = {
  profile: string;
  collected_at: string;
  filters: ExportFilters;
  posts: PostRecord[];
};

