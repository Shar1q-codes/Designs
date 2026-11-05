import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BreadcrumbNav, HamburgerNav, MegaNav, RadialNav, SidebarNav } from '../components/nav/Menus';
import { ParallaxLayers, ScrollyGraphic } from '../components/nav/Motion';
import { Footer, Header, SECTION_COMPONENTS, Ticker } from '../components/sections';
import { RoundContext } from '../components/sections/Section';
import { sections } from '../content';
import { describe, type Design } from '../designs';
import { useActiveSection } from '../hooks/useActiveSection';

type Props = { design: Design; onDesign: (p: Partial<Design>) => void; still: boolean };

function Sections() {
  return (
    <>
      {sections.map(({ id }) => {
        const Component = SECTION_COMPONENTS[id];
        return id === 'home' ? (
          <div className="hero-wrap" key={id}>
            <Component />
            <Ticker />
          </div>
        ) : (
          <Component key={id} />
        );
      })}
    </>
  );
}

// Infinite scroll: another round of sections arrives as you near the bottom.
function InfiniteSections() {
  const [rounds, setRounds] = useState(1);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setRounds((r) => Math.min(r + 1, 12)), {
      rootMargin: '600px',
    });
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);
  return (
    <>
      {Array.from({ length: rounds }, (_, r) => (
        <RoundContext.Provider value={r} key={r}>
          {r > 0 && (
            <p className="feed-divider" aria-hidden="true">
              <span>Round {r + 1}</span>
            </p>
          )}
          <Sections />
        </RoundContext.Provider>
      ))}
      <div ref={sentinel} className="feed-loader" role="status">
        {rounds < 12 ? 'Loading more…' : 'You have seen it all, twelve times.'}
      </div>
    </>
  );
}

// Horizontal scroll: the wheel moves the track sideways.
function HorizontalTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      // Let a section with its own vertical overflow scroll first.
      const inner = (e.target as Element).closest<HTMLElement>('.sec');
      if (inner && inner.scrollHeight > inner.clientHeight + 2) {
        const atTop = inner.scrollTop <= 0 && e.deltaY < 0;
        const atEnd = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2 && e.deltaY > 0;
        if (!atTop && !atEnd) return;
      }
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: 'auto' });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  return (
    <div className="h-track" ref={ref} tabIndex={0} aria-label="Sections, scroll sideways">
      {children}
    </div>
  );
}

export function FlowLayout({ design, onDesign, still }: Props) {
  const active = useActiveSection(`${design.layout}-${design.nav}`);

  const nav = {
    sticky: <Header />,
    hamburger: <HamburgerNav />,
    mega: <MegaNav onDesign={onDesign} />,
    sidebar: <SidebarNav active={active} />,
    radial: <RadialNav />,
    breadcrumb: <BreadcrumbNav active={active} />,
    parallax: <Header />,
    scrolly: <Header />,
  }[design.nav];

  const body = design.layout === 'infinite' ? <InfiniteSections /> : <Sections />;

  return (
    <>
      {design.nav === 'parallax' && <ParallaxLayers still={still} />}
      <div className="shell">
        {nav}
        <main id="main">
          {design.nav === 'scrolly' && design.layout !== 'horizontal' && design.layout !== 'dashboard' && (
            <ScrollyGraphic active={active} />
          )}
          {design.layout === 'horizontal' ? <HorizontalTrack>{body}</HorizontalTrack> : <div className="flow">{body}</div>}
        </main>
        {design.layout !== 'infinite' && <Footer label={describe(design)} />}
      </div>
    </>
  );
}
