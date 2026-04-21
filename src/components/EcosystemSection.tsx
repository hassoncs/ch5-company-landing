import { projects } from '../data/projects';

const groupLabels: Record<string, string> = {
  product: 'Products',
  tool: 'Tools',
  experiment: 'Experiments',
};

const categoryOrder = ['product', 'tool', 'experiment'] as const;

export default function EcosystemSection() {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: groupLabels[cat],
    items: projects.filter((p) => p.category === cat && p.role !== 'hero'),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="ecosystem" className="relative px-8 py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 60%, rgba(120,80,200,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(40,120,180,0.15) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 bg-black/28 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute top-0 w-full h-[200px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            Everything running
          </div>
          <h2 className="text-4xl md:text-5xl font-heading italic text-white tracking-tight max-w-xl">
            What's in the lab.
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {grouped.map(({ category, label, items }) => (
            <div key={category}>
              <p className="text-white/30 font-body text-xs uppercase tracking-widest mb-6">
                {label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((project) => (
                  <div key={project.id} className="liquid-glass rounded-2xl p-6 flex flex-col gap-3">
                    <h3 className="font-heading text-xl italic text-white">
                      {project.name}
                    </h3>
                    <p className="text-white/50 font-body font-light text-sm leading-relaxed flex-1">
                      {project.tagline}
                    </p>
                    {project.status === 'backlog' && (
                      <span className="text-white/20 font-body text-xs">in progress</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
