import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { profile } from '../content';
import type { StyleId } from '../designs';
import { COMMANDS, COMPLETIONS, resolve } from './terminal/commands';

type Entry = { id: number; input?: string; output: ReactNode };

const PROMPT = `guest@${profile.handle}:~$`;
const QUICK = ['whoami', 'expertise', 'about', 'process', 'data', 'toolkit', 'education', 'contact', 'design', 'help'];

let nextId = 0;

export function TerminalLayout({ onDesign }: { onDesign: (id: StyleId) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const run = (raw: string) => {
    const input = raw.trim();
    if (!input) {
      setEntries((e) => [...e, { id: nextId++, input: '', output: null }]);
      return;
    }
    const nextHistory = [...history, input];
    setHistory(nextHistory);
    setCursor(-1);
    let cleared = false;
    const { cmd, args, name } = resolve(input);
    const output = cmd ? (
      cmd.run(args, { history: nextHistory, clear: () => (cleared = true), design: onDesign })
    ) : (
      <p className="t-error">
        command not found: {name}. Type <b>help</b>.
      </p>
    );
    setEntries((e) => (cleared ? [] : [...e, { id: nextId++, input, output }]));
  };

  // Boot sequence: greet, then run whoami so the first screen already says who this is.
  useEffect(() => {
    const boot: Entry = {
      id: nextId++,
      output: (
        <div className="t-block t-boot">
          <p className="t-dim">Last login: {new Date().toDateString()} on ttys001</p>
          <p className="t-banner">{profile.name}</p>
          <p className="t-dim">Type a command or click one below. Start with help.</p>
        </div>
      ),
    };
    setEntries([boot, { id: nextId++, input: 'whoami', output: COMMANDS.whoami.run([], { history: [], clear: () => {}, design: onDesign }) }]);
  }, [onDesign]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [entries]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      const c = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(c);
      setValue(history[c]);
    } else if (e.key === 'ArrowDown' && cursor >= 0) {
      e.preventDefault();
      const c = cursor + 1;
      setCursor(c >= history.length ? -1 : c);
      setValue(c >= history.length ? '' : history[c]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = COMPLETIONS.filter((c) => c.startsWith(value.trim()));
      if (matches.length === 1) setValue(matches[0] + ' ');
      else if (matches.length > 1) {
        setEntries((en) => [...en, { id: nextId++, input: value, output: <p className="t-dim">{matches.join('   ')}</p> }]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div className="term-shell">
      <div className="term-window">
        <div className="term-bar">
          <span className="term-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="term-title">
            guest@{profile.handle}: ~ — portfolio
          </span>
        </div>
        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          <h1 className="sr-only">
            {profile.name}, {profile.role}
          </h1>
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {entries.map((en) => (
              <div className="t-entry" key={en.id}>
                {en.input !== undefined && (
                  <p className="t-cmd">
                    <span className="t-prompt">{PROMPT}</span> {en.input}
                  </p>
                )}
                {en.output}
              </div>
            ))}
          </div>
          <form
            className="t-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue('');
            }}
          >
            <label className="t-prompt" htmlFor="term-input">
              {PROMPT}
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Type a command"
            />
          </form>
        </div>
      </div>
      <nav className="term-quick" aria-label="Quick commands">
        {QUICK.map((q) => (
          <button key={q} type="button" onClick={() => run(q)}>
            {q}
          </button>
        ))}
      </nav>
    </div>
  );
}
