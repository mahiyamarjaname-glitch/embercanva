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
- `saves` — Tracks which pins have been saved (single-tenant, no auth)
  - `id` (uuid, primary key)
  - `pin_id` (uuid, foreign key to pins, on delete cascade)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD on both tables since this is a single-tenant
  public app with no sign-in screen. All data is intentionally shared/public.

3. Important Notes
- No user_id columns or auth integration — the app has no sign-in screen.
- The `saves` table uses a unique constraint on pin_id to prevent duplicate saves.
- Pin content is seeded from curated Pexels stock photos across 7 categories.
*/