import { DesignMenu } from './components/DesignMenu';
import { SceneLayer, usePointerEffects } from './components/Effects';
import { useDesign } from './hooks/useDesign';
import { useMotionPref } from './hooks/useMotionPref';
import { DesktopLayout } from './layouts/DesktopLayout';
import { FlowLayout } from './layouts/FlowLayout';
import { GameLayout } from './layouts/GameLayout';
import { TerminalLayout } from './layouts/TerminalLayout';
import { VideoLayout } from './layouts/VideoLayout';

export default function App() {
  const { design, style, change } = useDesign();
  const { still, paused, togglePaused } = useMotionPref();
  usePointerEffects(design.style);

  const experience = style.experience;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SceneLayer scene={style.scene} still={still} />

      {!experience && <FlowLayout design={design} onDesign={change} still={still} />}
      {experience === 'terminal' && <TerminalLayout onDesign={(id) => change({ style: id })} />}
      {experience === 'desktop' && <DesktopLayout designName={style.name} tech={style.desc} />}
      {experience === 'game' && <GameLayout />}
      {experience === 'video' && <VideoLayout still={still} />}

      <DesignMenu design={design} onChange={change} />

      <button className="motion-toggle" type="button" aria-pressed={paused} onClick={togglePaused}>
        {paused ? 'Play motion' : 'Pause motion'}
      </button>
      <p className="sr-only" aria-live="polite">
        Design: {style.name}
      </p>
    </>
  );
}
