import { useEffect, useRef, useState } from 'react';

interface PretextHeadlineProps {
  text: string;
  className?: string;
}

export default function PretextHeadline({ text, className = '' }: PretextHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function measure() {
      try {
        const { prepare, layout } = await import('@chenglou/pretext');
        const el = containerRef.current;
        if (!el || cancelled) return;

        const width = el.getBoundingClientRect().width;
        if (width === 0) return;

        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        const lineHeight = fontSize * 0.9;
        const font = `italic ${fontSize}px "Instrument Serif", serif`;

        const handle = prepare(text, font);
        const result = layout(handle, width, lineHeight);
        if (!cancelled) {
          setMeasuredHeight(result.height);
        }
      } catch (_pretextUnavailable) {
        setMeasuredHeight(null);
      }
    }

    measure();
    return () => { cancelled = true; };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={measuredHeight !== null ? { height: measuredHeight } : undefined}
    >
      {text}
    </div>
  );
}
