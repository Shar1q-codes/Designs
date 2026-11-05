import { useCallback, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { AXES, DEFAULT_DESIGN, getStyle, isOn, type Axis, type Design, type StyleId } from '../designs';

const STORAGE_KEY = 'portfolio-design-v2';
const loadedFonts = new Set<string>();

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function readInitial(): Design {
  const params = new URLSearchParams(location.search);
  let saved: Partial<Design> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    /* storage blocked or corrupt */
  }
  const pick = <A extends Axis>(axis: A): Design[A] => {
    const v = params.get(axis) ?? saved[axis];
    return isOn(axis, v) ? v : DEFAULT_DESIGN[axis];
  };
  return { style: pick('style'), layout: pick('layout'), nav: pick('nav') };
}

// Load a style's fonts on demand; resolve early so a slow network never stalls the switch.
function loadFonts(id: StyleId, timeout = 700): Promise<void> {
  const fonts = getStyle(id).fonts;
  if (!fonts || loadedFonts.has(id)) return Promise.resolve();
  loadedFonts.add(id);
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
    link.onload = () => void document.fonts.ready.then(() => resolve());
    link.onerror = () => resolve();
    document.head.appendChild(link);
    setTimeout(resolve, timeout);
  });
}

// The section nearest the top of the screen, so a switch lands you in the same place.
function currentSection(): string | null {
  let found: string | null = null;
  for (const el of document.querySelectorAll<HTMLElement>('[data-section]')) {
    const r = el.getBoundingClientRect();
    if (r.top <= innerHeight * 0.35 && r.left < innerWidth * 0.5 && r.right > 0) found = el.dataset.section ?? null;
  }
  return found;
}

function restoreSection(id: string | null) {
  if (!id || id === 'home') {
    scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.h-track')?.scrollTo({ left: 0, behavior: 'instant' });
    document.querySelector('.shell')?.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ block: 'start', inline: 'start', behavior: 'instant' });
}

export function useDesign() {
  const [design, setDesign] = useState<Design>(readInitial);
  const style = getStyle(design.style);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.style = design.style;
    root.dataset.layout = style.experience ? 'experience' : design.layout;
    root.dataset.nav = style.experience ? 'experience' : design.nav;
    root.dataset.experience = style.experience ?? '';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', style.themeColor);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    } catch {
      /* ignore */
    }
    const url = new URL(location.href);
    (Object.keys(AXES) as Axis[]).forEach((axis) => {
      if (design[axis] === DEFAULT_DESIGN[axis]) url.searchParams.delete(axis);
      else url.searchParams.set(axis, design[axis]);
    });
    history.replaceState(null, '', url);
    void loadFonts(design.style);
  }, [design, style]);

  const change = useCallback(
    async (patch: Partial<Design>, origin?: { x: number; y: number }) => {
      const next = { ...design, ...patch };
      if (next.style === design.style && next.layout === design.layout && next.nav === design.nav) return;
      const anchor = currentSection();
      await loadFonts(next.style);

      const apply = () => {
        flushSync(() => setDesign(next));
        restoreSection(anchor);
      };

      const doc = document as ViewTransitionDoc;
      if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        apply();
        return;
      }
      const x = origin?.x ?? innerWidth / 2;
      const y = origin?.y ?? innerHeight / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      doc
        .startViewTransition(apply)
        .ready.then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 900, easing: 'cubic-bezier(.7, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' },
          );
        })
        .catch(() => {});
    },
    [design],
  );

  return { design, style, change };
}
