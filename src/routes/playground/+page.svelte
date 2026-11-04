<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import { NoToneMapping, WebGLRenderer } from 'three';
	import City from '$lib/components/game/city.svelte';
	import Player from '$lib/components/game/player.svelte';
	import { game } from '$lib/components/game/state.svelte';
	import { projects } from '$lib/projects';

	const open = $derived(projects.find((p) => p.slug === game.openSlug));

	// No antialiasing + half resolution + pixelated upscale = handheld 2010s look.
	const createRenderer = (canvas: HTMLCanvasElement) =>
		new WebGLRenderer({ canvas, antialias: false });
</script>

<svelte:window onkeydown={(e) => e.code === 'Escape' && (game.openSlug = null)} />

<div class="game relative h-[calc(100vh-5.5rem)] w-full select-none overflow-hidden">
	<Canvas dpr={0.5} toneMapping={NoToneMapping} {createRenderer}>
		<World gravity={[0, -20, 0]}>
			<City />
			<Player spawn={[0, 1, 12]} />
		</World>
	</Canvas>

	<div
		class="pointer-events-none absolute left-4 top-4 rounded-md bg-black/50 px-3 py-2 text-sm text-white"
	>
		<p>Click to grab the mouse · Esc to release</p>
		<p>
			ZQSD / WASD: move · Space: jump · Shift: {game.skating ? 'get off' : 'get on'} the skateboard
		</p>
		<p>Walk up to the glowing markers and left click to open a project</p>
	</div>

	{#if open}
		<div class="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
			<div class="w-full max-w-md rounded-2xl border-4 border-sky-600 bg-white p-5 text-slate-800">
				<p class="text-xs font-bold uppercase tracking-wide text-sky-600">{open.poi.label}</p>
				<h2 class="text-2xl font-extrabold">{open.title}</h2>
				<div class="mt-2 flex flex-wrap gap-1">
					{#each open.tags as tag (tag)}
						<span class="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800">{tag}</span>
					{/each}
				</div>
				<p class="mt-3">{open.summary}</p>
				<div class="mt-5 flex justify-end gap-2">
					<button
						class="rounded-lg px-4 py-2 hover:bg-slate-100"
						onclick={() => (game.openSlug = null)}
					>
						Back to the city
					</button>
					<a
						class="rounded-lg bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700"
						href={open.url}
						target="_blank"
						rel="noopener"
					>
						Open project ↗
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.game :global(canvas) {
		image-rendering: pixelated;
	}
</style>
