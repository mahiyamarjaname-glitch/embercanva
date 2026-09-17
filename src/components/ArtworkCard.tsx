import { useState } from 'react';
import type { Artwork } from '@/lib/supabase';

type ArtworkCardProps = {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
};

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const aspectRatio =
    artwork.image_width && artwork.image_height
      ? `${artwork.image_width} / ${artwork.image_height}`
      : '3 / 4';

  return (
    <div
      className="mb-5 group cursor-zoom-in animate-fadeInUp"
      onClick={() => onClick(artwork)}
    >
      <div
        className="relative rounded-2xl overflow-hidden bg-cream-200 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-charcoal-900/10"
        style={{ aspectRatio }}
      >
        {!loaded && !errored && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-200 to-cream-300" />
        )}
        {errored ? (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
            <span className="text-charcoal-400 text-sm">Image unavailable</span>
          </div>
        ) : (
          <img
            src={artwork.image_url}
            alt={artwork.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-105`}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price tag */}
        {artwork.price && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <span className="px-3 py-1.5 rounded-full bg-cream-50/95 text-charcoal-900 text-sm font-semibold shadow-md">
              ${artwork.price.toFixed(0)}
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="px-1 pt-3">
        <h3 className="font-serif text-base font-medium text-charcoal-900 line-clamp-1">
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-500">
          {artwork.medium && <span>{artwork.medium}</span>}
          {artwork.medium && artwork.year && <span>·</span>}
          {artwork.year && <span>{artwork.year}</span>}
        </div>
      </div>
    </div>
  );
}
