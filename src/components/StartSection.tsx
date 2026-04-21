import BlurText from './BlurText';

export default function StartSection() {
  return (
    <section id="about" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(94, 92, 230, 0.16) 0%, transparent 60%)' }} />
      <div className="absolute top-0 w-full h-[200px] bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-black/80 to-transparent" />

      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
        <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-8">
          What Is CH5
        </div>

        <BlurText
          text="One person building, publicly."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6"
          delay={0}
        />

        <p className="text-white/60 font-body font-light text-sm md:text-base max-w-xl mx-auto mb-8">
          CH5 is a personal maker company. Products, tools, and experiments. Each thing builds the next.
        </p>
      </div>
    </section>
  );
}
