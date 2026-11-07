<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import { NoToneMapping, WebGLRenderer } from 'three';
	import City from '$lib/components/game/city.svelte';
	import Player from '$lib/components/game/player.svelte';
	import Minimap from '$lib/components/minimap.svelte';
	import { game } from '$lib/components/game/state.svelte';
	import { SPAWN, href, spots } from '$lib/content';
	import { t, tr } from '$lib/i18n.svelte';

	const found = $derived(spots.find((s) => s.slug === game.openSlug));
	const open = $derived(found && tr(found));

	// No antialiasing + half resolution + pixelated upscale = handheld 2010s look.
	const createRenderer = (canvas: HTMLCanvasElement) =>
		new WebGLRenderer({ canvas, antialias: false });
</script>

<svelte:window onkeydown={(e) => e.code === 'Escape' && (game.openSlug = null)} />

<div class="game relative h-[calc(100vh-5.5rem)] w-full select-none overflow-hidden">
	<Canvas dpr={0.5} toneMapping={NoToneMapping} {createRenderer}>
		<World gravity={[0, -20, 0]}>
			<City />
			<Player spawn={SPAWN} />
		</World>
	</Canvas>

	<div class="absolute right-4 top-4"><Minimap /></div>

	{#if game.trick}
		{#key game.trick.id}
			<p
				class="trick pointer-events-none absolute inset-x-0 top-1/4 text-center font-display text-5xl font-bold text-yellow-300"
			>
				{game.trick.name}!
				{#if game.trick.combo > 1}<span class="text-3xl">×{game.trick.combo}</span>{/if}
			</p>
		{/key}
	{/if}

	<div
		class="pointer-events-none absolute left-4 top-4 rounded-md bg-black/50 px-3 py-2 text-sm text-white"
	>
		<p>
			{t(
				'Click to grab the mouse · Esc to release · R: respawn',
				'Clic pour capturer la souris · Échap pour la libérer · R : réapparaître'
			)}
		</p>
		<p>
			{t('ZQSD / WASD: move', 'ZQSD / WASD : se déplacer')} ·
			{t(
				'Space: jump (again in the air on the board: trick)',
				'Espace : sauter (encore en l’air sur la planche : figure)'
			)} ·
			{game.skating
				? t('Shift: get off the skateboard', 'Maj : descendre du skate')
				: t('Shift: get on the skateboard', 'Maj : monter sur le skate')}
		</p>
		<p>
			{t(
				'Walk up to the glowing markers and left click to open them',
				'Approchez-vous des marqueurs lumineux et faites un clic gauche pour les ouvrir'
			)}
		</p>
	</div>

	{#if open}
		<div class="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
			<div class="panel w-full max-w-md p-5">
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
						{t('Back to the city', 'Retour à la ville')}
					</button>
					<a class="btn-game" href={href(open)} onclick={() => (game.openSlug = null)}
						>{t('Read more ▶', 'Lire la suite ▶')}</a
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.game :global(canvas) {
		image-rendering: pixelated;
	}
	/* Trick popup: pops in, holds, floats away. */
	.trick {
		text-shadow: 3px 3px 0 #0c4a6e;
		animation: trick-pop 1.2s ease-out forwards;
	}
	@keyframes trick-pop {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		15% {
			opacity: 1;
			transform: scale(1.15);
		}
		30%,
		75% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-1.5rem) scale(1);
		}
	}
</style>
