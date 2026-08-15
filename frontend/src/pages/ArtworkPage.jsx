import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiRequest } from '../services/api';
import { findLocalBySlug } from '../data/localArtworks';

export default function ArtworkPage() {
  const { slug } = useParams();
  const [artwork, setArtwork] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    apiRequest(`/artworks/${slug}`)
      .then((res) => setArtwork(res.data))
      .catch(() => {
        // if API misses, check local assets
        const local = findLocalBySlug(slug);
        if (local) {
          setArtwork(local);
          setError(null);
        } else {
          setArtwork(null);
          setError('This artwork could not be found.');
        }
      });
  }, [slug]);

  if (!artwork && !error) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-[#e7e2d9]">Loading artwork...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[#e7e2d9]">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#d0b38d]">Artwork unavailable</p>
        <h1 className="font-serif text-4xl text-[#f5efe6]">{error}</h1>
        <Link to="/gallery" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f2b77a] px-6 py-3 text-sm uppercase tracking-[0.18em] text-[#11181b]">
          <ArrowLeft size={16} /> Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link to="/gallery" className="mb-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-[#d0b38d]">
        <ArrowLeft size={16} /> Back to gallery
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#10181b]/80 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <picture>
            {artwork.imageUrl && artwork.imageUrl.endsWith('.svg') ? null : (
              <source srcSet={artwork.imageUrl ? artwork.imageUrl.replace(/(\.(?:jpe?g|png))(\?.*)?$/i, '.webp$2') : ''} type="image/webp" />
            )}
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full object-cover" />
          </picture>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">{artwork.category?.name} / {artwork.subcategory?.name}</p>
            <h1 className="mt-3 font-serif text-5xl text-[#f5efe6]">{artwork.title}</h1>
          </div>
          <p className="text-lg text-[#dfe3dd]/80">{artwork.description}</p>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#10181b]/80 p-5 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#d0b38d]">Medium</p><p className="mt-2 text-[#f5efe6]">{artwork.medium}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#d0b38d]">Year</p><p className="mt-2 text-[#f5efe6]">{artwork.year}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#d0b38d]">Dimensions</p><p className="mt-2 text-[#f5efe6]">{artwork.dimensions}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#d0b38d]">Availability</p><p className="mt-2 text-[#f5efe6]">{artwork.availability}</p></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full bg-[#f2b77a] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#11181b]">{artwork.price ? `KSh ${artwork.price}` : 'Available for commission'}</div>
            <Link to="/contact" className="rounded-full border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#f5efe6] hover:bg-white/5">Inquire</Link>
          </div>
        </div>
      </div>

      {artwork.related?.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-4xl text-[#f5efe6]">Related works</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {artwork.related.map((item) => (
              <Link key={item.id} to={`/artwork/${item.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#10181b]/80 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <img src={item.imageUrl} alt={item.title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#d0b38d]">{item.category?.name}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#f5efe6]">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
