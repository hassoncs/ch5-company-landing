import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stepDuration?: number;
};

export default function BlurText({ text, className, delay = 0, stepDuration = 0.35 }: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const spans = el.querySelectorAll<HTMLSpanElement>('.blur-word');
            spans.forEach((span, i) => {
              const el2 = span as HTMLElement;
              el2.style.setProperty('--word-delay', `${delay + i * 0.1}s`);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const words = text.split(' ');

  return (
    <div ref={ref} className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {words.map((word, i) => (
        <motion.span
        key={`blur-word-${word.replace(/[^a-zA-Z]/g, '')}-${i}`}
          className="blur-word inline-block"
          initial={{ filter: 'blur(12px)', opacity: 0, y: 24 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.1,
            duration: stepDuration,
            filter: { duration: stepDuration * 2 },
            opacity: { duration: stepDuration },
            y: { duration: stepDuration },
          }}
          style={{
            animationFillMode: 'both',
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </div>
  );
}
