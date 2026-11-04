<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { RigidBody, Collider } from '@threlte/rapier';
	import type { Mesh } from 'three';
	import type { Project } from '$lib/projects';
	import Box from './box.svelte';
	import Character from './character.svelte';
	import Tree from './tree.svelte';
	import { game } from './state.svelte';

	// An interactive spot in the city: a small model, a floating marker and a tooltip.
	let { project }: { project: Project } = $props();
	const { kind, label, position, rotationY = 0, size } = project.poi;
	const near = $derived(game.nearSlug === project.slug);

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
	{#if kind === 'gacha'}
		<Box size={[1, 1.1, 1]} position={[0, 0.55, 0]} color="#e63946" />
		<Box size={[0.4, 0.3, 0.05]} position={[0, 0.7, 0.51]} color="#e2e8f0" />
		<Box size={[0.6, 0.12, 0.6]} position={[0, 2.1, 0]} color="#e63946" />
		{#each ['#facc15', '#60a5fa', '#f472b6', '#4ade80'] as color, i (i)}
			<T.Mesh position={[(i % 2) * 0.3 - 0.15, 1.35 + (i > 1 ? 0.25 : 0), (i % 2) * 0.1]}>
				<T.SphereGeometry args={[0.16, 8, 6]} />
				<T.MeshLambertMaterial {color} />
			</T.Mesh>
		{/each}
		<T.Mesh position.y={1.55}>
			<T.SphereGeometry args={[0.55, 10, 8]} />
			<T.MeshLambertMaterial color="#bde0fe" transparent opacity={0.35} />
		</T.Mesh>
	{:else if kind === 'sakura'}
		<Tree scale={1.4} leaves="#f9a8d4" collider={false} />
	{:else if kind === 'statue'}
		<Box size={[2.4, 1.2, 2.4]} position={[0, 0.6, 0]} color="#78716c" />
		<T.Group position.y={1.2} scale={2.2}>
			<Character stone="#d6d3d1" />
		</T.Group>
	{:else if kind === 'arcade'}
		<Box size={[0.9, 1.9, 0.8]} position={[0, 0.95, 0]} color="#7c3aed" />
		<Box size={[0.7, 0.5, 0.05]} position={[0, 1.4, 0.41]} color="#22d3ee" emissive />
		<Box size={[0.9, 0.25, 0.85]} position={[0, 1.95, 0]} color="#f472b6" emissive />
		<Box size={[0.9, 0.1, 0.4]} position={[0, 1, 0.5]} rotation={[0.3, 0, 0]} color="#1e1b4b" />
	{:else if kind === 'targets'}
		{#each [-3, 3] as x (x)}
			<Box size={[0.15, 2.2, 0.15]} position={[x, 1.1, 0]} color="#92400e" />
		{/each}
		<Box size={[6.4, 0.15, 0.15]} position={[0, 2.1, 0]} color="#92400e" />
		{#each [-2, 0, 2] as x (x)}
			{#each [0.7, 0.5, 0.3, 0.12] as r, i (r)}
				<T.Mesh position={[x, 1.2, i * 0.02]} rotation.x={Math.PI / 2}>
					<T.CylinderGeometry args={[r, r, 0.05, 16]} />
					<T.MeshLambertMaterial color={i % 2 ? '#dc2626' : '#f8fafc'} />
				</T.Mesh>
			{/each}
		{/each}
	{:else if kind === 'portal'}
		<T.Mesh position.y={2.6}>
			<T.TorusGeometry args={[2, 0.3, 6, 16]} />
			<T.MeshBasicMaterial color="#dc2626" />
		</T.Mesh>
		<T.Mesh position.y={2.6}>
			<T.CircleGeometry args={[1.75, 16]} />
			<T.MeshBasicMaterial color="#7f1d1d" transparent opacity={0.7} side={2} />
		</T.Mesh>
	{:else if kind === 'hand'}
		<!-- A "V" sign -->
		<Box size={[2, 1, 2]} position={[0, 0.5, 0]} color="#78716c" />
		<Box size={[1.2, 1.4, 0.4]} position={[0, 1.7, 0]} color="#d97706" />
		<Box
			size={[0.28, 1.2, 0.3]}
			position={[-0.2, 2.9, 0]}
			rotation={[0, 0, 0.15]}
			color="#d97706"
		/>
		<Box
			size={[0.28, 1.2, 0.3]}
			position={[0.2, 2.9, 0]}
			rotation={[0, 0, -0.15]}
			color="#d97706"
		/>
		<Box size={[0.6, 0.35, 0.35]} position={[0.3, 2.45, 0.1]} color="#d97706" />
		<Box
			size={[0.28, 0.8, 0.3]}
			position={[-0.75, 1.9, 0.05]}
			rotation={[0, 0, 0.6]}
			color="#d97706"
		/>
	{:else if kind === 'toaster'}
		<Box size={[3.2, 2, 2]} position={[0, 1, 0]} color="#cbd5e1" />
		{#each [-0.45, 0.45] as z (z)}
			<Box size={[1.3, 0.9, 0.22]} position={[0, 2.2, z]} color="#e9c46a" />
		{/each}
		<!-- Cat face -->
		{#each [-1.1, 1.1] as x (x)}
			<Box
				size={[0.5, 0.5, 0.2]}
				position={[x, 2.2, 0.7]}
				rotation={[0, 0, Math.PI / 4]}
				color="#94a3b8"
			/>
			<Box size={[0.2, 0.3, 0.02]} position={[x * 0.4, 1.2, 1.01]} color="#111111" />
		{/each}
		<Box size={[0.2, 0.12, 0.02]} position={[0, 0.95, 1.01]} color="#f472b6" />
	{/if}

	<!-- Floating marker -->
	<T.Mesh bind:ref={marker}>
		<T.OctahedronGeometry args={[0.3, 0]} />
		<T.MeshBasicMaterial color={near ? '#facc15' : '#38bdf8'} />
	</T.Mesh>

	{#if near}
		<HTML position.y={size[1] + 1.6} center pointerEvents="none">
			<div
				class="w-64 rounded-xl border-4 border-sky-600 bg-white/95 px-3 py-2 text-slate-800 shadow-lg"
			>
				<p class="text-xs font-bold uppercase tracking-wide text-sky-600">{label}</p>
				<p class="font-bold">{project.title}</p>
				<p class="mt-1 text-xs">{project.summary}</p>
				<p class="mt-2 text-right text-xs font-bold text-sky-600">Left click to open ▶</p>
			</div>
		</HTML>
	{/if}
</T.Group>
