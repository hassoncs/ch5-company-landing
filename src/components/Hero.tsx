import DodgeText from './DodgeText';
import { heroContent } from '../data/projects';

export default function Hero() {
  return (
    <section className="relative overflow-visible min-h-screen md:min-h-[900px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 w-full h-auto object-contain z-0"
        style={{ top: '20%' }}
        poster="/images/hero_bg.jpeg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/5 z-0" />

      <div
        className="absolute bottom-0 w-full"
        style={{ height: '300px', background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8 pt-32 md:pt-40">
        <DodgeText
          text={heroContent.headline}
          className="mb-6 tracking-tight"
        />

        <p className="text-sm md:text-base text-white/70 font-body font-light leading-tight max-w-xl">
          {heroContent.subhead}
        </p>
      </div>
    </section>
  );
}
