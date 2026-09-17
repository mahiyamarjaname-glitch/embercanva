import { ArrowDown } from 'lucide-react';
import type { SiteSettings } from '@/lib/supabase';

type HeroProps = {
  settings: SiteSettings | null;
};

export function Hero({ settings }: HeroProps) {
  const subtitle = settings?.hero_subtitle ?? 'Art & Accessories by Mahiya';
  const title = settings?.hero_title ?? 'Where colors whisper and art breathes';
  const description = settings?.hero_description ?? '';
  const heroImage = settings?.hero_image_url;

  // Split title to style alternate words with italic + color
  const words = title.split(' ');
  const midPoint = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, midPoint).join(' ');
  const secondHalf = words.slice(midPoint).join(' ');

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream-100">
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt="Studio background"
            className="w-full h-full object-cover opacity-30"
          />
        ) : (
          <img
            src="https://images.pexels.com/photos/20451088/pexels-photo-20451088.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800"
            alt="Artist studio"
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50/60 via-cream-50/40 to-cream-50" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
        <p className="text-blush-500 font-medium tracking-widest uppercase text-xs sm:text-sm mb-6 animate-fadeIn">
          {subtitle}
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-charcoal-900 leading-[1.1] mb-8 animate-fadeInUp">
          {firstHalf}
          <br />
          <span className="italic text-blush-500">{secondHalf}</span>
        </h1>
        <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => document.querySelector('#cat-0')?.scrollIntoView({ behavior: 'smooth' }) || document.querySelector('[id^="cat-"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-full bg-charcoal-900 text-cream-50 font-medium hover:bg-charcoal-800 transition-colors shadow-md"
          >
            Explore Gallery
          </button>
          <button
            onClick={() => document.querySelector('#custom-orders')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-full bg-transparent text-charcoal-900 font-medium border border-charcoal-300 hover:bg-cream-200 transition-colors"
          >
            Commission a Piece
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-charcoal-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
