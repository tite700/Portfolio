import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex()],

  kit: {
    // Static export; strict: false skips /editor, which only runs on the dev server.
    adapter: adapter({ strict: false }),
    alias: {
      '@/*': './src/lib/*'
    }
  },

  extensions: ['.svelte', '.svx']
};

export default config;
