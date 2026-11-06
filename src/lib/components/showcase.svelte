<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { NoToneMapping, WebGLRenderer } from 'three';
	import type { Spot } from '$lib/content';
	import Model from './game/model.svelte';

	// A spot's model turning on a hexagonal pedestal, rendered like the city (low-res, pixelated).
	let { spot }: { spot: Spot } = $props();

	const { kind, size } = spot.poi;
	const radius = Math.hypot(...size) / 2;
	const distance = radius * 3.2 + 1;
	const base = Math.max(size[0], size[2]) * 0.6 + 0.6;
	const createRenderer = (canvas: HTMLCanvasElement) =>
		new WebGLRenderer({ canvas, antialias: false });
</script>

<div class="showcase h-full w-full">
	<Canvas dpr={0.75} toneMapping={NoToneMapping} {createRenderer}>
		<T.Color attach="background" args={['#9fd8ff']} />
		<T.HemisphereLight args={['#ffffff', '#8a9a7a', 1.4]} />
		<T.DirectionalLight
			position={[6, 12, 8]}
			intensity={2}
			castShadow
			shadow.camera.left={-6}
			shadow.camera.right={6}
			shadow.camera.top={6}
			shadow.camera.bottom={-6}
		/>

		<T.PerspectiveCamera
			makeDefault
			fov={35}
			position={[distance * 0.6, size[1] / 2 + distance * 0.35, distance * 0.75]}
		>
			<OrbitControls
				target={[0, size[1] / 2, 0]}
				autoRotate
				autoRotateSpeed={1.5}
				enableDamping
				enableZoom={false}
				enablePan={false}
			/>
		</T.PerspectiveCamera>

		<Model {kind} />

		<!-- Two-tier hexagonal pedestal -->
		<T.Mesh position.y={-0.2} receiveShadow>
			<T.CylinderGeometry args={[base, base, 0.4, 6]} />
			<T.MeshLambertMaterial color="#86c06c" flatShading />
		</T.Mesh>
		<T.Mesh position.y={-0.6} receiveShadow>
			<T.CylinderGeometry args={[base + 0.4, base + 0.6, 0.4, 6]} />
			<T.MeshLambertMaterial color="#78716c" flatShading />
		</T.Mesh>
	</Canvas>
</div>

<style>
	.showcase :global(canvas) {
		image-rendering: pixelated;
	}
</style>
