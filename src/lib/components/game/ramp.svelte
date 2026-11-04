<script lang="ts">
	import { T } from '@threlte/core';
	import Block from './block.svelte';

	type Vec3 = [number, number, number];

	// Straight ramp whose low edge sits at `position`; it rises toward local -z.
	let {
		position = [0, 0, 0] as Vec3,
		rotationY = 0,
		run = 6,
		height = 1.5,
		width = 4,
		color = '#f59e0b'
	}: {
		position?: Vec3;
		rotationY?: number;
		run?: number;
		height?: number;
		width?: number;
		color?: string;
	} = $props();

	const t = 0.3;
	const angle = $derived(Math.atan2(height, run));
	const length = $derived(Math.hypot(run, height));
	// Offset the box so its top face is the slope surface.
	const center = $derived<Vec3>([
		0,
		height / 2 - (t / 2) * Math.cos(angle),
		-run / 2 - (t / 2) * Math.sin(angle)
	]);
</script>

<T.Group {position} rotation.y={rotationY}>
	<Block position={center} rotation={[angle, 0, 0]} size={[width, t, length]} {color} />
</T.Group>
