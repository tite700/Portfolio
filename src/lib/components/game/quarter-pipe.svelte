<script lang="ts">
	import { T } from '@threlte/core';
	import Block from './block.svelte';

	type Vec3 = [number, number, number];

	// Curved transition starting flat at `position` and curving up to vertical toward local -z.
	let {
		position = [0, 0, 0] as Vec3,
		rotationY = 0,
		radius = 4,
		width = 8,
		segments = 12,
		color = '#38bdf8'
	}: {
		position?: Vec3;
		rotationY?: number;
		radius?: number;
		width?: number;
		segments?: number;
		color?: string;
	} = $props();

	const t = 0.3;

	// Approximate the arc with thin boxes; each top face is a chord of the circle.
	const pieces = $derived(
		Array.from({ length: segments }, (_, i) => {
			const a0 = (i / segments) * (Math.PI / 2);
			const a1 = ((i + 1) / segments) * (Math.PI / 2);
			const am = (a0 + a1) / 2;
			const z0 = -radius * Math.sin(a0);
			const y0 = radius - radius * Math.cos(a0);
			const z1 = -radius * Math.sin(a1);
			const y1 = radius - radius * Math.cos(a1);
			const length = Math.hypot(z1 - z0, y1 - y0) + 0.02; // tiny overlap hides seams
			return {
				position: [
					0,
					(y0 + y1) / 2 - (t / 2) * Math.cos(am),
					(z0 + z1) / 2 - (t / 2) * Math.sin(am)
				] as Vec3,
				rotation: [am, 0, 0] as Vec3,
				length
			};
		})
	);
</script>

<T.Group {position} rotation.y={rotationY}>
	{#each pieces as p, i (i)}
		<Block position={p.position} rotation={p.rotation} size={[width, t, p.length]} {color} />
	{/each}
	<!-- Coping / deck on top -->
	<Block position={[0, radius - 0.15, -radius - 1.5]} size={[width, 0.3, 3]} color="#64748b" />
</T.Group>
