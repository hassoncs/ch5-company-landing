'use client';

import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  baseHue: number;
  driftAngle: number;
  driftSpeed: number;
  wobblePhase: number;
  wobbleAmp: number;
  hueShiftPhase: number;
  hueShiftSpeed: number;
}

function createOrbs(count: number, w: number, h: number): Orb[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 300 + 250,
    baseHue: Math.random() * 360,
    hue: 0,
    driftAngle: Math.random() * Math.PI * 2,
    driftSpeed: Math.random() * 0.0008 + 0.0004,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmp: Math.random() * 0.2 + 0.05,
    hueShiftPhase: Math.random() * Math.PI * 2,
    hueShiftSpeed: Math.random() * 0.003 + 0.001,
  }));
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    if (prefersReduced) {
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener('resize', resize);
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const orbs = createOrbs(5, canvas.width, canvas.height);
    let rafId: number;

    const draw = () => {
      const { width, height } = canvas;
      const t = (timeRef.current += 1);

      ctx.fillStyle = 'rgba(5, 5, 16, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      const ptr = pointerRef.current;

      if (ptr) {
        const glowGrad = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 300);
        glowGrad.addColorStop(0, 'rgba(200, 180, 255, 0.03)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, 300, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const orb of orbs) {
        orb.driftAngle += orb.driftSpeed;
        const driftX = Math.cos(orb.driftAngle) * 0.015;
        const driftY = Math.sin(orb.driftAngle) * 0.015;

        orb.wobblePhase += 0.0006;
        const wobbleX = Math.cos(orb.wobblePhase) * 0.04;
        const wobbleY = Math.sin(orb.wobblePhase * 1.3) * 0.04;

        orb.hueShiftPhase += orb.hueShiftSpeed;
        orb.hue = (orb.baseHue + Math.sin(orb.hueShiftPhase) * 30 + 360) % 360;

        if (ptr) {
          const dx = ptr.x - orb.x;
          const dy = ptr.y - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 500 && dist > 1) {
            const force = (1 - dist / 500) * 0.02;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
          }
        }

        const damping = 0.98;
        orb.vx = (orb.vx + driftX + wobbleX) * damping;
        orb.vy = (orb.vy + driftY + wobbleY) * damping;
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Wrap around edges with padding
        const pad = orb.r;
        if (orb.x < -pad) orb.x = width + pad;
        if (orb.x > width + pad) orb.x = -pad;
        if (orb.y < -pad) orb.y = height + pad;
        if (orb.y > height + pad) orb.y = -pad;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue}, 80%, 55%, 0.35)`);
        grad.addColorStop(0.4, `hsla(${(orb.hue + 30) % 360}, 65%, 45%, 0.12)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
