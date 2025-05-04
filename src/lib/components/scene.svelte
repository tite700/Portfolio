<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, Gizmo } from '@threlte/extras';
	import * as THREE from 'three';

	let { light, ambient, sphere } = $props();
</script>

<!-- GEOMETRY -->

<T.PerspectiveCamera makeDefault position={[5, 8, 10]}>
	<OrbitControls />
	<Gizmo />
</T.PerspectiveCamera>

<T.DirectionalLight position={[light.x, light.y, light.z]} intensity={light.intensity} />

<T.AmbientLight color={ambient.color} intensity={0.4} />

<T.Mesh position={[0, 0.5, 0]} castShadow>
	<T.SphereGeometry args={[2, 32, 32]} />
	<T.MeshStandardMaterial color={sphere.color} roughness={0.4} metalness={0.3} />
</T.Mesh>

<T.Mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
	<T.PlaneGeometry args={[30, 30]} />
	<T.MeshStandardMaterial color="lightgrey" roughness={1} metalness={0} side={THREE.DoubleSide} />
</T.Mesh>
