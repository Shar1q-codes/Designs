import { areas, profile } from '../../content';
import { AreaVisual } from './AreaVisual';
import { Section } from './Section';

export function Hero() {
  return (
    <Section id="home" className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{profile.name}</p>
        <h1 className="hero-title">
          {profile.headline.map((line) => (
            <span className="ht-line" key={line}>
              {line.includes(profile.headlineEmphasis) ? (
                <>
                  {line.replace(profile.headlineEmphasis, '')}
                  <em>{profile.headlineEmphasis}</em>
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>
        <p className="hero-lede">{profile.lede}</p>
        <div className="actions">
          <a className="btn btn-primary" href="#expertise">
            See my expertise
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
        <p className="hero-fact">{profile.fact}</p>
      </div>
      {/* Shown by layouts that give the hero a media side: split, full-screen, Gutenberg */}
      <div className="hero-media" aria-hidden="true">
        {areas.map((a) => (
          <div className="hm-tile" key={a.id}>
            <AreaVisual id={a.id} />
          </div>
        ))}
      </div>
    </Section>
  );
}
