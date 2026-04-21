'use client';

import { VFX, type VFXPass } from '@vfx-js/core';
import { useEffect, useMemo, useRef, useState } from 'react';

type Vec2 = [number, number];

interface FluidBackgroundProps {
  className?: string;
  baseResolution?: number;
  pressureIterations?: number;
  curlStrength?: number;
  velocityDissipation?: number;
  splatForce?: number;
  splatRadius?: number;
  pointerDecay?: number;
  pixelRatio?: number;
}

interface FluidConfig {
  baseResolution: number;
  pressureIterations: number;
  curlStrength: number;
  velocityDissipation: number;
  splatForce: number;
  splatRadius: number;
}

interface PointerState {
  position: Vec2;
  delta: Vec2;
}

interface RefValue<T> {
  current: T;
}

const COPY_SHADER = `
  precision highp float;
  uniform sampler2D src;
  uniform vec2 resolution;
  uniform vec2 offset;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    outColor = texture(src, uv);
  }
`;

const CURL_SHADER = `
  precision highp float;
  uniform sampler2D velocity;
  uniform vec2 resolution;
  uniform vec2 offset;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 t = 1.0 / resolution;
    float left = texture(velocity, uv - vec2(t.x, 0.0)).y;
    float right = texture(velocity, uv + vec2(t.x, 0.0)).y;
    float top = texture(velocity, uv + vec2(0.0, t.y)).x;
    float bottom = texture(velocity, uv - vec2(0.0, t.y)).x;
    outColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_SHADER = `
  precision highp float;
  uniform sampler2D velocity;
  uniform sampler2D curl;
  uniform vec2 resolution;
  uniform vec2 offset;
  uniform vec2 mouse;
  uniform vec2 mouseDelta;
  uniform float curlStrength;
  uniform float splatForce;
  uniform float splatRadius;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 t = 1.0 / resolution;
    float aspect = resolution.x / resolution.y;

    float left = abs(texture(curl, uv - vec2(t.x, 0.0)).x);
    float right = abs(texture(curl, uv + vec2(t.x, 0.0)).x);
    float top = abs(texture(curl, uv + vec2(0.0, t.y)).x);
    float bottom = abs(texture(curl, uv - vec2(0.0, t.y)).x);
    float center = texture(curl, uv).x;

    vec2 force = vec2(top - bottom, right - left);
    float forceLength = length(force);
    force = forceLength > 0.0001 ? force / forceLength : vec2(0.0);
    force *= curlStrength * center;
    force.y *= -1.0;

    vec2 velocitySample = texture(velocity, uv).xy;
    velocitySample += force * 0.016;
    velocitySample = clamp(velocitySample, vec2(-1000.0), vec2(1000.0));

    vec2 mouseUv = mouse / resolution;
    vec2 diff = uv - mouseUv;
    diff.x *= aspect;
    float splat = exp(-dot(diff, diff) / splatRadius);
    velocitySample += (mouseDelta / resolution) * splat * splatForce;

    outColor = vec4(velocitySample, 0.0, 1.0);
  }
`;

const DIVERGENCE_SHADER = `
  precision highp float;
  uniform sampler2D vort_vel;
  uniform vec2 resolution;
  uniform vec2 offset;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 t = 1.0 / resolution;
    float left = texture(vort_vel, uv - vec2(t.x, 0.0)).x;
    float right = texture(vort_vel, uv + vec2(t.x, 0.0)).x;
    float top = texture(vort_vel, uv + vec2(0.0, t.y)).y;
    float bottom = texture(vort_vel, uv - vec2(0.0, t.y)).y;
    vec2 center = texture(vort_vel, uv).xy;

    if (uv.x - t.x < 0.0) left = -center.x;
    if (uv.x + t.x > 1.0) right = -center.x;
    if (uv.y + t.y > 1.0) top = -center.y;
    if (uv.y - t.y < 0.0) bottom = -center.y;

    outColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
  }
`;

const PRESSURE_INIT_SHADER = `
  precision highp float;
  out vec4 outColor;

  void main() {
    outColor = vec4(0.0);
  }
