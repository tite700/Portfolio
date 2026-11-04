<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';

	type Vec3 = [number, number, number];

	let {
		position = [0, 0, 0] as Vec3,
		rotation = [0, 0, 0] as Vec3,
		size = [1, 1, 1] as Vec3,
		color = '#cbd5e1'
	}: { position?: Vec3; rotation?: Vec3; size?: Vec3; color?: string } = $props();
</script>

<!-- Static box with a matching collider. -->
<T.Group {position} {rotation}>
	<RigidBody type="fixed">
		<Collider shape="cuboid" args={[size[0] / 2, size[1] / 2, size[2] / 2]} friction={0.9} />
		<T.Mesh castShadow receiveShadow>
			<T.BoxGeometry args={size} />
			<T.MeshLambertMaterial {color} />
		</T.Mesh>
	</RigidBody>
</T.Group>
