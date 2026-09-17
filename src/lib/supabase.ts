import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Artwork = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  image_width: number | null;
  image_height: number | null;
  category: string;
  price: number | null;
  medium: string | null;
  year: number | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  brand_name: string;
  artist_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string | null;
  about_text: string;
  about_image_url: string | null;
  about_stat1_value: string | null;
  about_stat1_label: string | null;
  about_stat2_value: string | null;
  about_stat2_label: string | null;
  about_stat3_value: string | null;
  about_stat3_label: string | null;
  contact_email: string;
  contact_heading: string;
  contact_message: string;
  instagram_url: string | null;
  tiktok_url: string | null;
  pinterest_url: string | null;
  footer_text: string;
  updated_at: string;
};
