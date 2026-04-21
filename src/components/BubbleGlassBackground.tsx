'use client';

import { VFX } from '@vfx-js/core';
import { useEffect, useMemo, useRef, useState } from 'react';

type Vec2 = [number, number];

interface BubbleGlassBackgroundProps {
  className?: string;
  sphereRadius?: number;
  bubbleCount?: number;
  bubbleRadiusMin?: number;
  bubbleRadiusMax?: number;
  bubbleSpeed?: number;
  mouseSmoothing?: number;
  pixelRatio?: number;
}

interface PointerPoint {
  x: number;
  y: number;
}

interface BubbleConfig {
  sphereRadius: number;
  bubbleCount: number;
  bubbleRadiusMin: number;
  bubbleRadiusMax: number;
  bubbleSpeed: number;
  mouseSmoothing: number;
}

const fract = (value: number) => value - Math.floor(value);

function rotate2d(x: number, y: number, angle: number): Vec2 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [x * cosine - y * sine, x * sine + y * cosine];
}

function createBubbleGlassShader(config: BubbleConfig): string {
  return `
    precision highp float;
    uniform sampler2D src;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform vec2 mouse;
    uniform vec2 lag;
    uniform float time;
    uniform float clickTime;
    uniform int clickCount;
    out vec4 outColor;

    const float SPHERE_R = ${config.sphereRadius.toFixed(4)};

    const float DISP = 0.025;
    const int DISP_STEPS = 12;
    const float DISP_LO = 0.0;
    const float DISP_HI = 1.0;

    const float SCATTER = 0.03;

    const int N_BUBBLES = ${config.bubbleCount};
    const float BUBBLE_SMOOTH = 0.025;
    uniform float bubbleData[${config.bubbleCount * 4}];

    const vec3 ABSORB = vec3(2.0, 1.2, 1.0) * 3.0;

    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    vec2 hash22(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
    }

    mat2 rot(float t) {
      float c = cos(t);
      float s = sin(t);
      return mat2(c, -s, s, c);
    }

    float sdSphere(vec3 p, float r) {
      return length(p) - r;
    }

    float sdBox(vec3 p, vec3 b, float r) {
      vec3 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
    }

    float sdRing(vec3 p, vec2 r) {
      float s = length(p.xy) - r.x;
      return length(vec2(s, p.z)) - r.y;
    }

    float map(vec3 p, vec3 c) {
      vec3 q = p - c;

      float tt = clickTime * 5.0;
      float bounce = exp(-tt) * sin(tt) * 5.0 + (1.0 - exp(-tt));
      float scale = bounce * 0.5 + 0.5;
      q /= scale;

      q.xz *= rot(exp(-clickTime * 3.0) * 8.0);

      vec3 sp = q;
      sp.y += sin(sp.z * 29.0 + time * 6.5) * 0.01;
      sp.z += sin(sp.x * 23.0 + sp.y * 11.0 + time * 7.0) * 0.01;
      sp.xy *= rot(time * 1.3);
      sp.xz *= rot(time * 1.1);

      float d;
      int objectType = clickCount % 3;
      if (objectType == 0) {
        d = sdSphere(sp, SPHERE_R);
      } else if (objectType == 1) {
        d = sdBox(sp, vec3(SPHERE_R * 0.8), 0.01);
      } else {
        d = sdRing(sp, vec2(SPHERE_R * 1.1, 0.015));
      }

      for (int i = 0; i < N_BUBBLES; i++) {
        int b = i * 4;
        vec3 bubblePosition = vec3(bubbleData[b], bubbleData[b + 1], bubbleData[b + 2]);
        float radius = bubbleData[b + 3];
        d = smin(d, sdSphere(q - bubblePosition, max(radius, 0.001)), BUBBLE_SMOOTH);
      }

      return d * scale;
    }

    vec3 calcNormal(vec3 p, vec3 c) {
      vec2 e = vec2(0.001, 0.0);
      return normalize(vec3(
        map(p + e.xyy, c) - map(p - e.xyy, c),
        map(p + e.yxy, c) - map(p - e.yxy, c),
        map(p + e.yyx, c) - map(p - e.yyx, c)
      ));
    }

    vec3 spectrum(float x) {
      return clamp(vec3(
        1.5 - abs(4.0 * x - 1.0),
        1.5 - abs(4.0 * x - 2.0),
        1.5 - abs(4.0 * x - 3.0)
      ), 0.0, 1.0);
    }

    vec4 getSrc(vec2 uv) {
      vec4 color = texture(src, uv);
      return mix(vec4(1.0), color, color.a);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - offset) / resolution;
      float aspect = resolution.y / resolution.x;

      vec2 p = (uv - 0.5) * vec2(1.0, aspect);
      vec2 mousePoint = ((mouse + lag) / resolution - 0.5) * vec2(1.0, aspect);

      vec3 ro = vec3(0.0, 0.0, -2.0);
      float focal = 2.0;
      vec3 rd = normalize(vec3(p, focal));

      vec3 center = vec3(mousePoint, 0.0);
      vec3 firstNormal = vec3(0.0);
      vec3 lastNormal = vec3(0.0);
      int hitCount = 0;

      float thickness = 0.0;
      float tEntry = 0.0;
      float t = 0.0;
      bool inside = false;

      for (int i = 0; i < 50; i++) {
        if (t > 10.0) {
          break;
        }

        vec3 pos = ro + rd * t;
        float d = map(pos, center);
        float stepDistance = inside ? -d : d;

        if (stepDistance < 0.0003) {
          vec3 normal = calcNormal(pos, center);

          if (hitCount == 0) {
            firstNormal = normal;
          }

          lastNormal = normal;

          if (!inside) {
            tEntry = t;
          } else {
            thickness += t - tEntry;
          }

          hitCount++;
          if (hitCount >= 4) {
            break;
          }

          inside = !inside;
          t += 0.01;
        } else {
          t += stepDistance;
        }
      }

      if (hitCount > 0) {
        vec2 baseDisp = -(firstNormal.xy + lastNormal.xy) * 0.5 * DISP;

        float normalDotRay = max(dot(firstNormal, -rd), 0.0);
        float scatter = pow(1.0 - normalDotRay, 2.0) * SCATTER;

        vec3 acc = vec3(0.0);
        vec3 weightSum = vec3(0.0);
        for (int i = 0; i < DISP_STEPS; i++) {
          float wavelength = float(i) / float(DISP_STEPS - 1);
          float dispersion = mix(DISP_LO, DISP_HI, wavelength) * (1.3 + float(hitCount) * 0.2);
          vec2 jitter = hash22(uv * 1000.0 + float(i) * 7.13 + time) * scatter;
          vec3 weight = spectrum(wavelength);
          acc += getSrc(uv + baseDisp * dispersion + jitter).rgb * weight;
          weightSum += weight;
        }

        vec3 col = acc / weightSum * 0.99;
        col -= float(hitCount) * 0.05;
        col += 0.1;

        float fresnel = pow(1.0 - normalDotRay, 5.0);
        col *= 1.0 + fresnel;

        float absorbMix = 1.0 - pow(normalDotRay, 3.0);
        col *= mix(vec3(1.0), exp(-ABSORB * thickness), absorbMix);
        col *= 1.0 + absorbMix;

        vec3 lightDirection = normalize(vec3(0.5, 0.9, -0.3));
        float specular = pow(max(dot(reflect(-lightDirection, firstNormal), -rd), 0.0), 200.0);
        col += specular * 30.0;

        lightDirection = normalize(vec3(-0.9, 0.4, -0.3));
        specular = pow(max(dot(reflect(-lightDirection, firstNormal), -rd), 0.0), 300.0);
        col += specular * 3.0;

        lightDirection = normalize(vec3(-0.1, -0.9, -0.1));
        specular = pow(max(dot(reflect(-lightDirection, firstNormal), -rd), 0.0), 30.0);
        col += specular * 0.5;

        col = min(col, 1.0);
        col = 1.0 - abs(col + fresnel * 0.5 - 1.0);

        outColor = vec4(col, 1.0);
      } else {
        outColor = getSrc(uv);
      }
    }
  `;
}

