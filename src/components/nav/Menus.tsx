import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { areas, profile, sections, type SectionId } from '../../content';
import { STYLES, type Design } from '../../designs';

const links = sections.filter((s) => s.id !== 'home');

function Brand() {
  return (
    <a className="brand" href="#home" aria-label={`${profile.name}, back to top`}>
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">{profile.name}</span>
    </a>
  );
}

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, close]);
}

// Hamburger: three lines that open a full-screen overlay of big links.
export function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    btn.current?.focus();
  };
  useEscape(open, close);
  useEffect(() => {
    document.documentElement.classList.toggle('nav-locked', open);
    return () => document.documentElement.classList.remove('nav-locked');
  }, [open]);

  return (
    <header className="site-head nav-hamburger">
      <Brand />
      <button ref={btn} className="burger" type="button" aria-expanded={open} aria-controls="burger-panel" onClick={() => setOpen((o) => !o)}>
        <span className="burger-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>
      <div className={`burger-panel${open ? ' is-open' : ''}`} id="burger-panel" aria-hidden={!open}>
        <nav aria-label="Sections">
          <ol>
            {links.map((s, i) => (
              <li key={s.id} style={{ ['--i' as string]: i }}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                  <span className="bp-num">{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="bp-foot">
          {profile.role} · <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </header>
  );
}

// Mega-menu: one trigger reveals a multi-column panel.
export function MegaNav({ onDesign }: { onDesign: (p: Partial<Design>) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEscape(open, () => setOpen(false));
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    addEventListener('pointerdown', onDown);
    return () => removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <header className="site-head nav-mega" ref={wrap} onMouseLeave={() => setOpen(false)}>
      <Brand />
      <nav aria-label="Main">
        <ul className="mega-bar">
          <li>
            <button type="button" className="mega-trigger" aria-expanded={open} onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)}>
              Explore <span aria-hidden="true">▾</span>
            </button>
          </li>
          <li>
            <a href="#expertise">Expertise</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="mega-panel" hidden={!open}>
        <div className="mega-col">
          <h3>Portfolio</h3>
          <ul>
            {links.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mega-col">
          <h3>Expertise</h3>
          <ul>
            {areas.map((a) => (
              <li key={a.id}>
                <a href="#expertise" onClick={() => setOpen(false)}>
                  <strong>{a.name}</strong>
                  <span>{a.tags.join(' · ')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mega-col">
          <h3>Try a style</h3>
          <ul>
            {STYLES.filter((s) => !('experience' in s)).slice(0, 8).map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    flushSync(() => setOpen(false));
                    onDesign({ style: s.id });
                  }}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mega-col mega-feature">
          <h3>Contact</h3>
          <p>{profile.replyTime}</p>
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
        </div>
      </div>
    </header>
  );
}

// Sidebar dock: fixed full-height panel with the active section marked.
export function SidebarNav({ active }: { active: SectionId }) {
  return (
    <aside className="site-head nav-sidebar">
      <Brand />
      <p className="side-role">{profile.role}</p>
      <nav aria-label="Sections">
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="side-foot">
        <p className="status">
          <span className="status-dot" aria-hidden="true" />
          {profile.status}
        </p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </div>
    </aside>
  );
}

// Radial: links fan out in a quarter circle from a round trigger.
export function RadialNav() {
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));
  const n = links.length;
  return (
    <header className="site-head nav-radial">
      <Brand />
      <div className={`radial${open ? ' is-open' : ''}`}>
        <button className="radial-trigger" type="button" aria-expanded={open} aria-controls="radial-items" onClick={() => setOpen((o) => !o)}>
          <span aria-hidden="true">{open ? '×' : '✦'}</span>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
        <ul id="radial-items" className="radial-items">
          {links.map((s, i) => {
            // Two rings in the quarter from straight down to straight left, so items never overlap.
            const inner = Math.ceil(n / 2);
            const ring = i < inner ? 0 : 1;
            const count = ring ? n - inner : inner;
            const k = ring ? i - inner : i;
            const angle = ring ? 90 + (90 / count) * (k + 0.5) : 90 + (90 / (count - 1)) * k;
            return (
              <li key={s.id} style={{ ['--a' as string]: `${angle}deg`, ['--r' as string]: ring ? '15.5rem' : '9.5rem', ['--i' as string]: i }}>
                <a href={`#${s.id}`} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

// Breadcrumbs: a sticky trail that follows the section you are reading.
export function BreadcrumbNav({ active }: { active: SectionId }) {
  const current = sections.find((s) => s.id === active)!;
  return (
    <header className="site-head nav-breadcrumb">
      <div className="crumb-top">
        <Brand />
        <p className="status">
          <span className="status-dot" aria-hidden="true" />
          {profile.status}
        </p>
      </div>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#expertise">Portfolio</a>
          </li>
          {active !== 'home' && (
            <li>
              <a href={`#${current.id}`} aria-current="location">
                {current.label}
              </a>
            </li>
          )}
        </ol>
        <select
          aria-label="Jump to section"
          value={active}
          onChange={(e) => document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' })}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </nav>
    </header>
  );
}
