import { useEffect, useState } from 'react';
import type { SectionId } from '../content';

// Tracks which section is in the middle band of the screen.
// Re-observes whenever `key` changes (a new layout means new elements).
export function useActiveSection(key: string): SectionId {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-section]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute('data-section') as SectionId);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
