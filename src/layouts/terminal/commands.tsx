import type { ReactNode } from 'react';
import { about, areas, dataPipeline, education, process, profile, toolkit } from '../../content';
import { STYLES, type StyleId } from '../../designs';

export type CommandContext = {
  history: string[];
  clear: () => void;
  design: (id: StyleId) => void;
};

type Command = {
  help: string;
  aliases?: string[];
  run: (args: string[], ctx: CommandContext) => ReactNode;
};

const Row = ({ k, v }: { k: string; v: ReactNode }) => (
  <div className="t-row">
    <span className="t-key">{k}</span>
    <span>{v}</span>
  </div>
);

export const COMMANDS: Record<string, Command> = {
  help: {
    help: 'List every command',
    run: () => (
      <div className="t-block">
        {Object.entries(COMMANDS).map(([name, c]) => (
          <Row key={name} k={name} v={c.help} />
        ))}
        <p className="t-dim">Tip: Tab completes, ↑ and ↓ walk your history.</p>
      </div>
    ),
  },
  whoami: {
    help: 'Who I am',
    run: () => (
      <div className="t-block">
        <p className="t-strong">{profile.name}</p>
        <p>{profile.role}</p>
        <p className="t-dim">{profile.lede}</p>
        <p className="t-accent">{profile.fact}</p>
      </div>
    ),
  },
  about: {
    help: 'Background and facts',
    aliases: ['cat about.md'],
    run: () => (
      <div className="t-block">
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {about.facts.map((f) => (
          <Row key={f.label} k={f.label.toLowerCase()} v={f.value} />
        ))}
      </div>
    ),
  },
  expertise: {
    help: 'What I build',
    aliases: ['ls ./expertise', 'ls'],
    run: () => (
      <div className="t-block">
        {areas.map((a) => (
          <div key={a.id} className="t-item">
            <p className="t-strong">
              <span className="t-dim">drwxr-xr-x </span>
              {a.id}/ <span className="t-dim">· {a.name}</span>
            </p>
            <p>{a.summary}</p>
            <p className="t-dim">{a.tags.map((t) => `#${t.toLowerCase().replace(/\s+/g, '-')}`).join('  ')}</p>
          </div>
        ))}
      </div>
    ),
  },
  process: {
    help: 'How I work',
    aliases: ['cat process.md'],
    run: () => (
      <div className="t-block">
        {process.map((s, i) => (
          <Row key={s.step} k={`${i + 1}. ${s.step.toLowerCase()}`} v={s.text} />
        ))}
      </div>
    ),
  },
  data: {
    help: 'Run my data science pipeline',
    aliases: ['python pipeline.py'],
    run: () => (
      <div className="t-block">
        <p className="t-dim">Running 5 stages…</p>
        {dataPipeline.map((s, i) => (
          <p key={s.step} className="t-stage" style={{ ['--i' as string]: i }}>
            <span className="t-accent">[{'#'.repeat(i + 1).padEnd(dataPipeline.length, '.')}]</span> {s.step}: {s.text}
          </p>
        ))}
        <p className="t-accent">✓ pipeline complete</p>
      </div>
    ),
  },
  toolkit: {
    help: 'Languages and tools',
    aliases: ['ls ~/toolkit', 'skills'],
    run: () => (
      <div className="t-block">
        {toolkit.map((g) => (
          <Row key={g.group} k={g.group.toLowerCase()} v={g.items.join(', ')} />
        ))}
      </div>
    ),
  },
  education: {
    help: 'Where I trained',
    aliases: ['cat education.txt'],
    run: () => (
      <div className="t-block">
        {education.map((e) => (
          <Row key={e.title} k={e.org} v={e.title} />
        ))}
      </div>
    ),
  },
  contact: {
    help: 'How to reach me',
    aliases: ['mail --compose', 'mail'],
    run: () => (
      <div className="t-block">
        <p>{profile.replyTime}</p>
        <Row k="email" v={<a href={`mailto:${profile.email}`}>{profile.email}</a>} />
        {profile.socials.map((s) => (
          <Row
            key={s.label}
            k={s.label.toLowerCase()}
            v={
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.href}
              </a>
            }
          />
        ))}
      </div>
    ),
  },
  design: {
    help: 'Switch style: design <name>',
    aliases: ['designs'],
    run: ([name], ctx) => {
      const match = STYLES.find((t) => t.id === name || t.name.toLowerCase() === name?.toLowerCase());
      if (match) {
        setTimeout(() => ctx.design(match.id), 350);
        return <p className="t-accent">Shape-shifting into {match.name}…</p>;
      }
      return (
        <div className="t-block">
          {name && <p className="t-error">No design called "{name}".</p>}
          {STYLES.map((t) => (
            <Row key={t.id} k={t.id} v={`${t.name}: ${t.desc}`} />
          ))}
          <p className="t-dim">Usage: design brutal</p>
        </div>
      );
    },
  },
  history: {
    help: 'Commands you have run',
    run: (_, ctx) => (
      <div className="t-block">
        {ctx.history.length ? ctx.history.map((h, i) => <Row key={i} k={String(i + 1)} v={h} />) : <p className="t-dim">Empty.</p>}
      </div>
    ),
  },
  clear: {
    help: 'Clear the screen',
    run: (_, ctx) => {
      ctx.clear();
      return null;
    },
  },
  sudo: {
    help: 'Try it',
    run: () => <p className="t-error">Permission denied. This portfolio runs with least privilege.</p>,
  },
};

// Resolve "cat about.md", "ls" and friends to a command.
export function resolve(input: string): { cmd?: Command; args: string[]; name: string } {
  const trimmed = input.trim();
  for (const [name, c] of Object.entries(COMMANDS)) {
    if (c.aliases?.includes(trimmed)) return { cmd: c, args: [], name };
  }
  const [name = '', ...args] = trimmed.split(/\s+/);
  return { cmd: COMMANDS[name.toLowerCase()], args, name };
}

export const COMPLETIONS = [
  ...Object.keys(COMMANDS),
  ...STYLES.map((t) => `design ${t.id}`),
];
