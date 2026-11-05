import { useState, type FormEvent } from 'react';
import { profile } from '../../content';
import { Section } from './Section';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mail link still works */
    }
  };

  // No backend: the form opens the visitor's mail app with the message filled in.
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const message = String(data.get('message') ?? '');
    const subject = encodeURIComponent(`Hello from ${name || 'your portfolio'}`);
    const body = encodeURIComponent(`${message}\n\n${name}`);
    location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Section id="contact" title="Let's work together" className="contact">
      <p className="contact-lede">{profile.replyTime}</p>
      <a className="contact-mail" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="contact-row">
        <button className="btn btn-ghost" type="button" onClick={copy}>
          {copied ? 'Email copied' : 'Copy email'}
        </button>
        <ul className="socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <form className="contact-form" onSubmit={send}>
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label className="span-2">
          <span>Message</span>
          <textarea name="message" rows={4} required />
        </label>
        <button className="btn btn-primary" type="submit">
          Send message
        </button>
      </form>
    </Section>
  );
}
