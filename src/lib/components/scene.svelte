<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, Gizmo } from '@threlte/extras';
	import * as THREE from 'three';
</script>

<T.PerspectiveCamera makeDefault position={[5, 8, 10]}>
	<OrbitControls />
	<Gizmo />
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 15, 10]} intensity={1.2} castShadow />

<T.AmbientLight intensity={0.4} />

<T.Mesh position={[0, 1, 0]} castShadow>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="tomato" roughness={0.4} metalness={0.3} />
</T.Mesh>

<T.Mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
	<T.PlaneGeometry args={[30, 30]} />
	<T.MeshStandardMaterial color="lightgrey" roughness={1} metalness={0} side={THREE.DoubleSide} />
</T.Mesh>
