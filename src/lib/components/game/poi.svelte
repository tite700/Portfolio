<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { RigidBody, Collider } from '@threlte/rapier';
	import type { Mesh } from 'three';
	import { sections, type Spot } from '$lib/content';
	import Model from './model.svelte';
	import { game } from './state.svelte';

	// An interactive spot in the city: its model, a floating marker and a tooltip.
	let { spot }: { spot: Spot } = $props();
	const { kind, label, position, rotationY = 0, size } = spot.poi;
	const near = $derived(game.nearSlug === spot.slug);

	let marker = $state<Mesh>();
	let time = 0;
	useTask((dt) => {
		time += dt;
		if (!marker) return;
		marker.rotation.y = time * 2;
		marker.position.y = size[1] + 0.8 + Math.sin(time * 3) * 0.15;
	});
</script>

<T.Group position={[position[0], size[1] / 2, position[2]]} rotation.y={rotationY}>
	<RigidBody type="fixed">
		<Collider shape="cuboid" args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
	</RigidBody>
</T.Group>

<T.Group {position} rotation.y={rotationY}>
	<Model {kind} />

	<!-- Floating marker -->
	<T.Mesh bind:ref={marker}>
		<T.OctahedronGeometry args={[0.3, 0]} />
		<T.MeshBasicMaterial color={near ? '#facc15' : sections[spot.section].color} />
	</T.Mesh>

	{#if near}
		<HTML position.y={size[1] + 1.6} center pointerEvents="none">
			<div class="panel w-64 px-3 py-2">
				<p class="text-xs font-bold uppercase tracking-wide text-sky-600">{label}</p>
				<p class="font-bold">{spot.title}</p>
				<p class="mt-1 text-xs">{spot.summary}</p>
				<p class="mt-2 text-right text-xs font-bold text-sky-600">Left click to open ▶</p>
			</div>
		</HTML>
	{/if}
</T.Group>
