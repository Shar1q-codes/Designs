import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SECTION_COMPONENTS } from '../components/sections';
import { AreaVisual } from '../components/sections/AreaVisual';
import { areas, profile, sections } from '../content';

const CLIP = 8; // seconds per clip
const FPS = 24;
const N = sections.length;

const timecode = (sec: number) => {
  const f = Math.floor((sec % 1) * FPS);
  const s = Math.floor(sec) % 60;
  const m = Math.floor(sec / 60);
  return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

// Fake but stable audio waveform for the A1 track.
function Waveform() {
  const bars = useMemo(() => Array.from({ length: 160 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 0.75), []);
  return (
    <svg className="wave" viewBox="0 0 160 20" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={i} y={10 - h * 9} width="0.6" height={h * 18} />
      ))}
    </svg>
  );
}

export function VideoLayout({ still }: { still: boolean }) {
  const [t, setT] = useState(0); // playhead position in clips, 0..N
  const [playing, setPlaying] = useState(false);
  const clip = Math.max(0, Math.min(N - 1, Math.floor(t)));
  const progress = t - clip;
  const timelineRef = useRef<HTMLDivElement>(null);

  const seek = (c: number, p = 0) => setT(Math.max(0, Math.min(N - 1, c)) + p);

  // Playback clock; stops at the end of the reel.
  useEffect(() => {
    if (!playing || still) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      // The first frame can be stamped before performance.now(); never step backwards.
      const dt = Math.max(0, (t - last) / 1000);
      last = t;
      setT((v) => {
        const next = v + dt / CLIP;
        if (next >= N) {
          setPlaying(false);
          return N - 0.0001;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, still]);

  // Editor keys: Space play/pause, J/L or arrows step clips, Home to start.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, .dm-panel')) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'k') setPlaying((p) => !p);
      else if (k === 'l' || k === 'arrowright') seek(clip + 1);
      else if (k === 'j' || k === 'arrowleft') seek(clip - 1);
      else if (k === 'home') seek(0);
      else return;
      e.preventDefault();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [clip]);

  const scrub = (clientX: number) => {
    const r = timelineRef.current!.getBoundingClientRect();
    const t = Math.max(0, Math.min(0.9999, (clientX - r.left) / r.width)) * N;
    seek(Math.floor(t), t % 1);
  };

  const Content = SECTION_COMPONENTS[sections[clip].id];
  const time = (clip + progress) * CLIP;

  return (
    <div className="editor">
      <h1 className="sr-only">
        {profile.name}, {profile.role}. The portfolio as a video edit.
      </h1>
      <header className="ed-top">
        <span className="ed-logo" aria-hidden="true" />
        <span className="ed-project">{profile.handle}_portfolio.edit</span>
        <span className="ed-menu" aria-hidden="true">
          File · Edit · Clip · Sequence · Export
        </span>
        <span className="ed-rec">● {playing ? 'PLAYING' : 'PAUSED'}</span>
      </header>

      <aside className="ed-bin" aria-label="Media bin">
        <p className="ed-label">Media bin</p>
        <ul>
          {sections.map((s, i) => (
            <li key={s.id}>
              <button type="button" className={i === clip ? 'is-active' : ''} onClick={() => seek(i)}>
                <span className="bin-thumb" aria-hidden="true">
                  <AreaVisual id={areas[i % areas.length].id} />
                </span>
                <span>
                  {s.file}.mp4
                  <small>{timecode(CLIP)}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="ed-monitor" aria-label="Program monitor">
        <div className="monitor">
          <AnimatePresence mode="wait">
            <motion.div
              key={clip}
              className="monitor-frame"
              initial={still ? false : { clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: still ? 0 : 0.45, ease: [0.7, 0, 0.2, 1] }}
            >
              <Content />
            </motion.div>
          </AnimatePresence>
          <span className="safe-area" aria-hidden="true" />
        </div>
        <div className="transport">
          <span className="tc">{timecode(time)}</span>
          <div className="transport-btns">
            <button type="button" aria-label="Previous clip" onClick={() => seek(clip - 1)}>
              ⏮
            </button>
            <button type="button" className="play" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
              {playing ? '❚❚' : '▶'}
            </button>
            <button type="button" aria-label="Next clip" onClick={() => seek(clip + 1)}>
              ⏭
            </button>
          </div>
          <span className="tc tc-dim">{timecode(N * CLIP)}</span>
        </div>
      </section>

      <aside className="ed-inspector" aria-label="Clip inspector">
        <p className="ed-label">Inspector</p>
        <dl>
          <div>
            <dt>Clip</dt>
            <dd>{sections[clip].label}</dd>
          </div>
          <div>
            <dt>In</dt>
            <dd>{timecode(clip * CLIP)}</dd>
          </div>
          <div>
            <dt>Out</dt>
            <dd>{timecode((clip + 1) * CLIP)}</dd>
          </div>
          <div>
            <dt>Track</dt>
            <dd>V1</dd>
          </div>
          <div>
            <dt>Transition</dt>
            <dd>Wipe, 0.45 s</dd>
          </div>
        </dl>
        <p className="ed-label">Keys</p>
        <p className="ed-keys">
          <kbd>Space</kbd> play · <kbd>J</kbd>/<kbd>L</kbd> clips
        </p>
      </aside>

      <section className="ed-timeline" aria-label="Timeline">
        <div className="tl-ruler" aria-hidden="true">
          {sections.map((_, i) => (
            <span key={i}>{timecode(i * CLIP).slice(3, 8)}</span>
          ))}
        </div>
        <div
          className="tl-tracks"
          ref={timelineRef}
          onPointerDown={(e) => {
            scrub(e.clientX);
            const move = (ev: PointerEvent) => scrub(ev.clientX);
            const up = () => {
              removeEventListener('pointermove', move);
              removeEventListener('pointerup', up);
            };
            addEventListener('pointermove', move);
            addEventListener('pointerup', up);
          }}
        >
          <div className="track">
            <span className="track-name">T1</span>
            {sections.map((s, i) => (
              <span key={s.id} className="clip clip-title" style={{ ['--i' as string]: i }}>
                {s.label}
              </span>
            ))}
          </div>
          <div className="track">
            <span className="track-name">V1</span>
            {sections.map((s, i) => (
              <span key={s.id} className={`clip clip-video${i === clip ? ' is-active' : ''}`} style={{ ['--i' as string]: i }}>
                {s.file}.mp4
              </span>
            ))}
          </div>
          <div className="track track-audio">
            <span className="track-name">A1</span>
            <span className="clip clip-audio">
              <Waveform />
            </span>
          </div>
          <span className="playhead" style={{ left: `${((clip + progress) / N) * 100}%` }} aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
