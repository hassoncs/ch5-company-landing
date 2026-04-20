export default function CtaFooter() {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(100,120,180,0.2) 0%, transparent 70%)',
        }}
      />
      <div className="absolute top-0 h-[200px] w-full bg-gradient-to-b from-black to-transparent" />
      <div className="absolute bottom-0 h-[200px] w-full bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-8 text-center">
        <p className="font-heading text-5xl italic leading-[0.85] text-white md:text-6xl lg:text-7xl">
          CH5 LLC
        </p>

        <p className="mx-auto mt-6 max-w-xl font-body text-sm font-light text-white/60 md:text-base">
          Maker of Firefly, FitBot, cmux, and other things that run.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl border-t border-white/10 px-8 py-8">
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-white/40">© 2026 CH5 LLC. All rights reserved.</span>
          <a
            href="mailto:hello@ch5.me"
            className="font-body text-xs text-white/40 transition-colors hover:text-white/70"
          >
            hello@ch5.me
          </a>
        </div>
      </div>
    </section>
  );
}