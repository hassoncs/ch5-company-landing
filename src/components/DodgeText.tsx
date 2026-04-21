'use client';

import { useEffect, useRef, useState } from 'react';

interface DodgeTextProps {
  text: string;
  className?: string;
}

const RADIUS = 300;
const PUSH = 40;

export default function DodgeText({ text, className = '' }: DodgeTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const chars = text.split('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    let rafId: number;
    const pos = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const spans = el.querySelectorAll<HTMLSpanElement>('.dodge-char');
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pos.x - cx;
        const dy = pos.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS && dist > 1) {
          const force = (1 - dist / RADIUS) * PUSH;
          span.style.transform = `translate(${-(dx / dist) * force}px, ${-(dy / dist) * force}px)`;
        } else {
          span.style.transform = '';
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        fontSize: 'clamp(80px, 22vw, 240px)',
        fontWeight: 700,
        fontFamily: '"Space Grotesk", sans-serif',
        lineHeight: 0.9,
        mixBlendMode: 'difference',
        color: '#ffffff',
        letterSpacing: '-0.04em',
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={`ch5-${i}`}
          className="dodge-char inline-block"
          style={{
            transition: ready ? 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h1>
  );
}
