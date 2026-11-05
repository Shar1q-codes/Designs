import type { Area } from '../../content';

// Small illustrations for each area of expertise. Colours come from the
// active design through the --thumb-* tokens, so they reshape with it.
export function AreaVisual({ id }: { id: Area['id'] }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect className="tbg" width="320" height="200" />
      {id === 'web' && (
        <>
          <rect className="sc" strokeWidth="2" x="40" y="30" width="240" height="140" rx="8" />
          <line className="sc" strokeWidth="2" x1="40" y1="54" x2="280" y2="54" />
          <g className="ta">
            <circle cx="56" cy="42" r="4" />
            <circle cx="70" cy="42" r="4" />
            <circle cx="84" cy="42" r="4" />
          </g>
          <rect className="ta" x="58" y="70" width="110" height="14" rx="3" />
          <rect className="tc" x="58" y="92" width="80" height="8" rx="2" />
          <rect className="tc" x="58" y="106" width="96" height="8" rx="2" />
          <rect className="tb" x="58" y="128" width="54" height="20" rx="10" />
          <rect className="tc" x="186" y="70" width="76" height="78" rx="6" />
          <path className="sa" strokeWidth="2" d="M196 136 L214 112 L230 126 L252 92" />
        </>
      )}
      {id === 'app' && (
        <>
          <rect className="sc" strokeWidth="2.5" x="122" y="18" width="76" height="164" rx="14" />
          <rect className="tc" x="146" y="26" width="28" height="5" rx="2.5" />
          <rect className="ta" x="132" y="42" width="56" height="34" rx="6" />
          <rect className="tc" x="132" y="84" width="56" height="8" rx="2" />
          <rect className="tc" x="132" y="98" width="40" height="8" rx="2" />
          <g className="tb">
            <rect x="132" y="118" width="25" height="25" rx="6" />
            <rect x="163" y="118" width="25" height="25" rx="6" />
            <rect x="132" y="149" width="25" height="25" rx="6" />
            <rect x="163" y="149" width="25" height="25" rx="6" />
          </g>
          <rect className="ta" x="214" y="52" width="76" height="30" rx="8" />
          <rect className="tbg" x="224" y="62" width="40" height="4" rx="2" />
          <rect className="tbg" x="224" y="70" width="28" height="4" rx="2" />
          <circle className="tb" cx="70" cy="132" r="22" />
          <path className="sa" strokeWidth="2" d="M60 132 L68 140 L82 124" />
        </>
      )}
      {id === 'software' && (
        <>
          <rect className="sc" strokeWidth="2" x="32" y="30" width="176" height="140" rx="6" />
          <g className="ta">
            <rect x="48" y="50" width="54" height="8" rx="2" />
            <rect x="48" y="122" width="40" height="8" rx="2" />
          </g>
          <g className="tc">
            <rect x="64" y="66" width="90" height="8" rx="2" />
            <rect x="80" y="82" width="70" height="8" rx="2" />
            <rect x="80" y="98" width="100" height="8" rx="2" />
            <rect x="64" y="138" width="60" height="8" rx="2" />
          </g>
          <rect className="tb" x="48" y="154" width="10" height="8" rx="1" />
          <circle className="sb" strokeWidth="10" strokeDasharray="10 7" cx="252" cy="84" r="26" />
          <circle className="tb" cx="252" cy="84" r="10" />
          <circle className="sa" strokeWidth="6" strokeDasharray="7 6" cx="236" cy="144" r="16" />
        </>
      )}
      {id === 'game' && (
        <>
          <rect className="tc" x="0" y="150" width="320" height="50" />
          <rect className="ta" x="40" y="126" width="40" height="24" />
          <rect className="ta" x="80" y="102" width="40" height="48" />
          <rect className="tb" x="196" y="86" width="64" height="12" rx="2" />
          <circle className="tb" cx="150" cy="60" r="8" />
          <circle className="tb" cx="176" cy="48" r="8" />
          <circle className="tb" cx="202" cy="60" r="8" />
          <rect className="sa" strokeWidth="2.5" x="140" y="112" width="26" height="38" rx="4" />
          <circle className="ta" cx="153" cy="124" r="4" />
          <path className="sc" strokeWidth="2" strokeDasharray="4 5" d="M100 96 Q150 20 222 80" />
        </>
      )}
      {id === 'video' && (
        <>
          <rect className="sc" strokeWidth="2" x="40" y="24" width="240" height="100" rx="6" />
          <path className="ta" d="M148 54 L180 74 L148 94 Z" />
          <rect className="tc" x="40" y="140" width="240" height="4" rx="2" />
          <g className="tb">
            <rect x="40" y="152" width="70" height="14" rx="3" />
            <rect x="114" y="152" width="46" height="14" rx="3" />
            <rect x="164" y="152" width="92" height="14" rx="3" />
          </g>
          <g className="tc">
            <rect x="40" y="172" width="44" height="10" rx="3" />
            <rect x="88" y="172" width="120" height="10" rx="3" />
          </g>
          <rect className="ta" x="196" y="134" width="3" height="54" />
        </>
      )}
      {id === 'data' && (
        <>
          <line className="sc" strokeWidth="2" x1="40" y1="166" x2="290" y2="166" />
          <line className="sc" strokeWidth="2" x1="40" y1="166" x2="40" y2="30" />
          <g className="tc">
            <rect x="58" y="116" width="22" height="50" rx="2" />
            <rect x="92" y="92" width="22" height="74" rx="2" />
            <rect x="126" y="104" width="22" height="62" rx="2" />
            <rect x="160" y="70" width="22" height="96" rx="2" />
          </g>
          <path className="sa" strokeWidth="2.5" d="M69 104 L103 80 L137 90 L171 56 L210 46 L270 30" />
          <g className="tb">
            <circle cx="222" cy="120" r="5" />
            <circle cx="240" cy="104" r="5" />
            <circle cx="232" cy="138" r="5" />
            <circle cx="258" cy="96" r="5" />
            <circle cx="268" cy="118" r="5" />
            <circle cx="250" cy="130" r="5" />
          </g>
        </>
      )}
    </svg>
  );
}
