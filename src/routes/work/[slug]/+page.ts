import { error } from '@sveltejs/kit';
import { work } from '$lib/content';

export const load = ({ params }) => {
	const spot = work.find((s) => s.slug === params.slug);
	if (!spot) error(404, 'Not found');
	return { spot };
};
