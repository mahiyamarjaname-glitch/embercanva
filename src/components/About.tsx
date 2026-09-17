import type { SiteSettings } from '@/lib/supabase';

type AboutProps = {
  settings: SiteSettings | null;
};

export function About({ settings }: AboutProps) {
  const artistName = settings?.artist_name ?? 'Mahiya';
  const aboutText = settings?.about_text ?? '';
  const aboutImage = settings?.about_image_url
    ?? 'https://images.pexels.com/photos/22690827/pexels-photo-22690827.jpeg?auto=compress&cs=tinysrgb&h=800&w=600';

  const stats = [
    { value: settings?.about_stat1_value ?? '120+', label: settings?.about_stat1_label ?? 'Original works' },
    { value: settings?.about_stat2_value ?? '8', label: settings?.about_stat2_label ?? 'Years painting' },
    { value: settings?.about_stat3_value ?? '45', label: settings?.about_stat3_label ?? 'Commissions' },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src={aboutImage}
                alt={`${artistName} at work`}
                className="w-full h-full object-cover aspect-[4/5]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl bg-blush-100 -z-10 hidden sm:block" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-sage-100 -z-10 hidden sm:block" />
          </div>

          <div>
            <p className="text-blush-500 font-medium tracking-widest uppercase text-xs mb-4">
              The Artist
            </p>
            <h2 className="font-serif text-4xl font-medium text-charcoal-900 leading-tight mb-6">
              Hello, I'm {artistName}
            </h2>
            <div className="space-y-4 text-charcoal-700 leading-relaxed whitespace-pre-line">
              {aboutText}
            </div>

            <div className="flex gap-8 mt-10 pt-8 border-t border-cream-300">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-serif text-3xl font-medium text-blush-500">{stat.value}</p>
                  <p className="text-sm text-charcoal-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
