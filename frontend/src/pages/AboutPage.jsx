import { motion } from 'framer-motion';
import portrait from '../assets/edgar-keen-portrait.svg';

const highlights = [
  'Portrait-led storytelling with a distinctly Kenyan lens',
  'Work shaped by Machakos streets, weather, and youth culture',
  'Digital art, collage, and expressive portrait practice',
  'Commissioned work for homes, brands, and creative spaces',
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#10181b] shadow-[0_35px_90px_rgba(0,0,0,0.4)]">
          <img src={portrait} alt="Edgar Keen portrait" className="h-full w-full object-cover" />
        </motion.div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">About</p>
          <h1 className="mt-2 font-serif text-5xl text-[#f5efe6]">Artist statement</h1>
          <p className="mt-6 text-lg leading-8 text-[#dfe3dd]/80">
            Edgar Keen is a young Kenyan artist based in Machakos, creating visual work that speaks to identity, aspiration, and the emotional weather of modern life in Kenya.
          </p>
          <p className="mt-5 text-lg leading-8 text-[#dfe3dd]/80">
            His practice blends portraiture, street-inspired storytelling, and layered digital textures to reflect the rhythm of city life, youth culture, and the quiet drama of everyday scenes.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div key={item} className="rounded-[2rem] border border-white/10 bg-[#10181b]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <p className="text-sm leading-7 text-[#e7e2d9]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
