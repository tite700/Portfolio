<script lang="ts">
	import { T } from '@threlte/core';

	type Vec3 = [number, number, number];

	// Visual-only box (no collider), the building brick of every low-poly model.
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
</script>

<T.Mesh {position} {rotation} castShadow={opacity === 1} receiveShadow>
	<T.BoxGeometry args={size} />
	{#if emissive}
		<T.MeshBasicMaterial {color} transparent={opacity < 1} {opacity} />
	{:else}
		<T.MeshLambertMaterial {color} transparent={opacity < 1} {opacity} />
	{/if}
</T.Mesh>
