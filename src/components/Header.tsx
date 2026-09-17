import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import type { Category, SiteSettings } from '@/lib/supabase';

type HeaderProps = {
  settings: SiteSettings | null;
  categories: Category[];
};

export function Header({ settings, categories }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const brand = settings?.brand_name ?? 'MahiyaCanva';

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    ...categories
      .sort((a, b) => a.display_order - b.display_order)
      .map((c) => ({
        label: c.name,
        href: `#cat-${c.id}`,
      })),
    { label: 'Custom Orders', href: '#custom-orders' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => handleClick('#home')} className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full bg-blush-500 flex items-center justify-center">
            <Palette className="w-5 h-5 text-cream-50" />
          </div>
          <span className="font-serif text-xl font-semibold text-charcoal-800 tracking-tight">
            {brand}
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-charcoal-700 hover:bg-cream-200/60 hover:text-charcoal-900 transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block w-5 h-0.5 bg-charcoal-800 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-charcoal-800 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-charcoal-800 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-cream-50 border-t border-cream-200">
          <nav className="flex flex-col p-3 gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className="px-4 py-3 rounded-xl text-left text-sm font-medium text-charcoal-700 hover:bg-cream-200/60 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
