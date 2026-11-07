<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';
	import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
	import { sections, type Section, type Vec3 } from '$lib/content';
	import { sectionTitle } from '$lib/i18n.svelte';
	import Box from './box.svelte';

	// District sign: a colored board on two posts, the section name written on both faces.
	let { position, rotationY, section }: { position: Vec3; rotationY: number; section: Section } =
		$props();

	const { color } = sections[section];

	// Redrawn when the language changes.
	function draw(title: string) {
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 32;
		const g = canvas.getContext('2d')!;
		g.fillStyle = color;
		g.fillRect(0, 0, 128, 32);
		g.fillStyle = '#ffffff';
		g.font = 'bold 20px Fredoka, sans-serif';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillText(title.toUpperCase(), 64, 17, 120);
		const map = new CanvasTexture(canvas);
		map.magFilter = NearestFilter;
		map.colorSpace = SRGBColorSpace;
		return map;
	}
	const map = $derived(draw(sectionTitle(section)));
	$effect(() => {
		const current = map;
		return () => current.dispose();
	});
</script>

<T.Group {position} rotation.y={rotationY}>
	<T.Group position.y={1.6}>
		<RigidBody type="fixed">
			<Collider shape="cuboid" args={[2.2, 1.6, 0.15]} />
		</RigidBody>
	</T.Group>
	{#each [-1.9, 1.9] as x (x)}
		<Box size={[0.15, 3.2, 0.15]} position={[x, 1.6, 0]} color="#334155" />
	{/each}
	<Box size={[4.2, 1.2, 0.12]} position={[0, 2.5, 0]} color="#1e293b" />
	{#each [0, Math.PI] as r (r)}
		<T.Mesh position={[0, 2.5, r ? -0.07 : 0.07]} rotation.y={r}>
			<T.PlaneGeometry args={[4, 1]} />
			<T.MeshBasicMaterial {map} />
		</T.Mesh>
	{/each}
</T.Group>
