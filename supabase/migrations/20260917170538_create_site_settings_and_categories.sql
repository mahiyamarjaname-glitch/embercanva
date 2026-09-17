/*
# Create site_settings and categories tables for full CMS control

1. New Tables
- `site_settings` — Single-row table holding all editable site content:
  - `id` (int, always 1 — singleton)
  - `brand_name` (text) — e.g. "MahiyaCanva"
  - `artist_name` (text) — e.g. "Mahiya"
  - `hero_title` (text) — main headline
  - `hero_subtitle` (text) — tagline above headline
  - `hero_description` (text) — paragraph below headline
  - `about_text` (text) — artist bio paragraph(s)
  - `about_image_url` (text) — portrait/studio image
  - `about_stat1_value`, `about_stat1_label` (text) — e.g. "120+" / "Original works"
  - `about_stat2_value`, `about_stat2_label` (text)
  - `about_stat3_value`, `about_stat3_label` (text)
  - `contact_email` (text) — e.g. "hello@mahiyacanva.art"
  - `contact_heading` (text) — e.g. "Let's create something beautiful together"
  - `contact_message` (text) — paragraph above email button
  - `instagram_url` (text)
  - `tiktok_url` (text)
  - `pinterest_url` (text)
  - `footer_text` (text) — copyright line
  - `hero_image_url` (text) — hero background image
  - `updated_at` (timestamptz)

- `categories` — Gallery categories managed by the artist:
  - `id` (uuid, primary key)
  - `name` (text, unique, not null) — e.g. "Acrylic Paintings", "Accessories"
  - `display_order` (int, default 0) — controls nav/gallery order
  - `created_at` (timestamptz)

2. Security
- Both tables: SELECT open to anon + authenticated (public reads).
- Both tables: INSERT/UPDATE/DELETE restricted to authenticated (artist only).
- This is a multi-user-auth app: the artist signs in to manage content.

3. Important Notes
- site_settings is a singleton (id=1). Seeded with Mahiya's defaults.
- categories are dynamic — the artist adds/removes/renames them.
- artworks.category is now a free-text field referencing category names.
*/