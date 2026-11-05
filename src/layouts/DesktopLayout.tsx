import { motion, useDragControls } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { SECTION_COMPONENTS } from '../components/sections';
import { profile, sections, type SectionId } from '../content';

type Win = { id: SectionId; z: number; min: boolean };

const ICONS: Record<SectionId, string> = {
  home: 'icon-home',
  expertise: 'icon-folder',
  about: 'icon-doc',
  process: 'icon-doc',
  data: 'icon-chart',
  toolkit: 'icon-folder',
  education: 'icon-doc',
  contact: 'icon-mail',
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Window({
  win,
  index,
  active,
  bounds,
  draggable,
  onFocus,
  onClose,
  onMin,
}: {
  win: Win;
  index: number;
  active: boolean;
  bounds: RefObject<HTMLDivElement>;
  draggable: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
}) {
  const controls = useDragControls();
  const Content = SECTION_COMPONENTS[win.id];
  const label = sections.find((s) => s.id === win.id)!.label;
  return (
    <motion.div
      className={`win${active ? ' is-active' : ''}`}
      style={{ zIndex: win.z, ['--wx' as string]: `${8 + index * 4}%`, ['--wy' as string]: `${4 + index * 6}%` }}
      drag={draggable}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.16 }}
      onPointerDown={onFocus}
      hidden={win.min}
      role="dialog"
      aria-label={label}
    >
      <div className="win-bar" onPointerDown={(e) => draggable && controls.start(e)}>
        <span className="win-title">{label}.exe</span>
        <span className="win-btns">
          <button type="button" aria-label={`Minimise ${label}`} onClick={onMin}>
            _
          </button>
          <button type="button" aria-label={`Close ${label}`} onClick={onClose}>
            ×
          </button>
        </span>
      </div>
      <div className="win-body">
        <Content />
      </div>
    </motion.div>
  );
}

export function DesktopLayout({ designName, tech }: { designName: string; tech: string }) {
  const desk = useRef<HTMLDivElement>(null);
  const [wins, setWins] = useState<Win[]>([
    { id: 'about', z: 2, min: false },
    { id: 'home', z: 3, min: false },
  ]);
  const [startOpen, setStartOpen] = useState(false);
  const [wide, setWide] = useState(() => innerWidth > 760);
  const clock = useClock();

  useEffect(() => {
    const onResize = () => setWide(innerWidth > 760);
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, []);

  const top = Math.max(0, ...wins.map((w) => w.z));
  const activeId = wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id;

  const open = (id: SectionId) => {
    setStartOpen(false);
    setWins((ws) =>
      ws.some((w) => w.id === id)
        ? ws.map((w) => (w.id === id ? { ...w, z: top + 1, min: false } : w))
        : [...ws, { id, z: top + 1, min: false }],
    );
  };
  const focus = (id: SectionId) => setWins((ws) => ws.map((w) => (w.id === id && w.z !== top ? { ...w, z: top + 1 } : w)));
  const close = (id: SectionId) => setWins((ws) => ws.filter((w) => w.id !== id));
  const minimise = (id: SectionId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)));
  const toggleTask = (w: Win) => (w.min || w.id !== activeId ? open(w.id) : minimise(w.id));

  return (
    <div className="desktop">
      <main id="main" className="desk" ref={desk}>
        <ul className="desk-icons" aria-label="Desktop">
          {sections.map((s) => (
            <li key={s.id}>
              <button type="button" className="desk-icon" onDoubleClick={() => open(s.id)} onClick={() => !wide && open(s.id)} onKeyDown={(e) => e.key === 'Enter' && open(s.id)}>
                <span className={`px-icon ${ICONS[s.id]}`} aria-hidden="true" />
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="desk-hint">Double-click an icon to open it. Drag windows by their title bar.</p>
        {wins.map((w, i) => (
          <Window
            key={w.id}
            win={w}
            index={i}
            active={w.id === activeId}
            bounds={desk}
            draggable={wide}
            onFocus={() => focus(w.id)}
            onClose={() => close(w.id)}
            onMin={() => minimise(w.id)}
          />
        ))}
      </main>

      {startOpen && (
        <div className="start-menu" role="menu">
          <p className="start-side" aria-hidden="true">
            {profile.shortName}OS
          </p>
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <button type="button" role="menuitem" onClick={() => open(s.id)}>
                  <span className={`px-icon ${ICONS[s.id]}`} aria-hidden="true" />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="taskbar">
        <button type="button" className="start-btn" aria-expanded={startOpen} onClick={() => setStartOpen((o) => !o)}>
          <span className="start-logo" aria-hidden="true" />
          Start
        </button>
        <div className="tasks">
          {wins.map((w) => (
            <button key={w.id} type="button" className={`task${w.id === activeId ? ' is-active' : ''}`} onClick={() => toggleTask(w)}>
              {sections.find((s) => s.id === w.id)!.label}
            </button>
          ))}
        </div>
        <div className="tray" title={`${designName}: ${tech}`}>
          <span>{clock}</span>
        </div>
      </footer>
    </div>
  );
}
