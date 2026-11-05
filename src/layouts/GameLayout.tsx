import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTION_COMPONENTS } from '../components/sections';
import { profile, sections, type SectionId } from '../content';

const START = 260;
const GAP = 560;
const WORLD = START + GAP * sections.length + 300;
const SPEED = 340; // px per second
const JUMP = 760;
const GRAVITY = 2100;
const REACH = 70;

const stations = sections.map((s, i) => ({ ...s, x: START + 200 + i * GAP }));
const COINS = sections.flatMap((_, i) => [0, 1, 2].map((k) => ({ id: `${i}-${k}`, x: START + 380 + i * GAP + k * 60, y: k === 1 ? 150 : 110 })));

type Keys = { left: boolean; right: boolean; jump: boolean };

export function GameLayout() {
  const worldRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const keys = useRef<Keys>({ left: false, right: false, jump: false });
  const hero = useRef({ x: START, y: 0, vy: 0, facing: 1, walking: false });
  const coinsLeft = useRef(new Set(COINS.map((c) => c.id)));

  const [near, setNear] = useState<SectionId | null>(null);
  const [open, setOpen] = useState<SectionId | null>(null);
  const [visited, setVisited] = useState<Set<SectionId>>(new Set());
  const [coins, setCoins] = useState(0);
  const [levelSelect, setLevelSelect] = useState(false);

  const openStation = useCallback((id: SectionId) => {
    setOpen(id);
    setLevelSelect(false);
    setVisited((v) => new Set(v).add(id));
  }, []);

  // Teleport to a station from the level-select list.
  const warp = (id: SectionId) => {
    hero.current.x = stations.find((s) => s.id === id)!.x - 10;
    openStation(id);
  };

  // Game loop: physics in refs, DOM transforms directly, React state only on change.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastNear: SectionId | null = null;
    const tick = (t: number) => {
      const dt = Math.min(0.033, Math.max(0, (t - last) / 1000));
      last = t;
      const h = hero.current;
      const k = keys.current;
      const dir = (k.right ? 1 : 0) - (k.left ? 1 : 0);
      if (!open) {
        h.x = Math.max(40, Math.min(WORLD - 60, h.x + dir * SPEED * dt));
        if (dir) h.facing = dir;
        if (k.jump && h.y === 0) h.vy = JUMP;
        h.vy -= GRAVITY * dt;
        h.y = Math.max(0, h.y + h.vy * dt);
        if (h.y === 0) h.vy = 0;
      }
      const walking = dir !== 0 && h.y === 0 && !open;
      if (walking !== h.walking) {
        h.walking = walking;
        heroRef.current?.classList.toggle('is-walking', walking);
      }
      heroRef.current?.classList.toggle('is-air', h.y > 0);

      const vw = viewRef.current?.clientWidth ?? innerWidth;
      const cam = Math.max(0, Math.min(WORLD - vw, h.x - vw * 0.4));
      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-cam}px,0,0)`;
        viewRef.current?.style.setProperty('--cam', String(cam));
      }
      if (heroRef.current) heroRef.current.style.transform = `translate3d(${h.x}px, ${-h.y}px, 0) scaleX(${h.facing})`;

      for (const c of COINS) {
        if (coinsLeft.current.has(c.id) && Math.abs(c.x - h.x) < 34 && Math.abs(c.y - (h.y + 40)) < 60) {
          coinsLeft.current.delete(c.id);
          document.querySelector(`[data-coin="${c.id}"]`)?.classList.add('is-taken');
          setCoins((n) => n + 1);
        }
      }

      const n = stations.find((s) => Math.abs(s.x - h.x) < REACH)?.id ?? null;
      if (n !== lastNear) {
        lastNear = n;
        setNear(n);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Keyboard controls.
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, .dm-panel')) return;
      const key = e.key.toLowerCase();
      if (open) {
        if (down && key === 'escape') setOpen(null);
        return;
      }
      // Arrow keys only for walking: D is the design menu shortcut.
      if (key === 'arrowleft') keys.current.left = down;
      else if (key === 'arrowright') keys.current.right = down;
      else if ([' ', 'w', 'arrowup'].includes(key)) keys.current.jump = down;
      else if (down && ['e', 'enter'].includes(key) && near) openStation(near);
      else return;
      e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    addEventListener('keydown', dn);
    addEventListener('keyup', up);
    return () => {
      removeEventListener('keydown', dn);
      removeEventListener('keyup', up);
    };
  }, [near, open, openStation]);

  const hold = (k: keyof Keys) => ({
    onPointerDown: () => (keys.current[k] = true),
    onPointerUp: () => (keys.current[k] = false),
    onPointerLeave: () => (keys.current[k] = false),
  });

  const Content = open ? SECTION_COMPONENTS[open] : null;

  return (
    <div className="game">
      <h1 className="sr-only">
        {profile.name}, {profile.role}. A playable portfolio level.
      </h1>
      <div className="hud">
        <p className="hud-title">{profile.shortName.toUpperCase()} QUEST</p>
        <p>
          FOUND {visited.size}/{sections.length}
        </p>
        <p>COINS {String(coins).padStart(2, '0')}</p>
        <button type="button" className="hud-btn" aria-expanded={levelSelect} onClick={() => setLevelSelect((l) => !l)}>
          LEVEL SELECT
        </button>
      </div>

      {levelSelect && (
        <nav className="level-select" aria-label="Level select">
          <ol>
            {stations.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => warp(s.id)}>
                  <span>{String(i + 1).padStart(2, '0')}</span> {s.label} {visited.has(s.id) ? '★' : ''}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="viewport" ref={viewRef}>
        <div className="bg bg-stars" />
        <div className="bg bg-far" />
        <div className="bg bg-near" />
        <div className="world" ref={worldRef} style={{ width: WORLD }}>
          <div className="ground" />
          {stations.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`station${visited.has(s.id) ? ' is-visited' : ''}${near === s.id ? ' is-near' : ''}`}
              style={{ left: s.x }}
              onClick={() => openStation(s.id)}
            >
              <span className="st-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="st-label">{s.label}</span>
              <span className="st-post" aria-hidden="true" />
            </button>
          ))}
          {COINS.map((c) => (
            <i key={c.id} className="coin" data-coin={c.id} style={{ left: c.x, bottom: `calc(var(--ground) + ${c.y}px)` }} aria-hidden="true" />
          ))}
          <div className="hero-sprite" ref={heroRef} aria-hidden="true">
            <svg viewBox="0 0 16 20" shapeRendering="crispEdges">
              <rect x="4" y="0" width="8" height="7" className="hs-head" />
              <rect x="6" y="2" width="6" height="3" className="hs-visor" />
              <rect x="3" y="7" width="10" height="7" className="hs-body" />
              <rect x="10" y="9" width="5" height="4" className="hs-laptop" />
              <rect x="4" y="14" width="3" height="6" className="hs-leg hs-leg-a" />
              <rect x="9" y="14" width="3" height="6" className="hs-leg hs-leg-b" />
            </svg>
          </div>
        </div>
        {near && !open && (
          <p className="prompt" role="status">
            Press <kbd>E</kbd> or tap to open {stations.find((s) => s.id === near)!.label}
          </p>
        )}
        {visited.size === 0 && !near && (
          <p className="prompt prompt-help">
            ← → to walk · Space to jump · E to open a checkpoint
          </p>
        )}
      </div>

      <div className="pad" aria-label="Touch controls">
        <button type="button" aria-label="Walk left" {...hold('left')}>
          ◀
        </button>
        <button type="button" aria-label="Walk right" {...hold('right')}>
          ▶
        </button>
        <button type="button" aria-label="Jump" {...hold('jump')}>
          ▲
        </button>
        <button type="button" className="pad-a" aria-label="Open checkpoint" disabled={!near} onClick={() => near && openStation(near)}>
          A
        </button>
      </div>

      {open && Content && (
        <div className="game-dialog" role="dialog" aria-modal="true" aria-label={sections.find((s) => s.id === open)!.label}>
          <div className="gd-box">
            <button className="gd-close" type="button" onClick={() => setOpen(null)} autoFocus>
              CLOSE ✕
            </button>
            <Content />
          </div>
        </div>
      )}
    </div>
  );
}