`;

const PRESSURE_SHADER = `
  precision highp float;
  uniform sampler2D src;
  uniform sampler2D divergence;
  uniform vec2 resolution;
  uniform vec2 offset;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 t = 1.0 / resolution;
    float left = texture(src, uv - vec2(t.x, 0.0)).x;
    float right = texture(src, uv + vec2(t.x, 0.0)).x;
    float top = texture(src, uv + vec2(0.0, t.y)).x;
    float bottom = texture(src, uv - vec2(0.0, t.y)).x;
    float divergenceSample = texture(divergence, uv).x;

    outColor = vec4((left + right + bottom + top - divergenceSample) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const ADVECT_VELOCITY_SHADER = `
  precision highp float;
  uniform sampler2D proj_vel;
  uniform vec2 resolution;
  uniform vec2 offset;
  uniform float velocityDissipation;
  out vec4 outColor;

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 t = 1.0 / resolution;
    vec2 velocitySample = texture(proj_vel, uv).xy;
    vec2 coord = uv - velocitySample * t * 0.016;
    vec2 advected = texture(proj_vel, coord).xy;
    advected /= 1.0 + velocityDissipation * 0.016;

    outColor = vec4(advected, 0.0, 1.0);
  }
`;

const DISPLAY_SHADER = `
  precision highp float;
  uniform sampler2D velocity;
  uniform sampler2D canvas;
  uniform vec2 resolution;
  uniform vec2 offset;
  uniform vec2 simSize;
  out vec4 outColor;

  vec3 spectrum(float x) {
    return cos((x - vec3(0.0, 0.5, 1.0)) * vec3(0.6, 1.0, 0.5) * 3.14);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    vec2 velocitySample = texture(velocity, uv).xy;

    vec2 displacement = velocitySample / simSize;
    float intensity = length(displacement);

    const int DISPERSION_SAMPLES = 8;
    vec4 color = vec4(0.0);
    vec3 weightSum = vec3(0.0);

    for (int i = 0; i < DISPERSION_SAMPLES; i++) {
      float t = float(i) / float(DISPERSION_SAMPLES - 1);
      vec3 weight = max(vec3(0.0), cos((t - vec3(0.0, 0.5, 1.0)) * 3.14159 * 0.5));
      vec4 sampleColor = texture(canvas, uv - displacement * 0.3 * (t + 0.3) * intensity);

      color.rgb += sampleColor.rgb * weight;
      color.a += sampleColor.a * (weight.r + weight.g + weight.b) / 3.0;
      weightSum += weight;
    }

    color.rgb /= weightSum;
    color.a /= (weightSum.r + weightSum.g + weightSum.b) / 3.0;

    vec4 chroma = vec4(spectrum(sin(intensity * 2.0) * 0.4 + 0.6), 1.0);
    color += chroma * (smoothstep(0.2, 0.8, intensity) * 0.5);

    float edge = smoothstep(0.003, 0.0, abs(intensity - 0.25));
    outColor = abs(color - edge * 0.5);
  }
`;

function getSimulationSize(baseResolution: number, width: number, height: number): Vec2 {
  const safeHeight = Math.max(height, 1);
  const aspectRatio = width / safeHeight;

  if (aspectRatio > 1) {
    return [Math.round(baseResolution * aspectRatio), baseResolution];
  }

  return [baseResolution, Math.round(baseResolution / aspectRatio)];
}

function createPressurePasses(simulationSize: Vec2, iterations: number): { passes: VFXPass[]; lastTarget: string } {
  const passes: VFXPass[] = [
    {
      frag: PRESSURE_INIT_SHADER,
      target: 'pressure_a',
      float: true,
      size: simulationSize,
    },
  ];

  let lastTarget = 'pressure_a';

  for (let index = 0; index < iterations; index += 1) {
    lastTarget = index % 2 === 0 ? 'pressure_b' : 'pressure_a';
    passes.push({
      frag: PRESSURE_SHADER,
      target: lastTarget,
      float: true,
      size: simulationSize,
    });
  }

  return { passes, lastTarget };
}

function createGradientShader(pressureTarget: string): string {
  return `
    precision highp float;
    uniform sampler2D vort_vel;
    uniform sampler2D ${pressureTarget};
    uniform vec2 resolution;
    uniform vec2 offset;
    out vec4 outColor;

    void main() {
      vec2 uv = (gl_FragCoord.xy - offset) / resolution;
      vec2 t = 1.0 / resolution;
      float left = texture(${pressureTarget}, uv - vec2(t.x, 0.0)).x;
      float right = texture(${pressureTarget}, uv + vec2(t.x, 0.0)).x;
      float top = texture(${pressureTarget}, uv + vec2(0.0, t.y)).x;
      float bottom = texture(${pressureTarget}, uv - vec2(0.0, t.y)).x;
      vec2 velocitySample = texture(vort_vel, uv).xy;
      velocitySample -= vec2(right - left, top - bottom);
      outColor = vec4(velocitySample, 0.0, 1.0);
    }
  `;
}

function buildFluidPasses(config: FluidConfig, viewport: Vec2, pointerRef: RefValue<PointerState>, pointerDecay: number): VFXPass[] {
  const simulationSize = getSimulationSize(config.baseResolution, viewport[0], viewport[1]);
  const { passes: pressurePasses, lastTarget } = createPressurePasses(simulationSize, config.pressureIterations);

  const getPointerPosition = (): Vec2 => pointerRef.current.position;
  const getPointerDelta = (): Vec2 => {
    const delta = pointerRef.current.delta;
    pointerRef.current = {
      position: pointerRef.current.position,
      delta: [delta[0] * pointerDecay, delta[1] * pointerDecay],
    };

    return delta;
  };

  return [
    { frag: COPY_SHADER, target: 'canvas' },
    { frag: CURL_SHADER, target: 'curl', float: true, size: simulationSize },
    {
      frag: VORTICITY_SHADER,
      target: 'vort_vel',
      float: true,
      size: simulationSize,
      uniforms: {
        mouse: getPointerPosition,
        mouseDelta: getPointerDelta,
        curlStrength: config.curlStrength,
        splatForce: config.splatForce,
        splatRadius: config.splatRadius,
      },
    },
    {
      frag: DIVERGENCE_SHADER,
      target: 'divergence',
      float: true,
      size: simulationSize,
    },
    ...pressurePasses,
    {
      frag: createGradientShader(lastTarget),
      target: 'proj_vel',
      float: true,
      size: simulationSize,
    },
    {
      frag: ADVECT_VELOCITY_SHADER,
      target: 'velocity',
      persistent: true,
      float: true,
      size: simulationSize,
      uniforms: {
        velocityDissipation: config.velocityDissipation,
      },
    },
    {
      frag: DISPLAY_SHADER,
      uniforms: {
        simSize: simulationSize,
      },
    },
  ];
}

export default function FluidBackground({
  className,
  baseResolution = 256,
  pressureIterations = 12,
  curlStrength = 20,
  velocityDissipation = 1,
  splatForce = 3000,
  splatRadius = 0.002,
  pointerDecay = 0.9,
  pixelRatio = 1,
}: FluidBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState>({
    position: [-1, -1],
    delta: [0, 0],
  });
  const [viewport, setViewport] = useState<Vec2>([1, 1]);

  const config = useMemo<FluidConfig>(() => ({
    baseResolution,
    pressureIterations,
    curlStrength,
    velocityDissipation,
    splatForce,
    splatRadius,
  }), [baseResolution, pressureIterations, curlStrength, velocityDissipation, splatForce, splatRadius]);

  useEffect(() => {
    const syncViewport = () => {
      setViewport([window.innerWidth, window.innerHeight]);
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;

    if (!wrapper || !target) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = target.getBoundingClientRect();
      const nextPosition: Vec2 = [event.clientX - bounds.left, bounds.height - (event.clientY - bounds.top)];
      const currentPosition = pointerRef.current.position;

      pointerRef.current = {
        position: nextPosition,
        delta: currentPosition[0] >= 0
          ? [nextPosition[0] - currentPosition[0], nextPosition[1] - currentPosition[1]]
          : [0, 0],
      };
    };

    const onPointerLeave = () => {
      pointerRef.current = {
        position: [-1, -1],
        delta: [0, 0],
      };
    };

    if (reducedMotion) {
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
      };
    }

    const passes = buildFluidPasses(config, viewport, pointerRef, pointerDecay);
    const vfx = VFX.init({
      autoplay: false,
      pixelRatio,
      scrollPadding: false,
      wrapper,
      zIndex: 0,
      postEffect: passes,
    });

    if (!vfx) {
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
      };
    }

    const addEffect = async () => {
      try {
        if (disposed) {
          return;
        }

        await vfx.add(target, {
          shader: 'none',
          overflow: true,
          zIndex: 0,
        });

        if (!disposed) {
          vfx.play();
        }
      } catch (error) {
        if (!disposed) {
          console.error('Failed to mount fluid background effect.', error);
        }
      }
    };

    let disposed = false;

    void addEffect();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    return () => {
      disposed = true;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      vfx.remove(target);
      vfx.destroy();
    };
  }, [config, pixelRatio, pointerDecay, viewport]);

  return (
    <div ref={wrapperRef} className={`pointer-events-none fixed inset-0 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div
        ref={targetRef}
        className="absolute inset-0 opacity-95"
        style={{
          background: [
            'radial-gradient(circle at 18% 18%, rgba(110, 87, 255, 0.4), transparent 24%)',
            'radial-gradient(circle at 82% 12%, rgba(38, 208, 255, 0.26), transparent 22%)',
            'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.08), transparent 18%)',
            'radial-gradient(circle at 20% 78%, rgba(108, 41, 255, 0.28), transparent 26%)',
            'radial-gradient(circle at 80% 82%, rgba(23, 85, 255, 0.2), transparent 28%)',
            'linear-gradient(180deg, rgba(6, 10, 24, 0.7) 0%, rgba(7, 8, 18, 0.88) 100%)',
          ].join(','),
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(circle at center, black 28%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 28%, transparent 82%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%)]" />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
