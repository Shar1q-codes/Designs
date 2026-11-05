import { useEffect, useRef } from 'react';
import { areas, dataPipeline, sections, type SectionId } from '../../content';
import { AreaVisual } from '../sections/AreaVisual';

// Parallax: decorative layers that drift slower or faster than the page.
export function ParallaxLayers({ still }: { still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = scrollY;
      ref.current?.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        el.style.transform = `translate3d(0, ${-y * Number(el.dataset.depth)}px, 0)`;
      });
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [still]);

  return (
    <div className="parallax" ref={ref} aria-hidden="true">
      <div className="px-layer px-far" data-depth="0.1">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ ['--x' as string]: `${(i * 37) % 100}%`, ['--y' as string]: `${i * 260}px` }} />
        ))}
      </div>
      <div className="px-layer px-mid" data-depth="0.3">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ ['--x' as string]: `${(i * 53 + 11) % 100}%`, ['--y' as string]: `${i * 420 + 120}px` }} />
        ))}
      </div>
      <div className="px-layer px-near" data-depth="0.6">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ ['--x' as string]: `${(i * 71 + 23) % 100}%`, ['--y' as string]: `${i * 640 + 300}px` }} />
        ))}
      </div>
    </div>
  );
}

const STORY: Record<SectionId, { kicker: string; line: string }> = {
  home: { kicker: 'Start', line: 'One engineer across eight disciplines.' },
  expertise: { kicker: 'Range', line: 'Web, apps, software, games, data and video.' },
  about: { kicker: 'Background', line: 'Engineering first, data science alongside.' },
  process: { kicker: 'Method', line: 'Understand, design, build, measure.' },
  data: { kicker: 'Pipeline', line: 'Raw data in, decisions out.' },
  toolkit: { kicker: 'Tools', line: 'The languages and tools behind the work.' },
  education: { kicker: 'Training', line: 'Data Science, Boston Institute of Analytics.' },
  contact: { kicker: 'Next', line: 'Your project, built end to end.' },
};

// Scrollytelling: a sticky graphic that rebuilds itself for each section.
export function ScrollyGraphic({ active }: { active: SectionId }) {
  const index = sections.findIndex((s) => s.id === active);
  const progress = (index + 1) / sections.length;
  const story = STORY[active];
  const area = areas[index % areas.length];
  return (
    <aside className="scrolly" aria-hidden="true">
      <div className="scrolly-card" key={active}>
        <svg className="scrolly-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="ring-bg" />
          <circle cx="60" cy="60" r="52" className="ring-fg" style={{ strokeDashoffset: 327 * (1 - progress) }} />
          <text x="60" y="68" textAnchor="middle">
            {String(index + 1).padStart(2, '0')}
          </text>
        </svg>
        <p className="scrolly-kicker">{story.kicker}</p>
        <p className="scrolly-line">{story.line}</p>
        {active === 'data' ? (
          <ol className="scrolly-pipe">
            {dataPipeline.map((s, i) => (
              <li key={s.step} style={{ ['--i' as string]: i }}>
                {s.step}
              </li>
            ))}
          </ol>
        ) : (
          <div className="scrolly-visual">
            <AreaVisual id={area.id} />
          </div>
        )}
        <ol className="scrolly-steps">
          {sections.map((s, i) => (
            <li key={s.id} className={i <= index ? 'is-done' : ''} />
          ))}
        </ol>
      </div>
    </aside>
  );
}
