# Portfolio

A personal portfolio site built with SvelteKit, with interactive 3D pages powered by Threlte (Three.js for Svelte) and Rapier physics.

## Pages

| Route         | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Homepage                                                                    |
| `/playground` | 3D scene with a live Tweakpane panel to adjust lights and the sphere color |
| `/game`       | Physics mini-game: roll a ball around a track with ramps and quarter pipes  |
| `/posts`      | Posts (placeholder)                                                         |
| `/projects`   | Projects (placeholder)                                                      |
| `/resume`     | Resume (placeholder)                                                        |

### Game controls

- **Click**: capture the mouse (pointer lock) · **Esc**: release it
- **ZQSD / WASD / arrow keys**: roll
- **Space**: jump
- **R**: respawn
- **Mouse wheel**: zoom

The `/game` route turns off SSR (`src/routes/game/+page.ts`) because Rapier (WASM) and pointer lock only work in the browser.

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

`npm run build` writes a Node server to `build/`. Start it with:

```bash
node build
```

You can set `PORT` and `HOST` as environment variables. See the [adapter-node docs](https://svelte.dev/docs/kit/adapter-node).
