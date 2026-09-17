import { useEffect } from 'react';
import { X, Brush, Calendar, Tag } from 'lucide-react';
import type { Artwork } from '@/lib/supabase';

type ArtworkModalProps = {
  artwork: Artwork | null;
  onClose: () => void;
};

export function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [artwork]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-cream-50 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slideUp flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-cream-50/90 hover:bg-cream-100 flex items-center justify-center text-charcoal-700 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="md:w-1/2 bg-cream-200 flex items-center justify-center overflow-hidden">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover max-h-[45vh] md:max-h-[90vh]"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-8 sm:p-10 overflow-y-auto">
          <p className="text-blush-500 font-medium tracking-widest uppercase text-xs mb-3">
            {artwork.category === 'paintings' ? 'Painting' : 'Fashion Editorial'}
          </p>
          <h2 className="font-serif text-3xl font-medium text-charcoal-900 leading-tight mb-4">
            {artwork.title}
          </h2>

          {artwork.description && (
            <p className="text-charcoal-700 leading-relaxed mb-8">
              {artwork.description}
            </p>
          )}

          {/* Details grid */}
          <div className="space-y-3 py-6 border-y border-cream-300">
            {artwork.medium && (
              <div className="flex items-center gap-3">
                <Brush className="w-4 h-4 text-charcoal-400" />
                <span className="text-sm text-charcoal-500">Medium</span>
                <span className="text-sm font-medium text-charcoal-800 ml-auto">{artwork.medium}</span>
              </div>
            )}
            {artwork.year && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-charcoal-400" />
                <span className="text-sm text-charcoal-500">Year</span>
                <span className="text-sm font-medium text-charcoal-800 ml-auto">{artwork.year}</span>
              </div>
            )}
            {artwork.price && (
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-charcoal-400" />
                <span className="text-sm text-charcoal-500">Price</span>
                <span className="text-sm font-medium text-charcoal-800 ml-auto">${artwork.price.toFixed(0)}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              onClose();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full mt-8 px-6 py-3.5 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md"
          >
            Inquire about this piece
          </button>
        </div>
      </div>
    </div>
  );
}
