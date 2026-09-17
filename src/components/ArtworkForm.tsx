import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Artwork, Category } from '@/lib/supabase';

type ArtworkFormProps = {
  artwork?: Artwork | null;
  categories: Category[];
  onSaved: () => void;
  onCancel: () => void;
};

export function ArtworkForm({ artwork, categories, onSaved, onCancel }: ArtworkFormProps) {
  const isEditing = !!artwork;

  const [form, setForm] = useState({
    title: artwork?.title ?? '',
    description: artwork?.description ?? '',
    category: artwork?.category ?? categories[0]?.name ?? '',
    price: artwork?.price?.toString() ?? '',
    medium: artwork?.medium ?? '',
    year: artwork?.year?.toString() ?? new Date().getFullYear().toString(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(artwork?.image_url ?? '');
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(
    artwork?.image_width && artwork?.image_height
      ? { w: artwork.image_width, h: artwork.image_height }
      : null
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }

    setError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    const img = new Image();
    img.onload = () => {
      setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;
  };

  const uploadImage = async (): Promise<{ url: string; width: number; height: number }> => {
    if (!imageFile && artwork) {
      return {
        url: artwork.image_url,
        width: artwork.image_width ?? 0,
        height: artwork.image_height ?? 0,
      };
    }

    if (!imageFile) {
      throw new Error('Please select an image');
    }

    setUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `artworks/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('artworks').getPublicUrl(filePath);

    setUploading(false);
    return {
      url: urlData.publicUrl,
      width: imageDims?.w ?? 0,
      height: imageDims?.h ?? 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const imageData = await uploadImage();

      const payload = {
        title: form.title,
        description: form.description || null,
        image_url: imageData.url,
        image_width: imageData.width || null,
        image_height: imageData.height || null,
        category: form.category,
        price: form.price ? parseFloat(form.price) : null,
        medium: form.medium || null,
        year: form.year ? parseInt(form.year) : null,
      };

      if (isEditing && artwork) {
        const { error: updateError } = await supabase
          .from('artworks')
          .update(payload)
          .eq('id', artwork.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('artworks')
          .insert(payload);
        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save artwork';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-charcoal-800 placeholder-charcoal-400 outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-cream-50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cream-50 px-6 py-5 border-b border-cream-200 flex items-center justify-between z-10">
          <h2 className="font-serif text-xl font-medium text-charcoal-900">
            {isEditing ? 'Edit artwork' : 'Add a new artwork'}
          </h2>
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-500 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Artwork image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-2xl border-2 border-dashed border-cream-400 hover:border-blush-400 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-cream-100"
                  />
                  <div className="absolute inset-0 bg-charcoal-900/0 hover:bg-charcoal-900/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="text-cream-50 text-sm font-medium bg-charcoal-900/80 px-4 py-2 rounded-full">
                      Click to change image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-charcoal-400">
                  <ImageIcon className="w-10 h-10 mb-3" />
                  <p className="text-sm font-medium">Click to upload an image</p>
                  <p className="text-xs mt-1">JPG, PNG, or WebP — up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Whispers of Dawn"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short description of the piece..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {categories.sort((a, b) => a.display_order - b.display_order).map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Year
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2024"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Medium
              </label>
              <input
                type="text"
                value={form.medium}
                onChange={(e) => setForm({ ...form, medium: e.target.value })}
                placeholder="e.g. Acrylic on canvas"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 480"
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-blush-50 text-blush-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-full text-charcoal-600 font-medium hover:bg-cream-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading image...
                </>
              ) : saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {isEditing ? 'Save changes' : 'Add artwork'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
