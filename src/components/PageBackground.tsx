'use client';

import BubbleGlassBackground from './BubbleGlassBackground';
import FluidBackground from './FluidBackground';

export type BackgroundVariant = 'fluid' | 'bubble-glass';

interface PageBackgroundProps {
  className?: string;
  variant?: BackgroundVariant;
}

export default function PageBackground({ className, variant = 'fluid' }: PageBackgroundProps) {
  if (variant === 'bubble-glass') {
    return <BubbleGlassBackground className={className} />;
  }

  return <FluidBackground className={className} />;
}
