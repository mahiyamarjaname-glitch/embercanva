import type { Artwork, Category } from '@/lib/supabase';
import { ArtworkCard } from './ArtworkCard';

type GallerySectionProps = {
  category: Category;
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
};

export function GallerySection({ category, artworks, onArtworkClick }: GallerySectionProps) {
  if (artworks.length === 0) return null;

  const columnCount = 4;
  const columns: Artwork[][] = Array.from({ length: columnCount }, () => []);
  artworks.forEach((art, i) => columns[i % columnCount].push(art));

  return (
    <section id={`cat-${category.id}`} className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blush-500 font-medium tracking-widest uppercase text-xs mb-3">
            Collection
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal-900">
            {category.name}
          </h2>
          <div className="w-16 h-0.5 bg-blush-300 mx-auto mt-6" />
        </div>

        <div className="flex gap-5">
          {columns.map((col, i) => (
            <div key={i} className="flex-1 min-w-0">
              {col.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={onArtworkClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
