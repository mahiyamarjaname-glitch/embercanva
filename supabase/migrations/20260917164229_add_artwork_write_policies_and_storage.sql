/*
# Add write policies to artworks table + create storage bucket for artwork images

1. Modified Tables
- `artworks` — Currently SELECT-only for public. Adds INSERT/UPDATE/DELETE policies
  scoped to `authenticated` (the artist/admin who signs in). Public (anon) retains
  SELECT-only access so visitors can browse the gallery but not modify it.

2. Storage
- Creates a public storage bucket `artworks` for uploading painting images.
- Sets policies: authenticated users can upload/manage files; anon can read (public gallery).

3. Security
- artworks RLS:
  - SELECT: anon + authenticated (public can view, admin can view)
  - INSERT: authenticated only (only the signed-in artist can add)
  - UPDATE: authenticated only (only the signed-in artist can edit)
  - DELETE: authenticated only (only the signed-in artist can delete)
- Storage bucket `artworks`:
  - SELECT: anon + authenticated (public can view images)
  - INSERT: authenticated only (only signed-in artist can upload)
  - UPDATE: authenticated only
  - DELETE: authenticated only

4. Important Notes
- The admin signs in with email/password via Supabase Auth.
- Auth is enabled on this table now. The public site (anon key) can still read.
- Only authenticated users can add, edit, or remove artworks.
*/

-- Artworks table: add write policies for authenticated users
DROP POLICY IF EXISTS "auth_insert_artworks" ON artworks;
CREATE POLICY "auth_insert_artworks" ON artworks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_artworks" ON artworks;
CREATE POLICY "auth_update_artworks" ON artworks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_artworks" ON artworks;
CREATE POLICY "auth_delete_artworks" ON artworks FOR DELETE
  TO authenticated USING (true);

-- Storage: create the artworks bucket (public so images are visible to visitors)
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated can manage, anon can read
DROP POLICY IF EXISTS "anon_read_artwork_images" ON storage.objects;
CREATE POLICY "anon_read_artwork_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'artworks');

DROP POLICY IF EXISTS "auth_insert_artwork_images" ON storage.objects;
CREATE POLICY "auth_insert_artwork_images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'artworks');

DROP POLICY IF EXISTS "auth_update_artwork_images" ON storage.objects;
CREATE POLICY "auth_update_artwork_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'artworks') WITH CHECK (bucket_id = 'artworks');

DROP POLICY IF EXISTS "auth_delete_artwork_images" ON storage.objects;
CREATE POLICY "auth_delete_artwork_images" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'artworks');