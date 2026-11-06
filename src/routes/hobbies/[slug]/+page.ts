import { error } from '@sveltejs/kit';
import { hobbies } from '$lib/content';

export const load = ({ params }) => {
	const spot = hobbies.find((s) => s.slug === params.slug);
	if (!spot) error(404, 'Not found');
	return { spot };
};
