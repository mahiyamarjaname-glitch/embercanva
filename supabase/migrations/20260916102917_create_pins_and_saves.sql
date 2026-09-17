/*
# Create pins and saves tables for EmberCanva Pinterest-style app

1. New Tables
- `pins` — Stores curated pin content (image, title, description, category, author)
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text)
  - `image_url` (text, not null)
  - `image_width` (integer)
  - `image_height` (integer)
  - `category` (text, not null)
  - `author` (text)
  - `link` (text)
  - `created_at` (timestamptz, default now())
- `saves` — Tracks which pins have been saved
  - `id` (uuid, primary key)
  - `pin_id` (uuid, foreign key to pins, on delete cascade)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD since this is a single-tenant public app.

3. Indexes
- Index on pins.category for category filtering
- Unique constraint on saves.pin_id to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  image_width integer,
  image_height integer,
  category text NOT NULL,
  author text,
  link text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_id uuid NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(pin_id)
);

CREATE INDEX IF NOT EXISTS idx_pins_category ON pins(category);

ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pins" ON pins;
CREATE POLICY "anon_select_pins" ON pins FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pins" ON pins;
CREATE POLICY "anon_insert_pins" ON pins FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_pins" ON pins;
CREATE POLICY "anon_update_pins" ON pins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_pins" ON pins;
CREATE POLICY "anon_delete_pins" ON pins FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_saves" ON saves;
CREATE POLICY "anon_select_saves" ON saves FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saves" ON saves;
CREATE POLICY "anon_insert_saves" ON saves FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saves" ON saves;
CREATE POLICY "anon_delete_saves" ON saves FOR DELETE
  TO anon, authenticated USING (true);