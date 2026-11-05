import { about, dataPipeline, education, process, toolkit } from '../../content';
import { Section } from './Section';

export function About() {
  return (
    <Section id="about" title="About me">
      <div className="about-grid">
        <div className="about-text">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="facts">
          {about.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

export function Process() {
  return (
    <Section id="process" title="How I work">
      <ol className="steps">
        {process.map((s, i) => (
          <li className="step" key={s.step}>
            <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.step}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function DataScience() {
  return (
    <Section id="data" title="Data science workflow">
      <p className="sec-lede">
        Trained at Boston Institute of Analytics, I work through data in five stages, from raw files to a decision someone can act on.
      </p>
      <ol className="pipeline">
        {dataPipeline.map((s, i) => (
          <li className="pipe-node" key={s.step} style={{ ['--i' as string]: i }}>
            <span className="pipe-dot" aria-hidden="true" />
            <h3>{s.step}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Toolkit() {
  return (
    <Section id="toolkit" title="Toolkit">
      <div className="toolkit">
        {toolkit.map((g) => (
          <div className="tool-group" key={g.group}>
            <h3>{g.group}</h3>
            <ul>
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" title="Education">
      <ol className="timeline">
        {education.map((e) => (
          <li key={e.title}>
            <span className="tl-years">{e.when}</span>
            <div>
              <p className="tl-role">{e.title}</p>
              <p className="tl-org">{e.org}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
