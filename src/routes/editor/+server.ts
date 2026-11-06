import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { writeFileSync } from 'node:fs';

// Saves the editor's level into the source code (dev server only).
export const POST = async ({ request }) => {
	if (!dev) error(404, 'Not found');
	const level = await request.json();
	if (!level?.spawn || !level.esplanades || !level.spots || !Array.isArray(level.objects)) {
		error(400, 'Invalid level');
	}
	const round = (_: string, v: unknown) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v);
	writeFileSync('src/lib/level.json', JSON.stringify(level, round, '\t') + '\n');
	return json({ ok: true });
};
