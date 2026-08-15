import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1114]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-serif text-2xl tracking-[0.12em] text-[#f5efe6]">EDGAR KEEN</Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm uppercase tracking-[0.18em] text-[#e7e2d9]/80 transition hover:text-[#f5efe6]">
              {item.label}
            </Link>
          ))}
          <Link to="/admin" className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f5efe6] transition hover:bg-[#f2b77a] hover:text-[#11181b]">
            Admin
          </Link>
        </div>
        <button type="button" className="text-[#f5efe6] md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle mobile menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-[#0b1114] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.18em] text-[#e7e2d9]/80">
                {item.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f5efe6]">
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
