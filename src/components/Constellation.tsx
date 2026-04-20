// Constellation section — CH5 project ecosystem display
// Replaces fake Stats and Testimonials with truthful project constellation

import { projects } from '../data/projects';

const categoryLabel: Record<string, string> = {
  product: 'product',
  tool: 'tool',
  experiment: 'experiment',
};

export default function Constellation() {
  const hero = projects.find((p) => p.role === 'hero');
  const supporting = projects.filter((p) => p.role !== 'hero');

  return (
    <section id="projects" className="relative bg-black px-8 py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(80,100,200,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            The Constellation
          </div>
          <h2 className="text-4xl md:text-5xl font-heading italic text-white tracking-tight max-w-xl">
            Things being built.
          </h2>
        </div>

        {hero && (
          <div className="mb-12">
            <div className="liquid-glass rounded-3xl p-8 md:p-12 max-w-2xl">
              <span className="text-white/40 font-body text-xs uppercase tracking-widest mb-3 block">
                {categoryLabel[hero.category]} · flagship
              </span>
              <h3 className="font-heading text-3xl md:text-4xl italic text-white mb-3">
                {hero.name}
              </h3>
              <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed">
                {hero.tagline}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supporting.map((project) => (
            <div key={project.id} className="liquid-glass rounded-2xl p-6">
              <span className="text-white/30 font-body text-xs uppercase tracking-widest mb-3 block">
                {categoryLabel[project.category]}
                {project.status === 'backlog' && ' · in progress'}
              </span>
              <h4 className="font-heading text-xl italic text-white mb-2">{project.name}</h4>
              <p className="text-white/50 font-body font-light text-xs leading-relaxed">
                {project.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
