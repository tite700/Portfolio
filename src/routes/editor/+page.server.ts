import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

// The level editor only exists on the dev server: it writes src/lib/level.json.
// It is not part of the static export.
export const prerender = false;

export const load = () => {
	if (!dev) error(404, 'Not found');
};
