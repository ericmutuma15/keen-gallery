export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-5xl text-sable">Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          'Total Artworks', 'Featured Artworks', 'Categories', 'Subcategories', 'Messages',
        ].map((label, index) => (
          <div key={label} className="rounded-[1.5rem] border border-sable/10 bg-white/70 p-5 shadow-soft">
            <p className="text-[10px] uppercase tracking-[0.18em] text-sable/60">{label}</p>
            <p className="mt-5 text-3xl font-serif text-sable">{index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
