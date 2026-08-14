# Schema de Dados

## 1. MVP local

No MVP, os dados serão salvos via `chrome.storage.local`.

## 2. Entidades

### Campaign

```json
{
  "id": "uuid",
  "name": "Imobiliário Maringá",
  "primary_keyword": "corretores de imóveis",
  "additional_terms": ["imobiliária", "investidores imobiliários"],
  "region": "Maringá",
  "sources": ["google", "facebook", "youtube"],
  "pages_per_source": 10,
  "depth": "medium",
  "status": "active",
  "created_at": "2026-06-10T15:27:00.000Z",
  "updated_at": "2026-06-10T15:27:00.000Z"
}
```

### SearchQuery

```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "source": "facebook",
  "query": "site:facebook.com \"corretores de imóveis\" \"Maringá\" \"chat.whatsapp.com\"",
  "google_url": "https://www.google.com/search?q=...",
  "page_start": 0,
  "status": "completed",
  "results_count": 3,
  "created_at": "2026-06-10T15:27:00.000Z"
}
```

### GroupLink

```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "search_query_id": "uuid",
  "source": "facebook",
  "primary_keyword": "corretores de imóveis",
  "region": "Maringá",
  "raw_url": "https://chat.whatsapp.com/ABCDE12345?utm_source=x",
  "normalized_url": "https://chat.whatsapp.com/ABCDE12345",
  "page_url": "https://www.google.com/search?q=...",
  "page_title": "Resultado do Google",
  "status": "pending_validation",
  "validation_status": "not_checked",
  "manual_status": null,
  "notes": "",
  "created_at": "2026-06-10T15:27:00.000Z",
  "last_checked_at": null
}
```

## 3. Status de campanha

```txt
draft
active
completed
paused
archived
```

## 4. Status de query

```txt
pending
running
completed
failed
blocked
```

## 5. Status de link

```txt
new
pending_validation
valid
invalid
duplicate
removed
```

## 6. Status de validação automática

```txt
not_checked
valid_format
invalid_format
page_loaded
page_not_loaded
join_available
group_full
invite_revoked
unavailable
manual_review_required
unknown
```

## 7. Status manual

```txt
valid
invalid
group_full
invite_revoked
out_of_niche
duplicate
priority
joined
not_joined
not_tested
```

## 8. Modelo futuro Supabase

### campaigns

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  additional_terms JSONB NOT NULL DEFAULT '[]',
  region TEXT,
  sources JSONB NOT NULL DEFAULT '[]',
  pages_per_source INTEGER NOT NULL DEFAULT 5,
  depth TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### search_queries

```sql
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  query TEXT NOT NULL,
  google_url TEXT NOT NULL,
  page_start INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### group_links

```sql
CREATE TABLE group_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  search_query_id UUID REFERENCES search_queries(id) ON DELETE SET NULL,
  source TEXT,
  primary_keyword TEXT,
  region TEXT,
  raw_url TEXT NOT NULL,
  normalized_url TEXT NOT NULL,
  page_url TEXT,
  page_title TEXT,
  status TEXT DEFAULT 'pending_validation',
  validation_status TEXT DEFAULT 'not_checked',
  manual_status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_checked_at TIMESTAMP
);
```

### Índices

```sql
CREATE UNIQUE INDEX unique_group_link_per_campaign
ON group_links (campaign_id, normalized_url);

CREATE INDEX idx_group_links_campaign
ON group_links (campaign_id);

CREATE INDEX idx_group_links_status
ON group_links (status);

CREATE INDEX idx_group_links_manual_status
ON group_links (manual_status);
```
