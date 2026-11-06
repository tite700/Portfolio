import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

// The level editor only exists on the dev server: it writes src/lib/level.json.
export const load = () => {
	if (!dev) error(404, 'Not found');
};
