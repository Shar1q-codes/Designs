import { lazy, Suspense, useEffect, useRef } from 'react';
import type { Scene, StyleId } from '../designs';

// Three.js only loads when the glass style is shown.
const SpaceScene = lazy(() => import('../layouts/SpaceScene'));

// Falling code columns for the Y2K style; a slow canvas, paused with the motion toggle.
function MatrixRain({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext('2d')!;
    const glyphs = '01アカサタナハマヤラワ<>/{}[]=+*';
    const size = 16;
    let cols: number[] = [];
    const resize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
      cols = Array.from({ length: Math.ceil(innerWidth / size) }, () => Math.random() * -50);
      g.fillStyle = '#0a0a1f';
      g.fillRect(0, 0, c.width, c.height);
    };
    resize();
    addEventListener('resize', resize);
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return;
      last = t;
      g.fillStyle = 'rgba(10, 10, 31, 0.12)';
      g.fillRect(0, 0, c.width, c.height);
      g.font = `${size}px VT323, monospace`;
      cols.forEach((y, i) => {
        g.fillStyle = Math.random() > 0.96 ? '#e8f7ff' : '#36f5c8';
        g.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y * size);
        cols[i] = y * size > c.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    if (!still) raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
    };
  }, [still]);
  return <canvas ref={ref} />;
}

// A blob that trails the pointer, inverting whatever it covers.
function CursorBlob({ still }: { still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (still || matchMedia('(pointer: coarse)').matches) return;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [still]);
  return <div className="cursor-blob" ref={ref} />;
}

export function SceneLayer({ scene, still }: { scene?: Scene; still: boolean }) {
  if (!scene) return null;
  return (
    <div className={`scene scene-${scene}`} aria-hidden="true">
      {scene === 'space' && (
        <Suspense fallback={null}>
          <SpaceScene still={still} />
        </Suspense>
      )}
      {scene === 'matrix' && <MatrixRain still={still} />}
      {scene === 'grid' && (
        <>
          <div className="sun" />
          <div className="grid-floor" />
        </>
      )}
      {scene === 'blobs' && (
        <>
          <i className="blob b1" />
          <i className="blob b2" />
          <i className="blob b3" />
        </>
      )}
      {scene === 'cursor' && <CursorBlob still={still} />}
    </div>
  );
}

// Pointer-driven details some styles use: Fluent's reveal light and Material's ripple.
export function usePointerEffects(style: StyleId) {
  useEffect(() => {
    if (style !== 'fluent' && style !== 'material') return;

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>('.card, .btn, .sec, .step, .tool-group');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--rx', `${e.clientX - r.left}px`);
      el.style.setProperty('--ry', `${e.clientY - r.top}px`);
    };

    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>('.btn, .card, .nav a, summary');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height);
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    };

    if (style === 'fluent') addEventListener('pointermove', onMove);
    if (style === 'material') addEventListener('pointerdown', onDown);
    return () => {
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
    };
  }, [style]);
}
