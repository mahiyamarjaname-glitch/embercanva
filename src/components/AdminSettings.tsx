import { useState, useRef } from 'react';
import { Save, Upload, Loader2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/supabase';

type AdminSettingsProps = {
  settings: SiteSettings;
  onSaved: () => void;
};

export function AdminSettings({ settings, onSaved }: AdminSettingsProps) {
  const [form, setForm] = useState({
    brand_name: settings.brand_name,
    artist_name: settings.artist_name,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    hero_description: settings.hero_description,
    hero_image_url: settings.hero_image_url ?? '',
    about_text: settings.about_text,
    about_image_url: settings.about_image_url ?? '',
    about_stat1_value: settings.about_stat1_value ?? '',
    about_stat1_label: settings.about_stat1_label ?? '',
    about_stat2_value: settings.about_stat2_value ?? '',
    about_stat2_label: settings.about_stat2_label ?? '',
    about_stat3_value: settings.about_stat3_value ?? '',
    about_stat3_label: settings.about_stat3_label ?? '',
    contact_email: settings.contact_email,
    contact_heading: settings.contact_heading,
    contact_message: settings.contact_message,
    instagram_url: settings.instagram_url ?? '',
    tiktok_url: settings.tiktok_url ?? '',
    pinterest_url: settings.pinterest_url ?? '',
    footer_text: settings.footer_text,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleImageUpload = async (
    file: File,
    field: 'hero_image_url' | 'about_image_url'
  ) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }

    setError(null);
    setUploadingField(field);

    const fileExt = file.name.split('.').pop();
    const fileName = `${field}-${Date.now()}.${fileExt}`;
    const filePath = `site/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingField(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('artworks').getPublicUrl(filePath);
    handleChange(field, urlData.publicUrl);
    setUploadingField(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      hero_image_url: form.hero_image_url || null,
      about_image_url: form.about_image_url || null,
      instagram_url: form.instagram_url || null,
      tiktok_url: form.tiktok_url || null,
      pinterest_url: form.pinterest_url || null,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', 1);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      onSaved();
    }
    setSaving(false);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-charcoal-800 placeholder-charcoal-400 outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all text-sm';

  const labelClass = 'block text-sm font-medium text-charcoal-700 mb-1.5';

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-serif text-lg font-medium text-charcoal-900 mb-4 mt-8 first:mt-0 pb-2 border-b border-cream-200">
      {children}
    </h3>
  );

  const ImageUploadButton = ({
    field,
    fileRef,
    label,
    currentUrl,
  }: {
    field: 'hero_image_url' | 'about_image_url';
    fileRef: React.RefObject<HTMLInputElement | null>;
    label: string;
    currentUrl: string;
  }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        {currentUrl && (
          <img
            src={currentUrl}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover bg-cream-200 shrink-0"
          />
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploadingField === field}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal-600 bg-cream-100 hover:bg-cream-200 transition-colors"
        >
          {uploadingField === field ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {currentUrl ? 'Change image' : 'Upload image'}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={() => handleChange(field, '')}
            className="text-sm text-charcoal-400 hover:text-blush-500 transition-colors"
          >
            Remove
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, field);
          }}
          className="hidden"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSave}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-medium text-charcoal-900">
          Site Settings
        </h2>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <p className="text-charcoal-500 text-sm mb-6">
        Edit all the text, images, contact info, and social links on your website. Changes appear immediately after saving.
      </p>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-blush-50 text-blush-600 text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand */}
      <SectionTitle>Brand & Artist</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Brand name (appears in header & footer)</label>
          <input
            type="text"
            value={form.brand_name}
            onChange={(e) => handleChange('brand_name', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Your name</label>
          <input
            type="text"
            value={form.artist_name}
            onChange={(e) => handleChange('artist_name', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Hero */}
      <SectionTitle>Hero Section (top of homepage)</SectionTitle>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Subtitle (small text above headline)</label>
          <input
            type="text"
            value={form.hero_subtitle}
            onChange={(e) => handleChange('hero_subtitle', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Headline (main large text)</label>
          <input
            type="text"
            value={form.hero_title}
            onChange={(e) => handleChange('hero_title', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Description (paragraph below headline)</label>
          <textarea
            rows={3}
            value={form.hero_description}
            onChange={(e) => handleChange('hero_description', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
        <ImageUploadButton
          field="hero_image_url"
          fileRef={heroFileRef}
          label="Hero background image (optional — defaults to a studio photo)"
          currentUrl={form.hero_image_url}
        />
      </div>

      {/* About */}
      <SectionTitle>About Section</SectionTitle>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>About text (your bio — use line breaks to separate paragraphs)</label>
          <textarea
            rows={6}
            value={form.about_text}
            onChange={(e) => handleChange('about_text', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
        <ImageUploadButton
          field="about_image_url"
          fileRef={aboutFileRef}
          label="Your portrait/studio photo"
          currentUrl={form.about_image_url}
        />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-2">
              <input
                type="text"
                value={form[`about_stat${n}_value` as keyof typeof form] as string}
                onChange={(e) => handleChange(`about_stat${n}_value` as keyof typeof form, e.target.value)}
                placeholder="120+"
                className={inputClass}
              />
              <input
                type="text"
                value={form[`about_stat${n}_label` as keyof typeof form] as string}
                onChange={(e) => handleChange(`about_stat${n}_label` as keyof typeof form, e.target.value)}
                placeholder="Original works"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <SectionTitle>Contact Section</SectionTitle>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Contact heading</label>
          <input
            type="text"
            value={form.contact_heading}
            onChange={(e) => handleChange('contact_heading', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Contact message (paragraph)</label>
          <textarea
            rows={2}
            value={form.contact_message}
            onChange={(e) => handleChange('contact_message', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div>
          <label className={labelClass}>Contact email</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Social */}
      <SectionTitle>Social Media Links</SectionTitle>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input
            type="text"
            value={form.instagram_url}
            onChange={(e) => handleChange('instagram_url', e.target.value)}
            placeholder="https://instagram.com/yourusername"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>TikTok URL</label>
          <input
            type="text"
            value={form.tiktok_url}
            onChange={(e) => handleChange('tiktok_url', e.target.value)}
            placeholder="https://tiktok.com/@yourusername"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pinterest URL</label>
          <input
            type="text"
            value={form.pinterest_url}
            onChange={(e) => handleChange('pinterest_url', e.target.value)}
            placeholder="https://pinterest.com/yourusername"
            className={inputClass}
          />
        </div>
      </div>

      {/* Footer */}
      <SectionTitle>Footer</SectionTitle>
      <div>
        <label className={labelClass}>Footer copyright text</label>
        <input
          type="text"
          value={form.footer_text}
          onChange={(e) => handleChange('footer_text', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Save button at bottom too */}
      <div className="mt-8 pt-6 border-t border-cream-200">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save all changes'}
        </button>
      </div>
    </form>
  );
}
