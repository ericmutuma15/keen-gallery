import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import portrait from '../assets/edgar-keen-portrait.svg';
import workOne from '../assets/WhatsApp Image 2026-08-10 at 11.38.52.jpeg';
import workTwo from '../assets/WhatsApp Image 2026-08-10 at 11.38.53.jpeg';
import workThree from '../assets/WhatsApp Image 2026-08-10 at 11.38.54.jpeg';

const fallbackFeatured = [
  { id: '1', slug: 'machakos-light', title: 'Machakos Light', category: { name: 'Portrait' }, imageUrl: workOne },
  { id: '2', slug: 'after-rain', title: 'After Rain', category: { name: 'Abstract' }, imageUrl: workTwo },
  { id: '3', slug: 'night-market', title: 'Night Market', category: { name: 'Street' }, imageUrl: workThree },
];

function ArtworkCard({ artwork }) {
  return (
    <Link to={`/artwork/${artwork.slug}`} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#121b20]/80 shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
      <img src={artwork.imageUrl} alt={artwork.title} className="h-80 w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b10]/90 via-[#070b10]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-[#f3efe6]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f3efe6]/75">{artwork.category?.name}</p>
        <h3 className="mt-2 font-serif text-2xl">{artwork.title}</h3>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    apiRequest('/artworks/featured')
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]));
  }, []);

  const displayFeatured = featured.length ? featured : fallbackFeatured;

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:pb-32 lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#f2b77a]/20 bg-[#f2b77a]/10 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#f5c58a]">
            <Sparkles size={14} /> Kenyan artist portfolio
          </div>
          <h1 className="font-serif text-5xl leading-none text-[#f5efe6] sm:text-6xl lg:text-7xl">
            Edgar Keen
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-[#d3b791]">
            Machakos, Kenya
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#dfe3dd]/75">
            A young Kenyan Gen Z visual storyteller creating intimate portraits, digital textures, and modern scenes shaped by everyday life across Kenya.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full bg-[#f2b77a] px-6 py-3 text-sm uppercase tracking-[0.2em] text-[#11181b] transition hover:bg-[#f7c98f]">
              Explore Artwork <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.2em] text-[#f5efe6] transition hover:bg-white/5">
              Work With Me
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1215] shadow-[0_35px_90px_rgba(0,0,0,0.55)]">
            <img src={portrait} alt="Edgar Keen portrait" className="h-[560px] w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-[#0e1518]/80 p-4 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">Featured collection</p>
            <h2 className="mt-2 font-serif text-2xl text-[#f5efe6]">The Nairobi Pulse</h2>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">Selected works</p>
            <h2 className="mt-2 font-serif text-4xl text-[#f5efe6]">Featured gallery</h2>
          </div>
          <Link to="/gallery" className="text-sm uppercase tracking-[0.2em] text-[#f5efe6]/80">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayFeatured.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </div>
  );
}
