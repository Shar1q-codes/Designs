import { profile, sections, tickerText } from '../../content';

export function Header() {
  return (
    <header className="site-head">
      <a className="brand" href="#home" aria-label={`${profile.name}, back to top`}>
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">{profile.name}</span>
      </a>
      <nav className="nav" aria-label="Sections">
        <ul>
          {sections
            .filter((s) => s.id !== 'home')
            .map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
        </ul>
      </nav>
      <p className="status">
        <span className="status-dot" aria-hidden="true" />
        {profile.status}
      </p>
    </header>
  );
}

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
}

export function Footer({ label }: { label: string }) {
  return (
    <footer className="site-foot">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p>
        Now showing: <span className="current-design">{label}</span>. Press <kbd>D</kbd> to shape-shift.
      </p>
    </footer>
  );
}
