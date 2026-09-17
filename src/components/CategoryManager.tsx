import { useState } from 'react';
import { Plus, Trash2, GripVertical, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';

type CategoryManagerProps = {
  categories: Category[];
  onUpdated: () => void;
};

export function CategoryManager({ categories, onUpdated }: CategoryManagerProps) {
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    setAdding(true);

    const maxOrder = sorted.length > 0 ? Math.max(...sorted.map((c) => c.display_order)) : 0;

    const { error: insertError } = await supabase
      .from('categories')
      .insert({ name: newName.trim(), display_order: maxOrder + 1 });

    if (insertError) {
      if (insertError.message.includes('duplicate') || insertError.message.includes('unique')) {
        setError('A category with that name already exists');
      } else {
        setError(insertError.message);
      }
    } else {
      setNewName('');
      onUpdated();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const artworkCount = await supabase
      .from('artworks')
      .select('id', { count: 'exact', head: true })
      .eq('category', name);

    if (artworkCount.count && artworkCount.count > 0) {
      setError(`Cannot delete "${name}" — it has ${artworkCount.count} artwork(s) in it. Move or delete them first.`);
      return;
    }

    if (!confirm(`Delete the category "${name}"?`)) return;

    setDeletingId(id);
    setError(null);
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      onUpdated();
    }
    setDeletingId(null);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-charcoal-900 mb-2">
        Categories
      </h2>
      <p className="text-charcoal-500 text-sm mb-6">
        These appear in your navigation and as gallery sections. Add categories for different types of work (e.g. Acrylic Paintings, Accessories, Watercolors).
      </p>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-blush-50 text-blush-600 text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Add new */}
      <form onSubmit={handleAdd} className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name (e.g. Watercolors)"
          className="flex-1 px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-charcoal-800 placeholder-charcoal-400 outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-60"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {/* List */}
      <div className="space-y-2">
        {sorted.map((cat, index) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 hover:shadow-sm transition-shadow"
          >
            <GripVertical className="w-4 h-4 text-charcoal-300" />
            <span className="text-sm text-charcoal-400 w-6">{index + 1}.</span>
            <span className="flex-1 font-medium text-charcoal-800">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              disabled={deletingId === cat.id}
              className="w-9 h-9 rounded-full flex items-center justify-center text-blush-400 hover:bg-blush-50 transition-colors"
              title="Delete category"
            >
              {deletingId === cat.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-center text-charcoal-400 py-8">No categories yet. Add one above to get started.</p>
        )}
      </div>
    </div>
  );
}
