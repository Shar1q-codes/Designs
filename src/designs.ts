// The design engine's registry. A design is three independent choices:
//   style      – colour, type, surfaces, effects   (src/styles/styles/<id>.css)
//   layout     – how the sections are arranged      (src/styles/layouts.css)
//   navigation – how you move around the page       (src/components/nav/)
// To add one, append an entry here and add its CSS (see README.md).

export type Scene = 'space' | 'grid' | 'matrix' | 'blobs' | 'cursor';

export type StyleDef = {
  id: string;
  name: string;
  desc: string;
  fonts?: string; // Google Fonts css2 family query, loaded on demand
  themeColor: string;
  scene?: Scene; // a decorative background layer
  experience?: 'terminal' | 'desktop' | 'game' | 'video'; // replaces layout and navigation entirely
};

export type AxisDef = { id: string; name: string; desc: string };

export const STYLES = [
  { id: 'glass', name: 'Glassmorphism', desc: 'Frosted glass floating in a 3D starfield.', themeColor: '#03050b', scene: 'space' },
  { id: 'minimal', name: 'Minimalism', desc: 'Negative space and nothing extra.', themeColor: '#ffffff', fonts: 'family=Inter:wght@400;500;600' },
  { id: 'maximal', name: 'Maximalism', desc: 'Clashing patterns, many fonts, packed.', themeColor: '#ff3d7f', fonts: 'family=Bricolage+Grotesque:wght@400;800&family=Playfair+Display:ital,wght@1,700&family=Space+Mono:wght@400;700' },
  { id: 'brutalism', name: 'Brutalism', desc: 'Default fonts, raw lines, no polish.', themeColor: '#ffffff' },
  { id: 'neobrutal', name: 'Neo-Brutalism', desc: 'Pastels, thick borders, hard shadows.', themeColor: '#fef3c7', fonts: 'family=Space+Grotesk:wght@500;700' },
  { id: 'flat', name: 'Flat Design', desc: 'Crisp edges, bright colour, zero depth.', themeColor: '#2d9cdb', fonts: 'family=Poppins:wght@400;600;700' },
  { id: 'flat2', name: 'Flat 2.0', desc: 'Flat colour with a hint of shadow.', themeColor: '#f7f9fc', fonts: 'family=Nunito+Sans:wght@400;600;800' },
  { id: 'material', name: 'Material Design', desc: 'Paper layers, elevation and ripples.', themeColor: '#fef7ff', fonts: 'family=Roboto:wght@400;500;700' },
  { id: 'fluent', name: 'Fluent Design', desc: 'Acrylic, light that follows the cursor.', themeColor: '#f3f3f3' },
  { id: 'clay', name: 'Claymorphism', desc: 'Pillowy clay with inner and outer shadow.', themeColor: '#f1e9ff', fonts: 'family=Nunito:wght@600;800;900' },
  { id: 'neumorph', name: 'Neumorphism', desc: 'Surfaces pressed out of one material.', themeColor: '#e4e8ee', fonts: 'family=Manrope:wght@400;500;600;700;800' },
  { id: 'y2k', name: 'Retro Y2K', desc: 'Chrome, pixel type, matrix code.', themeColor: '#0a0a1f', scene: 'matrix', fonts: 'family=Orbitron:wght@500;800&family=VT323' },
  { id: 'skeuo', name: 'Skeuomorphism', desc: 'Leather, paper, stitching and metal.', themeColor: '#3b2a1e', fonts: 'family=Alegreya:wght@500;700&family=Alegreya+Sans:wght@400;500;700' },
  { id: 'corporate', name: 'Corporate Clean', desc: 'Blue, grey and white. Crisp and calm.', themeColor: '#ffffff', fonts: 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  { id: 'editorial', name: 'Editorial', desc: 'Huge serif headlines in columns.', themeColor: '#f3eee4', fonts: 'family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter+Tight:wght@500;600' },
  { id: 'organic', name: 'Organic', desc: 'Earthy tones and living blob shapes.', themeColor: '#f2ede3', scene: 'blobs', fonts: 'family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;700' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon glow over a synthwave grid.', themeColor: '#07020f', scene: 'grid', fonts: 'family=Rajdhani:wght@500;700&family=Share+Tech+Mono' },
  { id: 'experimental', name: 'Experimental', desc: 'Overlaps, tilt and a cursor that bites.', themeColor: '#e8ff00', scene: 'cursor', fonts: 'family=Syne:wght@400;600;800' },
  { id: 'industrial', name: 'Industrial', desc: 'Blueprint lines on raw concrete.', themeColor: '#0d3b7a', fonts: 'family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;700' },
  { id: 'notebook', name: 'Notebook', desc: 'Ink, tape and polaroids on lined paper.', themeColor: '#fdfbf4', fonts: 'family=Caveat:wght@500;700&family=Kalam:wght@300;400;700' },
  { id: 'game', name: 'Game World', desc: 'Walk a level. Every checkpoint is a section.', themeColor: '#1b1240', experience: 'game', fonts: 'family=Press+Start+2P&family=VT323' },
  { id: 'video', name: 'Video Editor', desc: 'The site as an edit timeline. Press play.', themeColor: '#121316', experience: 'video', fonts: 'family=Inter:wght@400;500;600' },
  { id: 'terminal', name: 'Terminal', desc: 'A working shell. Type to explore.', themeColor: '#050805', experience: 'terminal' },
  { id: 'retro', name: 'Retro OS', desc: 'Draggable windows on a teal desktop.', themeColor: '#0f7b7b', experience: 'desktop', fonts: 'family=Silkscreen:wght@400;700' },
] as const satisfies readonly StyleDef[];

export const LAYOUTS = [
  { id: 'linear', name: 'One-page linear', desc: 'Every section in one vertical strip.' },
  { id: 'bento', name: 'Bento grid', desc: 'Varied tiles, like a lunchbox.' },
  { id: 'cards', name: 'Card grid', desc: 'Uniform modular cards.' },
  { id: 'masonry', name: 'Masonry', desc: 'Staggered columns, no fixed rows.' },
  { id: 'split', name: 'Split screen', desc: 'Two halves, side by side.' },
  { id: 'zpattern', name: 'Z-pattern', desc: 'Left, diagonal, right. Repeat.' },
  { id: 'fpattern', name: 'F-pattern', desc: 'Strong top bar, skimmable left edge.' },
  { id: 'gutenberg', name: 'Gutenberg', desc: 'Four zones, ending bottom-right.' },
  { id: 'asymmetric', name: 'Asymmetric', desc: 'Uneven columns and weights.' },
  { id: 'fullhero', name: 'Full-screen hero', desc: 'Media fills the first screen.' },
  { id: 'centered', name: 'Centred headline', desc: 'One big sentence, dead centre.' },
  { id: 'horizontal', name: 'Horizontal scroll', desc: 'The wheel moves you sideways.' },
  { id: 'infinite', name: 'Infinite scroll', desc: 'Content keeps arriving, no footer.' },
  { id: 'dashboard', name: 'Fixed dashboard', desc: 'One screen of live widgets.' },
] as const satisfies readonly AxisDef[];

export const NAVS = [
  { id: 'sticky', name: 'Sticky header', desc: 'The menu bar stays on top.' },
  { id: 'hamburger', name: 'Hamburger overlay', desc: 'A full-screen menu behind three lines.' },
  { id: 'mega', name: 'Mega-menu', desc: 'A multi-column panel of everything.' },
  { id: 'sidebar', name: 'Sidebar dock', desc: 'A fixed full-height side panel.' },
  { id: 'radial', name: 'Radial menu', desc: 'Links fan out in a circle.' },
  { id: 'breadcrumb', name: 'Breadcrumbs', desc: 'A trail showing where you are.' },
  { id: 'parallax', name: 'Parallax', desc: 'Layers drift at different speeds.' },
  { id: 'scrolly', name: 'Scrollytelling', desc: 'A sticky graphic builds as you scroll.' },
] as const satisfies readonly AxisDef[];

export type StyleId = (typeof STYLES)[number]['id'];
export type LayoutId = (typeof LAYOUTS)[number]['id'];
export type NavId = (typeof NAVS)[number]['id'];
export type Design = { style: StyleId; layout: LayoutId; nav: NavId };
export type Axis = keyof Design;

export const DEFAULT_DESIGN: Design = { style: 'glass', layout: 'linear', nav: 'sticky' };

export const AXES = { style: STYLES, layout: LAYOUTS, nav: NAVS } as const;

export const getStyle = (id: StyleId): StyleDef => STYLES.find((s) => s.id === id) ?? STYLES[0];
export const getLayout = (id: LayoutId): AxisDef => LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
export const getNav = (id: NavId): AxisDef => NAVS.find((n) => n.id === id) ?? NAVS[0];

export const isOn = <A extends Axis>(axis: A, v: unknown): v is Design[A] =>
  (AXES[axis] as readonly AxisDef[]).some((d) => d.id === v);

export const describe = (d: Design) => {
  const s = getStyle(d.style);
  return s.experience ? s.name : `${s.name} · ${getLayout(d.layout).name} · ${getNav(d.nav).name}`;
};
