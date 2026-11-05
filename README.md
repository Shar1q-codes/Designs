# Shape-shifting portfolio: Syed Shariq Hussain

One portfolio that rebuilds itself into any design. A visitor opens the **Designs** menu (or presses `D`) and mixes three independent choices:

| Axis | Count | What it changes |
| --- | --- | --- |
| **Style** | 20 + 4 experiences | Colour, type, surfaces, shadows, effects |
| **Layout** | 14 | How the sections are arranged |
| **Navigation** | 8 | How you move around the page |

Every combination has its own shareable link, e.g. `?style=cyberpunk&layout=bento&nav=radial`.

The four **experiences** replace layout and navigation entirely:
**Terminal** (a working shell), **Retro OS** (draggable windows), **Game World** (a playable level) and **Video Editor** (the site as an edit timeline).

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Built with Vite, React 18, TypeScript, Three.js (`@react-three/fiber`, glass style only, lazy-loaded) and Motion.

## Edit your content

All text lives in [src/content.ts](src/content.ts). Every design reads from it, so one edit updates all of them.
Values marked `EDIT` are stand-ins (email, social links, course year, exact tools) waiting for your real details.

## Add a design

**A new style**

1. Add an entry to `STYLES` in [src/designs.ts](src/designs.ts): `id`, `name`, `desc`, `themeColor`, optional Google `fonts`, optional `scene`.
2. Create `src/styles/styles/<id>.css`. It is loaded automatically.
   - Set tokens on `[data-style="<id>"]` (`--bg`, `--fg`, `--accent`, `--surface`, `--line`, `--shadow`, `--radius`, `--font-display`, …). Tokens there also drive the menu's preview tile.
   - Put page-only details under `html[data-style="<id>"] …`.

**A new layout**

1. Add an entry to `LAYOUTS` in `designs.ts`.
2. Add its rules to [src/styles/layouts.css](src/styles/layouts.css) under `html[data-layout="<id>"]`, and a schematic in [src/styles/menu.css](src/styles/menu.css) (`.pv-layout-<id>`).

**A new navigation pattern**

1. Add an entry to `NAVS` in `designs.ts`.
2. Add a component in [src/components/nav/](src/components/nav/), wire it into the `nav` map in [src/layouts/FlowLayout.tsx](src/layouts/FlowLayout.tsx), and style it in [src/styles/nav.css](src/styles/nav.css).

**A new experience**: add a style with `experience: '<name>'`, a layout component in `src/layouts/`, a branch in [src/App.tsx](src/App.tsx) and a CSS file in `src/styles/experiences/`.

## Responsive targets

Every design is checked at these viewports (CSS pixels):

| Group | Sizes |
| --- | --- |
| Phones | 280×653 (folded), 320×568, 360×780, 375×667, 390×844, 414×896, 440×956 |
| Landscape phones | 667×375, 844×390, 956×440 |
| Foldables and tablets | 984×1092, 768×1024, 820×1180, 1024×1366, 1180×820 |
| Laptops and desktops | 1280×720, 1366×768, 1536×864, 1920×1080, 2560×1440 |

## Accessibility and motion

- Every design is keyboard reachable.
- A **Pause motion** button stops every animation.
- The system *reduced motion* setting is respected.
- The game has a level-select list and the terminal has clickable commands, so neither depends on typing or playing.
