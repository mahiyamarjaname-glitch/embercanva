import { Instagram, Mail, Music, Palette, Lock } from 'lucide-react';
import type { SiteSettings } from '@/lib/supabase';

type ContactProps = {
  settings: SiteSettings | null;
  onAdminClick: () => void;
};

export function Contact({ settings, onAdminClick }: ContactProps) {
  const heading = settings?.contact_heading ?? "Let's create something beautiful together";
  const message = settings?.contact_message ?? '';
  const email = settings?.contact_email ?? 'hello@mahiyacanva.art';
  const footerText = settings?.footer_text ?? '© 2026 MahiyaCanva. All artworks are original and protected.';
  const brand = settings?.brand_name ?? 'MahiyaCanva';

  const socials = [
    { icon: Instagram, label: 'Instagram', url: settings?.instagram_url },
    { icon: Music, label: 'TikTok', url: settings?.tiktok_url },
    { icon: Mail, label: 'Email', url: email ? `mailto:${email}` : null },
  ].filter((s) => s.url);

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-charcoal-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-blush-500 flex items-center justify-center mx-auto mb-6">
          <Palette className="w-7 h-7 text-cream-50" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-medium text-cream-50 leading-tight mb-6">
          {heading}
        </h2>

        <p className="text-cream-200 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          {message}
        </p>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cream-50 text-charcoal-900 font-medium hover:bg-cream-100 transition-colors shadow-md"
        >
          <Mail className="w-4 h-4" />
          {email}
        </a>

        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {socials.map(({ icon: Icon, label, url }) => (
              <a
                key={label}
                href={url ?? '#'}
                target={url?.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full bg-charcoal-800 hover:bg-blush-500 flex items-center justify-center text-cream-200 hover:text-cream-50 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-charcoal-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg text-cream-100">{brand}</p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-charcoal-400">{footerText}</p>
            <button
              onClick={onAdminClick}
              aria-label="Admin login"
              className="w-9 h-9 rounded-full bg-charcoal-800 hover:bg-charcoal-700 flex items-center justify-center text-charcoal-400 hover:text-cream-100 transition-colors"
              title="Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
