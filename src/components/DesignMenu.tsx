import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AXES, DEFAULT_DESIGN, describe, getStyle, type Axis, type AxisDef, type Design } from '../designs';

type Origin = { x: number; y: number };
type Props = { design: Design; onChange: (patch: Partial<Design>, origin?: Origin) => void };

const TABS: { axis: Axis; label: string }[] = [
  { axis: 'style', label: 'Style' },
  { axis: 'layout', label: 'Layout' },
  { axis: 'nav', label: 'Navigation' },
];

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

const centre = (el?: Element | null): Origin => {
  const r = el?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth - 60, y: innerHeight - 40 };
};

const pickRandom = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

// Mini schematic for a layout or navigation option.
function Schematic({ axis, id }: { axis: 'layout' | 'nav'; id: string }) {
  return (
    <span className={`pv pv-${axis} pv-${axis}-${id}`} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

// Style previews render with the style's own tokens: the data-style attribute scopes them.
function StylePreview({ id }: { id: string }) {
  return (
    <span className="pv pv-style" data-style={id} aria-hidden="true">
      <span className="pvs-title">Aa</span>
      <span className="pvs-card" />
      <span className="pvs-btn" />
    </span>
  );
}

export function DesignMenu({ design, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Axis>('style');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const experience = getStyle(design.style).experience;

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu synchronously before the change, so the reveal's "before" snapshot
  // has no menu in it and the whole circle is visible. The origin is measured first.
  const pick = useCallback(
    (patch: Partial<Design>, el?: Element | null) => {
      const origin = centre(el);
      flushSync(() => setOpen(false));
      onChange(patch, origin);
    },
    [onChange],
  );

  const surprise = (el?: Element | null) =>
    pick(
      {
        style: pickRandom(AXES.style.filter((s) => !('experience' in s))).id,
        layout: pickRandom(AXES.layout).id,
        nav: pickRandom(AXES.nav).id,
      },
      el,
    );

  // Keyboard: D toggles the menu, Esc closes, 1-9 pick within the open tab.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key === 'Escape' && open) close();
      else if (e.key.toLowerCase() === 'd') setOpen((o) => !o);
      else if (open && /^[1-9]$/.test(e.key)) {
        const item = (AXES[tab] as readonly AxisDef[])[Number(e.key) - 1];
        if (item) pick({ [tab]: item.id } as Partial<Design>, panelRef.current?.querySelector(`[data-pick="${item.id}"]`));
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, close, tab, pick]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) close(false);
    };
    addEventListener('pointerdown', onDown);
    return () => removeEventListener('pointerdown', onDown);
  }, [open, close, tab]);

  const items = AXES[tab] as readonly AxisDef[];
  const locked = tab !== 'style' && !!experience;

  return (
    <>
      <button ref={toggleRef} className="dm-toggle" type="button" aria-expanded={open} aria-controls="dm-panel" onClick={() => setOpen((o) => !o)}>
        <span className="dm-icon" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Designs</span>
        <kbd>D</kbd>
      </button>

      <div ref={panelRef} className="dm-panel" id="dm-panel" role="dialog" aria-labelledby="dm-title" hidden={!open}>
        <div className="dm-head">
          <div>
            <h2 id="dm-title">Shape-shift this site</h2>
            <p>
              Mix any style with any layout and navigation. Each one is built from scratch to show a different way of engineering the same
              content.
            </p>
          </div>
          <button className="dm-close" type="button" aria-label="Close design menu" onClick={() => close()}>
            ×
          </button>
        </div>

        <div className="dm-now">
          <span>Now: {describe(design)}</span>
          <span className="dm-actions">
            <button type="button" onClick={(e) => surprise(e.currentTarget)}>
              Surprise me
            </button>
            <button type="button" onClick={(e) => pick(DEFAULT_DESIGN, e.currentTarget)}>
              Reset
            </button>
          </span>
        </div>

        <div className="dm-tabs" role="tablist" aria-label="Design axis">
          {TABS.map((t) => (
            <button key={t.axis} type="button" role="tab" aria-selected={tab === t.axis} onClick={() => setTab(t.axis)}>
              {t.label}
              <span className="dm-count">{AXES[t.axis].length}</span>
            </button>
          ))}
        </div>

        {locked && <p className="dm-note">{getStyle(design.style).name} is a full experience with its own layout and navigation. Pick another style to combine.</p>}

        <ul className={`dm-grid${locked ? ' is-locked' : ''}`} role="tabpanel">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className="dm-item"
                data-pick={item.id}
                aria-pressed={design[tab] === item.id}
                disabled={locked}
                onClick={(e) => pick({ [tab]: item.id } as Partial<Design>, e.currentTarget)}
              >
                {tab === 'style' ? <StylePreview id={item.id} /> : <Schematic axis={tab} id={item.id} />}
                <span className="dm-name">
                  {item.name}
                  {i < 9 && <kbd>{i + 1}</kbd>}
                </span>
                <span className="dm-desc">{item.desc}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="dm-hint">
          <kbd>D</kbd> toggle · <kbd>1</kbd>–<kbd>9</kbd> pick in this tab · <kbd>Esc</kbd> close · Every combination has its own shareable link.
        </p>
      </div>
    </>
  );
}
