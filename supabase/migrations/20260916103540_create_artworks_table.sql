/*
# Create artworks table for EmberCanva portfolio

1. New Tables
- `artworks` — Stores EmberCanva's paintings and fashion pieces
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text)
  - `image_url` (text, not null)
  - `image_width` (integer)
  - `image_height` (integer)
  - `category` (text, not null) — 'paintings' or 'fashion'
  - `price` (numeric)
  - `medium` (text) — e.g. 'Oil on canvas', 'Acrylic', 'Mixed media'
  - `year` (integer)
  - `created_at` (timestamptz, default now())

2. Modified Tables
- `pins` — Dropped (replaced by artworks). No user data to preserve.
- `saves` — Dropped (replaced by artworks). No user data to preserve.

3. Security
- Enable RLS on artworks.
- Allow anon + authenticated SELECT (public portfolio, no sign-in).
- No INSERT/UPDATE/DELETE from the client — data is seeded via SQL.

4. Important Notes
- This is a portfolio site, not a user-generated content platform.
- No auth, no user_id columns.
- Data is seeded from curated Pexels stock photos.
*/

DROP TABLE IF EXISTS saves;
DROP TABLE IF EXISTS pins;

CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  image_width integer,
  image_height integer,
  category text NOT NULL DEFAULT 'paintings',
  price numeric(10, 2),
  medium text,
  year integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_artworks" ON artworks;
CREATE POLICY "anon_select_artworks" ON artworks FOR SELECT
  TO anon, authenticated USING (true);