/*
# Create site_settings and categories tables — full CMS control for Mahiya

1. New Tables
- `site_settings` — Singleton (id=1) with all editable site text, contact info, social links
- `categories` — Dynamic gallery categories managed by the artist

2. Security
- SELECT: anon + authenticated (public can view)
- INSERT/UPDATE/DELETE: authenticated only (artist manages everything)
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name text NOT NULL DEFAULT 'MahiyaCanva',
  artist_name text NOT NULL DEFAULT 'Mahiya',
  hero_title text NOT NULL DEFAULT 'Where colors whisper and art breathes',
  hero_subtitle text NOT NULL DEFAULT 'Art & Accessories by Mahiya',
  hero_description text NOT NULL DEFAULT 'Original acrylic paintings, watercolor florals, and handcrafted accessories — each piece a quiet conversation between brush and soul.',
  hero_image_url text,
  about_text text NOT NULL DEFAULT 'I''m a self-taught artist based in a sunlit corner studio, where I spend my days chasing the way light falls on a cheekbone, or how silk catches the wind. My work lives between two worlds — the quiet intimacy of acrylic portraits and the bold storytelling of handcrafted accessories. Every piece begins with a feeling: a color I can''t shake, a face I saw in passing, a texture that moved like water. I paint to capture that fleeting spark — the moment before it fades.',
  about_image_url text,
  about_stat1_value text DEFAULT '120+',
  about_stat1_label text DEFAULT 'Original works',
  about_stat2_value text DEFAULT '8',
  about_stat2_label text DEFAULT 'Years painting',
  about_stat3_value text DEFAULT '45',
  about_stat3_label text DEFAULT 'Commissions',
  contact_email text NOT NULL DEFAULT 'hello@mahiyacanva.art',
  contact_heading text NOT NULL DEFAULT 'Let''s create something beautiful together',
  contact_message text NOT NULL DEFAULT 'Whether you''re interested in an existing piece, a custom commission, or just want to say hello — I''d love to hear from you.',
  instagram_url text DEFAULT '',
  tiktok_url text DEFAULT '',
  pinterest_url text DEFAULT '',
  footer_text text NOT NULL DEFAULT '© 2026 MahiyaCanva. All artworks are original and protected.',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- site_settings policies
DROP POLICY IF EXISTS "anon_select_settings" ON site_settings;
CREATE POLICY "anon_select_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON site_settings;
CREATE POLICY "auth_insert_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- categories policies
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- Seed the singleton settings row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Seed default categories
INSERT INTO categories (name, display_order) VALUES
  ('Acrylic Paintings', 1),
  ('Accessories', 2)
ON CONFLICT (name) DO NOTHING;