export default function BubbleGlassBackground({
  className,
  sphereRadius = 0.12,
  bubbleCount = 8,
  bubbleRadiusMin = 0.03,
  bubbleRadiusMax = 0.07,
  bubbleSpeed = 0.7,
  mouseSmoothing = 0.05,
  pixelRatio = 1,
}: BubbleGlassBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ raw: PointerPoint; smooth: PointerPoint; lag: PointerPoint }>({
    raw: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 },
    lag: { x: 0, y: 0 },
  });
  const hasMouseRef = useRef(false);
  const centerBlendRef = useRef(1);
  const lastClickTimeRef = useRef(0);
  const clickCountRef = useRef(0);
  const startTimeRef = useRef(0);
  const lastFrameTokenRef = useRef(-1);
  const bubblesRef = useRef<Float32Array>(new Float32Array(bubbleCount * 4));
  const [viewport, setViewport] = useState<Vec2>([1, 1]);

  const config = useMemo<BubbleConfig>(() => ({
    sphereRadius,
    bubbleCount,
    bubbleRadiusMin,
    bubbleRadiusMax,
    bubbleSpeed,
    mouseSmoothing,
  }), [sphereRadius, bubbleCount, bubbleRadiusMin, bubbleRadiusMax, bubbleSpeed, mouseSmoothing]);

  const shader = useMemo(() => createBubbleGlassShader(config), [config]);

  useEffect(() => {
    bubblesRef.current = new Float32Array(config.bubbleCount * 4);
  }, [config.bubbleCount]);

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
    startTimeRef.current = performance.now() / 1000;
    lastClickTimeRef.current = startTimeRef.current;
    lastFrameTokenRef.current = -1;

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.raw = {
        x: event.clientX,
        y: window.innerHeight - event.clientY,
      };
      hasMouseRef.current = true;
    };

    const onPointerDown = () => {
      lastClickTimeRef.current = performance.now() / 1000;
      clickCountRef.current += 1;
    };

    const onPointerLeave = () => {
      hasMouseRef.current = false;
      centerBlendRef.current = 1;
      pointerRef.current = {
        raw: { x: viewport[0] / 2, y: viewport[1] / 2 },
        smooth: { x: viewport[0] / 2, y: viewport[1] / 2 },
        lag: { x: viewport[0] / 2, y: viewport[1] / 2 },
      };
    };

    onPointerLeave();

    if (reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('blur', onPointerLeave);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
      };
    }

    const updateSimulation = () => {
      const now = performance.now() / 1000;
      const frameToken = Math.floor(now * 120);

      if (lastFrameTokenRef.current === frameToken) {
        return;
      }

      lastFrameTokenRef.current = frameToken;
      const elapsed = now - startTimeRef.current;
      const raw = pointerRef.current.raw;
      const smooth = pointerRef.current.smooth;
      const lag = pointerRef.current.lag;

      smooth.x += (raw.x - smooth.x) * config.mouseSmoothing;
      smooth.y += (raw.y - smooth.y) * config.mouseSmoothing;
      lag.x += (smooth.x - lag.x) * config.mouseSmoothing;
      lag.y += (smooth.y - lag.y) * config.mouseSmoothing;

      if (hasMouseRef.current) {
        centerBlendRef.current *= 0.95;
      }

      const bubbles = bubblesRef.current;
      const width = Math.max(viewport[0], 1);
      const height = Math.max(viewport[1], 1);
      const radiusRange = config.bubbleRadiusMax - config.bubbleRadiusMin;

      for (let index = 0; index < config.bubbleCount; index += 1) {
        const life = fract(elapsed * config.bubbleSpeed + index / config.bubbleCount);
        const orbitRadius = config.sphereRadius * (0.3 + life * 0.8);
        const orbitAngle = elapsed * (0.8 + fract(index * 0.618) * 0.7) + index * 1.256;

        let bx = Math.cos(orbitAngle) * orbitRadius;
        let by = 0;
        let bz = Math.sin(orbitAngle) * orbitRadius;

        [bx, by] = rotate2d(bx, by, index * 2.3);
        [by, bz] = rotate2d(by, bz, index * 1.8);

        by += life * 0.1;
        bx += Math.sin(elapsed * 2.7 + index * 4.1) * 0.008 * life;
        bz += Math.cos(elapsed * 3.1 + index * 3.7) * 0.008 * life;

        bx += ((lag.x - smooth.x) / width) * (height / width);
        by += (lag.y - smooth.y) / height;

        const maxRadius = config.bubbleRadiusMin + radiusRange * fract(index * 0.618);
        const offset = index * 4;

        bubbles[offset] = bx;
        bubbles[offset + 1] = by;
        bubbles[offset + 2] = bz;
        bubbles[offset + 3] = maxRadius * Math.sin(life * Math.PI);
      }
    };

    const vfx = VFX.init({
      autoplay: false,
      pixelRatio,
      scrollPadding: false,
      wrapper,
      zIndex: 0,
      postEffect: {
        shader,
        uniforms: {
          lag: () => {
            updateSimulation();

            return [
              viewport[0] * 0.5 * centerBlendRef.current + (pointerRef.current.smooth.x - pointerRef.current.raw.x),
              viewport[1] * 0.5 * centerBlendRef.current + (pointerRef.current.smooth.y - pointerRef.current.raw.y),
            ];
          },
          clickTime: () => performance.now() / 1000 - lastClickTimeRef.current,
          clickCount: () => clickCountRef.current,
          bubbleData: () => {
            updateSimulation();
            return bubblesRef.current;
          },
        },
      },
    });

    if (!vfx) {
      return undefined;
    }

    let disposed = false;

    const addEffect = async () => {
      try {
        if (disposed) {
          return;
        }

        await vfx.addHTML(target, { shader: 'none', overflow: true, zIndex: 0 });

        if (!disposed) {
          vfx.play();
        }
      } catch (error) {
        if (!disposed) {
          console.error('Failed to mount bubble glass background effect.', error);
        }
      }
    };

    void addEffect();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    return () => {
      disposed = true;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      vfx.remove(target);
      vfx.destroy();
    };
  }, [config, pixelRatio, shader, viewport]);

  return (
    <div ref={wrapperRef} className={`pointer-events-none fixed inset-0 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div
        ref={targetRef}
        className="absolute inset-0 opacity-95"
        style={{
          background: [
            'radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.3), transparent 16%)',
            'radial-gradient(circle at 78% 16%, rgba(146, 196, 255, 0.22), transparent 18%)',
            'radial-gradient(circle at 48% 44%, rgba(255, 255, 255, 0.12), transparent 14%)',
            'linear-gradient(180deg, rgba(10, 14, 30, 0.66) 0%, rgba(6, 8, 20, 0.88) 100%)',
          ].join(','),
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_28%)]" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
