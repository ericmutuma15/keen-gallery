import { Instagram, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1114] text-[#f5efe6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.12em]">EDGAR KEEN</p>
          <p className="mt-4 max-w-xs text-sm text-[#e7e2d9]/70">Visual storytelling rooted in Machakos, Kenya and shaped by the energy of a new generation.</p>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.18em] text-[#d0b38d]">Navigate</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#f5efe6]/80">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.18em] text-[#d0b38d]">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-[#f5efe6]/80">
            <div className="flex items-center gap-2"><Mail size={16} /> edgarkeenstudio@gmail.com</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> Machakos, Kenya</div>
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.18em] text-[#d0b38d]">Follow</h3>
          <div className="mt-4 flex items-center gap-4 text-[#f5efe6]/80">
            <Instagram size={18} />
            <span>@edgarkeen</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs uppercase tracking-[0.16em] text-[#e7e2d9]/60">
        © 2026 Edgar Keen Studio. All rights reserved.
      </div>
    </footer>
  );
}
