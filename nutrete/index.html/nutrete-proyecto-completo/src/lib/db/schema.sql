-- ══════════════════════════════════════════════════════════════
-- nutrEte — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- full-text search
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ── PRODUCTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  tagline             TEXT,
  description         TEXT,
  long_description    TEXT,
  category            TEXT NOT NULL DEFAULT 'general',
  status              TEXT NOT NULL DEFAULT 'draft',

  -- Media
  image_url           TEXT,
  image_alt           TEXT,
  images              JSONB DEFAULT '[]',
  video_url           TEXT,

  -- Content (JSONB for flexibility)
  problem             TEXT,
  solution            TEXT,
  benefits            JSONB DEFAULT '[]',
  ingredients         JSONB DEFAULT '[]',
  testimonials        JSONB DEFAULT '[]',
  faqs                JSONB DEFAULT '[]',
  article_content     TEXT,
  comparison_table    JSONB,

  -- SEO
  seo_title           TEXT,
  seo_description     TEXT,
  keywords            TEXT[],

  -- Marketing
  urgency_text        TEXT,
  scarcity_text       TEXT,
  cta_text            TEXT DEFAULT 'Quiero mi producto',
  discount            NUMERIC(5,2),

  -- TerraLeads
  terraleads_flow_id  TEXT,

  -- AI Agent
  agent_system_prompt TEXT,
  agent_greeting      TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUCT COUNTRIES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_countries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  country_code    TEXT NOT NULL,   -- AR, MX, CO, etc.
  currency        TEXT,
  price           NUMERIC(10,2),
  affiliate_url   TEXT NOT NULL,
  available       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, country_code)
);

-- ── LEADS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id          UUID REFERENCES products(id),
  product_name        TEXT,
  product_slug        TEXT,

  -- Contact
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,

  -- Geo
  country             TEXT,
  city                TEXT,
  state               TEXT,
  ip                  TEXT,

  -- Status
  status              TEXT DEFAULT 'new',
  terraleads_id       TEXT,
  terraleads_status   TEXT,

  -- UTM / Tracking
  source              TEXT,
  medium              TEXT,
  campaign            TEXT,
  landing_page        TEXT,
  user_agent          TEXT,
  session_id          TEXT,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── AGENT SESSIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id),
  messages    JSONB DEFAULT '[]',
  country     TEXT,
  ip          TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ANALYTICS EVENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type  TEXT NOT NULL,      -- page_view, cta_click, form_submit, etc.
  product_id  UUID REFERENCES products(id),
  country     TEXT,
  session_id  TEXT,
  ip          TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTENT JOBS (queue for AI generation) ────────────────────
CREATE TABLE IF NOT EXISTS content_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES products(id),
  job_type        TEXT,            -- full | article | faqs | testimonials | seo
  status          TEXT DEFAULT 'pending',  -- pending | running | done | error
  result          JSONB,
  error           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_status    ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug      ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_search    ON products USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_pc_country         ON product_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_pc_available       ON product_countries(available);
CREATE INDEX IF NOT EXISTS idx_leads_product      ON leads(product_id);
CREATE INDEX IF NOT EXISTS idx_leads_country      ON leads(country);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON leads(status);
CREATE INDEX IF NOT EXISTS idx_events_type        ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_product     ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status        ON content_jobs(status);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_jobs      ENABLE ROW LEVEL SECURITY;

-- Public read for active products
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Public read active product_countries"
  ON product_countries FOR SELECT
  USING (available = TRUE);

-- Public insert for leads
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

-- Public insert for sessions
CREATE POLICY "Public insert sessions"
  ON agent_sessions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Public update sessions"
  ON agent_sessions FOR UPDATE
  USING (TRUE);

-- Public insert for events
CREATE POLICY "Public insert events"
  ON analytics_events FOR INSERT
  WITH CHECK (TRUE);

-- Service role has full access (API routes use service role key)

-- ── FUNCTIONS ─────────────────────────────────────────────────
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at          BEFORE UPDATE ON products          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at             BEFORE UPDATE ON leads             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER agent_sessions_updated_at    BEFORE UPDATE ON agent_sessions    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Get products by country
CREATE OR REPLACE FUNCTION get_products_by_country(p_country TEXT)
RETURNS TABLE (
  product_id    UUID,
  slug          TEXT,
  name          TEXT,
  tagline       TEXT,
  description   TEXT,
  category      TEXT,
  image_url     TEXT,
  price         NUMERIC,
  currency      TEXT,
  affiliate_url TEXT,
  cta_text      TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.name,
    p.tagline,
    p.description,
    p.category,
    p.image_url,
    pc.price,
    pc.currency,
    pc.affiliate_url,
    p.cta_text
  FROM products p
  JOIN product_countries pc ON pc.product_id = p.id
  WHERE p.status = 'active'
    AND pc.country_code = UPPER(p_country)
    AND pc.available = TRUE
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
