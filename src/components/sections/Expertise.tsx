import { areas } from '../../content';
import { AreaVisual } from './AreaVisual';
import { Section } from './Section';

export function Expertise() {
  return (
    <Section id="expertise" title="What I do">
      <ul className="cards">
        {areas.map((area) => (
          <li className="card" key={area.id}>
            <div className="thumb">
              <AreaVisual id={area.id} />
            </div>
            <div className="card-body">
              <h3>{area.name}</h3>
              <p className="card-desc">{area.summary}</p>
              <ul className="tags">
                {area.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
