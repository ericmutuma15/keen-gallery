import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiRequest } from '../services/api';
import { localArtworks } from '../data/localArtworks';

function normalizeSlug(slug) {
  if (!slug) return '';
  return slug.replace(/-local$/i, '').toLowerCase();
}

function resolveImageFor(artwork) {
  if (!artwork) return localArtworks[0]?.imageUrl || '';
  // try by slug (normalize both)
  const artSlug = normalizeSlug(artwork.slug);
  if (artSlug) {
    const bySlug = localArtworks.find((l) => normalizeSlug(l.slug) === artSlug || l.slug === artSlug);
    if (bySlug) return bySlug.imageUrl;
  }
  // try by title
  if (artwork.title) {
    const byTitle = localArtworks.find((l) => l.title && l.title.toLowerCase() === artwork.title.toLowerCase());
    if (byTitle) return byTitle.imageUrl;
  }
  // fallback to first local asset
  return localArtworks[0]?.imageUrl || artwork.imageUrl || '';
}

function getWebpUrl(url) {
  if (!url) return null;
  if (url.endsWith('.svg')) return null;
  return url.replace(/(\.(?:jpe?g|png))(\?.*)?$/i, '.webp$2');
}

const defaultCategories = [
  { id: 'portrait', name: 'Portrait', slug: 'portrait', subcategories: [] },
  { id: 'abstract', name: 'Abstract', slug: 'abstract', subcategories: [] },
  { id: 'street', name: 'Street', slug: 'street', subcategories: [] },
  { id: 'photography', name: 'Photography', slug: 'photography', subcategories: [] },
  { id: 'digital', name: 'Digital', slug: 'digital', subcategories: [] },
];

export default function GalleryPage() {
  const [artworks, setArtworks] = useState(localArtworks);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [artRes, catRes] = await Promise.all([
          apiRequest('/artworks?limit=12'),
          apiRequest('/categories'),
        ]);
        if (artRes.data?.length) {
          // Map fetched artworks to local images and compute normalized slugs
          const fetchedAll = artRes.data.map((a) => {
            const imageUrl = resolveImageFor(a);
            const _normSlug = normalizeSlug(a.slug) || (a.title && a.title.toLowerCase());
            return { ...a, imageUrl, _normSlug };
          });

          const firstSix = fetchedAll.slice(0, 6);

          // build set of normalized slugs/titles present in firstSix
          const firstSet = new Set(firstSix.map((a) => a._normSlug || (a.title && a.title.toLowerCase())));

          const toAppend = localArtworks.filter((f) => {
            const fNorm = normalizeSlug(f.slug) || (f.title && f.title.toLowerCase());
            if (firstSet.has(fNorm)) return false;
            // also avoid title duplicates
            if (firstSix.some((a) => a.title && f.title && a.title.toLowerCase() === f.title.toLowerCase())) return false;
            return true;
          }).slice(0, 6);

          const merged = [...firstSix, ...toAppend];
          setArtworks(merged);
        } else {
          // no API results: show up to 12 local artworks
          setArtworks(localArtworks.slice(0, 12));
        }
        if (catRes.data?.length) setCategories(catRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const filtered = artworks.filter((art) => {
    const matchesCategory = !selectedCategory || art.category?.slug === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || art.subcategory?.slug === selectedSubcategory;
    const matchesQuery = !query || art.title.toLowerCase().includes(query.toLowerCase()) || art.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesQuery;
  });

  const activeSubcategories = categories.find((category) => category.slug === selectedCategory)?.subcategories || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">Collection</p>
          <h1 className="mt-2 font-serif text-5xl text-[#f5efe6]">Gallery</h1>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5efe6]/50" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search works"
            className="w-full rounded-full border border-white/10 bg-[#121b20]/80 py-3 pl-11 pr-4 text-sm text-[#f5efe6] outline-none ring-0 placeholder:text-[#f5efe6]/40"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${!selectedCategory ? 'bg-[#f2b77a] text-[#11181b]' : 'border-white/10 bg-[#121b20]/80 text-[#f5efe6]'}`}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => { setSelectedCategory(category.slug); setSelectedSubcategory(''); }}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${selectedCategory === category.slug ? 'bg-[#f2b77a] text-[#11181b]' : 'border-white/10 bg-[#121b20]/80 text-[#f5efe6]'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="mb-8 flex flex-wrap gap-3">
          <button onClick={() => setSelectedSubcategory('')} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${!selectedSubcategory ? 'bg-[#d4a371] text-[#0d1114]' : 'border-white/10 bg-[#121b20]/80 text-[#f5efe6]'}`}>
            All {categories.find((category) => category.slug === selectedCategory)?.name}
          </button>
          {activeSubcategories.map((subcategory) => (
            <button key={subcategory.id} onClick={() => setSelectedSubcategory(subcategory.slug)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${selectedSubcategory === subcategory.slug ? 'bg-[#d4a371] text-[#0d1114]' : 'border-white/10 bg-[#121b20]/80 text-[#f5efe6]'}`}>
              {subcategory.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((artwork) => (
          // debug: log imageUrl to help diagnose missing images
          (console.debug && console.debug('ART IMAGE', artwork.title, artwork.imageUrl)),
          <Link key={artwork.id} to={`/artwork/${artwork.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#11181b]/80 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
              <div className="overflow-hidden">
                <picture>
                  {getWebpUrl(artwork.imageUrl) && <source srcSet={getWebpUrl(artwork.imageUrl)} type="image/webp" />}
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = (localArtworks[0] && localArtworks[0].imageUrl) || ''; }}
                  />
                </picture>
              </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#d0b38d]">
                <span>{artwork.category?.name}</span>
                <span>{artwork.year}</span>
              </div>
              <h3 className="font-serif text-2xl text-[#f5efe6]">{artwork.title}</h3>
              <p className="text-sm text-[#dfe3dd]/75">{artwork.medium}</p>
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 bg-[#121b20]/60 p-10 text-center text-[#e7e2d9]">
          No works matched your current filter.
        </div>
      )}
    </div>
  );
}
