<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';

	type Vec3 = [number, number, number];

	let {
		position = [0, 0, 0] as Vec3,
		scale = 1,
		leaves = '#4ade80',
		collider = true
	}: { position?: Vec3; scale?: number; leaves?: string; collider?: boolean } = $props();

	const blobs: [Vec3, number][] = [
		[[0, 3.6, 0], 1.6],
		[[1.2, 3.2, 0.4], 1.2],
		[[-1.1, 3.3, -0.3], 1.2],
		[[0.2, 3.4, -1.1], 1.1],
		[[-0.3, 4.4, 0.5], 1]
	];
</script>

{#if collider}
	<T.Group position={[position[0], 1.5 * scale, position[2]]}>
		<RigidBody type="fixed">
			<Collider shape="cylinder" args={[1.5 * scale, 0.4 * scale]} />
		</RigidBody>
	</T.Group>
{/if}

<T.Group {position} {scale}>
	<T.Mesh position.y={1.5} castShadow>
		<T.CylinderGeometry args={[0.3, 0.4, 3, 6]} />
		<T.MeshLambertMaterial color="#6b4226" />
	</T.Mesh>
	{#each blobs as [p, r], i (i)}
		<T.Mesh position={p} castShadow>
			<T.IcosahedronGeometry args={[r, 0]} />
			<T.MeshLambertMaterial color={leaves} flatShading />
		</T.Mesh>
	{/each}
</T.Group>
