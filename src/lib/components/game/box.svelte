<script lang="ts">
	import { T } from '@threlte/core';
	import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

	type Vec3 = [number, number, number];

	// Visual-only box (no collider), the building brick of every model.
	// Slightly bevelled edges catch the light like a 2010s console model.
	let {
		size = [1, 1, 1] as Vec3,
		position = [0, 0, 0] as Vec3,
		rotation = [0, 0, 0] as Vec3,
		color = '#ffffff',
		emissive = false,
		opacity = 1
	}: {
		size?: Vec3;
		position?: Vec3;
		rotation?: Vec3;
		color?: string;
		emissive?: boolean;
		opacity?: number;
	} = $props();

	const bevel = $derived(Math.min(0.06, Math.min(...size) * 0.25));
</script>

<T.Mesh {position} {rotation} castShadow={opacity === 1} receiveShadow>
	<T is={RoundedBoxGeometry} args={[...size, 2, bevel]} />
	{#if emissive}
		<T.MeshBasicMaterial {color} transparent={opacity < 1} {opacity} />
	{:else}
		<T.MeshLambertMaterial {color} transparent={opacity < 1} {opacity} />
	{/if}
</T.Mesh>
