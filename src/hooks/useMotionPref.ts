import { useEffect, useState } from 'react';

// Motion is paused when the visitor asks for it, or when their system prefers reduced motion.
export function useMotionPref() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const still = paused || reduced;

  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', still);
  }, [still]);

  return { still, paused, reduced, togglePaused: () => setPaused((p) => !p) };
}
