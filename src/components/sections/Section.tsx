import { createContext, useContext, type ReactNode } from 'react';
import { sections, type SectionId } from '../../content';

// Infinite scroll renders the sections more than once; each round gets its own
// number so element ids stay unique while data-section stays the same.
export const RoundContext = createContext(0);

type Props = {
  id: SectionId;
  title?: string;
  className?: string;
  children: ReactNode;
};

// Wraps every content block with the data attributes designs hook into
// (terminal prompts read data-cmd, window title bars read data-title).
export function Section({ id, title, className = '', children }: Props) {
  const round = useContext(RoundContext);
  const index = sections.findIndex((s) => s.id === id);
  const meta = sections[index];
  const domId = round ? `${id}-${round}` : id;
  return (
    <section
      id={domId}
      data-section={round ? undefined : id}
      data-cmd={meta.cmd}
      data-title={meta.label}
      className={`sec sec-${id} ${className}`.trim()}
      aria-labelledby={title ? `${domId}-title` : undefined}
    >
      {title && (
        <div className="sec-head">
          <span className="sec-num">{String(index).padStart(2, '0')}</span>
          <h2 id={`${domId}-title`}>{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
