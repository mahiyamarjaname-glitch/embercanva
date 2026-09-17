import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Artwork, Category, SiteSettings } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { GallerySection } from '@/components/GallerySection';
import { CustomOrders } from '@/components/CustomOrders';
import { Contact } from '@/components/Contact';
import { ArtworkModal } from '@/components/ArtworkModal';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';

type Route = 'site' | 'admin';

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [route, setRoute] = useState<Route>(() =>
    window.location.hash === '#admin' ? 'admin' : 'site'
  );
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash === '#admin' ? 'admin' : 'site');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (route !== 'site') return;
    async function fetchAll() {
      const [artworksRes, categoriesRes, settingsRes] = await Promise.all([
        supabase.from('artworks').select('*').order('created_at', { ascending: true }),
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      ]);

      if (artworksRes.error) {
        setError('Unable to load artworks. Please try again later.');
      } else {
        setArtworks(artworksRes.data as Artwork[]);
        setCategories(categoriesRes.data as Category[]);
        if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
      }
      setLoading(false);
    }
    fetchAll();
  }, [route]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.display_order - b.display_order),
    [categories]
  );

  const goToAdmin = () => {
    window.location.hash = 'admin';
    setRoute('admin');
  };

  const goToSite = () => {
    window.location.hash = '';
    setRoute('site');
  };

  if (route === 'admin') {
    if (!authChecked) {
      return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center">
          <div className="animate-pulse text-charcoal-400 font-serif text-lg">Loading...</div>
        </div>
      );
    }

    if (!session) {
      return <AdminLogin onSuccess={() => {}} onBack={goToSite} />;
    }

    return (
      <AdminDashboard
        onSignOut={() => setSession(null)}
        onBackToSite={goToSite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header settings={settings} categories={categories} />
      <Hero settings={settings} />
      <About settings={settings} />

      {loading ? (
        <div className="py-24 text-center">
          <p className="text-charcoal-400 font-serif text-xl">Loading artworks...</p>
        </div>
      ) : error ? (
        <div className="py-24 text-center">
          <p className="text-blush-500 font-serif text-xl">{error}</p>
        </div>
      ) : (
        sortedCategories.map((category) => (
          <GallerySection
            key={category.id}
            category={category}
            artworks={artworks.filter((a) => a.category === category.name)}
            onArtworkClick={setSelectedArtwork}
          />
        ))
      )}

      <CustomOrders />
      <Contact settings={settings} onAdminClick={goToAdmin} />

      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
}
