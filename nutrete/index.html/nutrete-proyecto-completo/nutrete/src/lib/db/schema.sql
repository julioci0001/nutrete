-- nutrEte — Supabase Schema
-- Copia y pega todo esto en el SQL Editor de Supabase y presiona Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, tagline TEXT,
  description TEXT, long_description TEXT, category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft', image_url TEXT, image_alt TEXT, images JSONB DEFAULT '[]',
  problem TEXT, solution TEXT, benefits JSONB DEFAULT '[]', ingredients JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]', faqs JSONB DEFAULT '[]', article_content TEXT,
  comparison_table JSONB, seo_title TEXT, seo_description TEXT, keywords TEXT[],
  urgency_text TEXT, scarcity_text TEXT, cta_text TEXT DEFAULT 'Quiero mi producto',
  discount NUMERIC(5,2), terraleads_flow_id TEXT, agent_system_prompt TEXT, agent_greeting TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL, currency TEXT, price NUMERIC(10,2),
  affiliate_url TEXT NOT NULL, available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, country_code)
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id), product_name TEXT, product_slug TEXT,
  name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, country TEXT, city TEXT, ip TEXT,
  status TEXT DEFAULT 'new', terraleads_id TEXT, source TEXT, medium TEXT, campaign TEXT,
  landing_page TEXT, user_agent TEXT, session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id), messages JSONB DEFAULT '[]',
  country TEXT, ip TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), event_type TEXT NOT NULL,
  product_id UUID REFERENCES products(id), country TEXT, session_id TEXT, ip TEXT,
  metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_pc_country ON product_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_leads_country ON leads(country);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active product_countries" ON product_countries FOR SELECT USING (available = TRUE);
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert events" ON analytics_events FOR INSERT WITH CHECK (TRUE);

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION get_products_by_country(p_country TEXT)
RETURNS TABLE(product_id UUID, slug TEXT, name TEXT, tagline TEXT, description TEXT, category TEXT, image_url TEXT, price NUMERIC, currency TEXT, affiliate_url TEXT, cta_text TEXT) AS $$
BEGIN
  RETURN QUERY SELECT p.id,p.slug,p.name,p.tagline,p.description,p.category,p.image_url,pc.price,pc.currency,pc.affiliate_url,p.cta_text
  FROM products p JOIN product_countries pc ON pc.product_id=p.id
  WHERE p.status='active' AND pc.country_code=UPPER(p_country) AND pc.available=TRUE ORDER BY p.created_at DESC;
END; $$ LANGUAGE plpgsql;