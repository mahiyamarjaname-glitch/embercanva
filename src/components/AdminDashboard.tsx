import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, LogOut, Palette, ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, Settings, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Artwork, Category, SiteSettings } from '@/lib/supabase';
import { ArtworkForm } from './ArtworkForm';
import { CategoryManager } from './CategoryManager';
import { AdminSettings } from './AdminSettings';

type AdminDashboardProps = {
  onSignOut: () => void;
  onBackToSite: () => void;
};

type Tab = 'artworks' | 'categories' | 'settings';

export function AdminDashboard({ onSignOut, onBackToSite }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('artworks');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const [artworksRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('artworks').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);

    if (artworksRes.data) setArtworks(artworksRes.data as Artwork[]);
    if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);
    if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
    if (artworksRes.error) setError('Failed to load artworks');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork? This cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    const { error: deleteError } = await supabase.from('artworks').delete().eq('id', id);
    if (deleteError) {
      setError('Failed to delete artwork');
    } else {
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const tabs: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
    { id: 'artworks', label: 'Artworks', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="sticky top-0 z-30 bg-cream-50 border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blush-500 flex items-center justify-center">
              <Palette className="w-5 h-5 text-cream-50" />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-charcoal-900 leading-none">
                {settings?.brand_name ?? 'MahiyaCanva'}
              </p>
              <p className="text-xs text-charcoal-500 mt-0.5">Admin dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-charcoal-600 hover:bg-cream-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">View site</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-charcoal-600 hover:bg-cream-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-blush-500 text-blush-600'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blush-50 text-blush-600 text-sm mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Artworks tab */}
        {tab === 'artworks' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl font-medium text-charcoal-900">
                  Your artworks
                </h1>
                <p className="text-charcoal-500 mt-1">
                  {artworks.length} {artworks.length === 1 ? 'piece' : 'pieces'} in your gallery
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingArtwork(null);
                  setShowForm(true);
                }}
                disabled={categories.length === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add artwork</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {categories.length === 0 && (
              <div className="px-4 py-3 rounded-xl bg-cream-200 text-charcoal-600 text-sm mb-6">
                You need to create a category first. Go to the Categories tab to add one.
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-charcoal-300" />
              </div>
            ) : artworks.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-charcoal-300" />
                </div>
                <h3 className="font-serif text-xl text-charcoal-800 mb-2">No artworks yet</h3>
                <p className="text-charcoal-500 mb-6">Add your first piece to start building your gallery.</p>
                <button
                  onClick={() => {
                    setEditingArtwork(null);
                    setShowForm(true);
                  }}
                  disabled={categories.length === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add your first artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-cream-200 overflow-hidden">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif text-base font-medium text-charcoal-900 line-clamp-1">
                          {artwork.title}
                        </h3>
                        {artwork.price && (
                          <span className="shrink-0 text-sm font-semibold text-blush-500">
                            ${artwork.price.toFixed(0)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-500 mb-3">
                        {artwork.category} · {artwork.medium || 'No medium'} · {artwork.year || '—'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingArtwork(artwork);
                            setShowForm(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-cream-200 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(artwork.id)}
                          disabled={deletingId === artwork.id}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blush-500 hover:bg-blush-50 transition-colors"
                        >
                          {deletingId === artwork.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Categories tab */}
        {tab === 'categories' && (
          <CategoryManager categories={categories} onUpdated={fetchAll} />
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          settings ? (
            <AdminSettings settings={settings} onSaved={fetchAll} />
          ) : (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-charcoal-300" />
            </div>
          )
        )}
      </div>

      {showForm && (
        <ArtworkForm
          artwork={editingArtwork}
          categories={categories}
          onSaved={() => {
            setShowForm(false);
            setEditingArtwork(null);
            fetchAll();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingArtwork(null);
          }}
        />
      )}
    </div>
  );
}
