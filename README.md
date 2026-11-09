# Portfolio

A personal portfolio site built with SvelteKit, with interactive 3D pages powered by Threlte (Three.js for Svelte) and Rapier physics.

## Pages

| Route               | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `/`                 | Homepage with the main menu                                              |
| `/playground`       | 3D city: walk or skate to the projects and hobbies, click to open them  |
| `/work`             | Professional experiences and their games, articles at `/work/[slug]`    |
| `/projects`         | Student and personal projects, articles at `/projects/[slug]`           |
| `/hobbies`          | Hobby cards, each with an article page at `/hobbies/[slug]`             |
| `/resume`           | Experience, education, skills, contact and the CV (`static/cv/`)        |
| `/editor`           | Level editor for the playground map (dev server only)                   |
| `/awale/awale.html` | The AR Awale game (static, A-Frame)                                      |

Work, projects and hobbies live in `src/lib/content.ts`. The city is a park with the spawn plaza in the middle and one octagonal esplanade per section around it. Its layout lives in `src/lib/level.json`: spawn, esplanades, the place of every spot, and the objects (ramps, quarter pipes, blocks, trees, bushes). Lamps, signs and paths follow their esplanade. A new spot that is not in `level.json` yet goes on a ring around its esplanade.

### English / French

The site is in English and French, switched with the EN | FR button in the menu bar. Pages are prerendered in English; in the browser the language comes from `?lang=fr` / `?lang=en` in the URL, then the visitor's last choice, then the browser language.

- UI text is written inline with `t('English', 'Français')` from `src/lib/i18n.svelte.ts`.
- French versions of the projects, hobbies, work and experiences are in `src/lib/content.fr.ts`, by slug; a missing field falls back to English.
- CV PDFs are `static/cv/Baptiste_David_CV_EN.pdf` and `…_FR.pdf`; the resume page offers the one of the current language.

### Level editor

Run `npm run dev` and open `/editor`: a top-down view of the map.

- **Drag** an element to move it (snapped to 0.5 m, hold **Alt** for 0.1 m). Dragging an esplanade carries its spots along. Drag the background to pan, use the wheel to zoom.
- **R / Shift+R**: rotate by 15°. **Del**: delete. **Ctrl+D**: duplicate. **Ctrl+Z**: undo.
- The side panel edits the selection's fields (position, size, color…) and adds new objects.
- **Save** (or **Ctrl+S**) writes `src/lib/level.json`; an open `/playground` tab reloads by itself. Commit the file like any other code.

The editor and its save endpoint return 404 in production.

### Playground controls

Keyboard and mouse:

- **Click**: capture the mouse (pointer lock) · **Esc**: release it · **Mouse wheel**: zoom
- **ZQSD / WASD / arrow keys**: move · **Shift**: get on / off the skateboard
- **Space**: jump; again in the air on the board: trick
- **R**: respawn · **Left click** next to a glowing marker: open it

Phones and tablets (`pointer: coarse`) get touch controls instead:

- **Joystick** (bottom left): a small push (inside the dashed ring, 30 %) walks, faster as you push; a bigger push gets on the skateboard
- **Swipe** on the scene to turn the camera
- **⤒**: jump / trick · **↺**: respawn · **Open ▶** appears next to a marker

The tuning (speeds, joystick thresholds, tricks) is at the top of `src/lib/components/game/player.svelte`. The `/playground` route turns off SSR (`src/routes/playground/+page.ts`) because Rapier (WASM) and pointer lock only work in the browser.

## Tech stack

- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes), TypeScript
- [Threlte](https://threlte.xyz) (`@threlte/core`, `@threlte/extras`, `@threlte/rapier`) on top of [Three.js](https://threejs.org)
- [Rapier](https://rapier.rs) (`@dimforge/rapier3d-compat`) for physics
- [svelte-tweakpane-ui](https://kitschpatrol.com/svelte-tweakpane-ui) for the playground controls
- [Tailwind CSS 3](https://tailwindcss.com) with [shadcn-svelte](https://shadcn-svelte.com) components (built on bits-ui)
- [mdsvex](https://mdsvex.pngwn.io) for `.svx` (Markdown in Svelte) files
- `@sveltejs/adapter-node` for deployment

## Getting started

You need Node.js (developed on v22) and npm. `.npmrc` sets `engine-strict=true`.

```bash
npm install
npm run dev          # start the dev server
npm run dev -- --open  # same, and open it in the browser
```

## Scripts

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                       |
| `npm run build`   | Build for production (Node server in `build/`)  |
| `npm run preview` | Preview the production build                    |
| `npm run check`   | Type-check with `svelte-check`                  |
| `npm run lint`    | Check formatting with Prettier and run ESLint   |
| `npm run format`  | Format everything with Prettier                 |

## Project structure

```
src/
├── app.css, app.html        # global styles and HTML shell
├── lib/
│   ├── components/
│   │   ├── menubar.svelte   # top navigation (dropdown menu on mobile)
│   │   ├── scene.svelte     # playground 3D scene (camera, lights, sphere, floor)
│   │   ├── game/            # game pieces: ball, track, block, ramp, quarter-pipe
│   │   └── ui/              # shadcn-svelte components (button, card, menus)
│   └── utils.ts             # `cn()` class-name helper
└── routes/                  # one folder per page (see the table above)
```

Import paths: `$lib/...` (SvelteKit's default) and `@/...` both point to `src/lib/`. The `@/` alias is set in `svelte.config.js`.

### Adding to the game track

The track is made of reusable pieces in `src/lib/components/game/`:

- `block.svelte`: a static box with a matching collider (`position`, `rotation`, `size`, `color`)
- `ramp.svelte`: a straight ramp rising along local −z (`run`, `height`, `width`, `rotationY`)
- `quarter-pipe.svelte`: a curved transition from flat to vertical (`radius`, `width`, `segments`, `rotationY`)

To add obstacles, place these pieces in `track.svelte`. The ball's handling (torque, air control, jump speed) is set by the constants at the top of `ball.svelte`.

## Deployment

The site is a static export (`@sveltejs/adapter-static`): `npm run build` prerenders every page as `<route>/index.html` in `build/`, so any static host works without rewrites. `/editor` is left out (dev only).

It is hosted on `davidb.iiens.net`. `npm run deploy` builds it and assembles `deploy/`:

- the new site at the root, plus an `index.php` that serves `index.html` (the host runs PHP);
- the previous site in `/oldsite/`, copied from `../site-baptiste` (or `$OLD_SITE`);
- `/portfolio/article_*.html` redirects from the previous site's article URLs to the new pages.

```bash
npm run deploy                                    # build deploy/ only, to check it
npm run deploy -- ARISEID@perso3.iiens.net:html  # build it and upload it into ~/html
```

`scp` adds and overwrites files but never deletes, so files removed from the site stay on the server until you delete them there.
