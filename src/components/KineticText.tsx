import { useEffect, useRef, useState } from 'react';

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function KineticText({ text, className = '', delay = 0 }: KineticTextProps) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(' ').map((w, i) => ({ word: w, id: `${w}-${i}` }));

  return (
    <p ref={ref} className={className}>
      {words.map(({ word, id }, wi) => (
        <span
          key={id}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <span
            className="inline-block"
            style={{
              animation: 'kineticRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: `${delay + wi * 0.07}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}

    </p>
  );
}
