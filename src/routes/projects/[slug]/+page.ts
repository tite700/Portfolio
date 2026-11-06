import { error } from '@sveltejs/kit';
import { projects } from '$lib/content';

export const load = ({ params }) => {
	const spot = projects.find((s) => s.slug === params.slug);
	if (!spot) error(404, 'Not found');
	return { spot };
};
