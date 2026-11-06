<script lang="ts">
	import { browser } from '$app/environment';
	import { href, sections, type Spot } from '$lib/content';
	import Showcase from './showcase.svelte';

	// Article page of a project or hobby; `list` is its section, for the back and prev/next links.
	let { spot, list }: { spot: Spot; list: Spot[] } = $props();

	const i = $derived(list.findIndex((s) => s.slug === spot.slug));
	const prev = $derived(list[(i - 1 + list.length) % list.length]);
	const next = $derived(list[(i + 1) % list.length]);
	const section = $derived(sections[spot.section].title);
	const external = (url: string) => url.startsWith('http');
</script>

<svelte:head><title>{spot.title} · Baptiste David</title></svelte:head>

<article class="mx-auto max-w-6xl space-y-6 px-5 pb-16 pt-6">
	<a href="/{spot.section}" class="btn-game">◀ {section}</a>

	<div class="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
		<div class="panel flex flex-col justify-center p-6">
			<p class="text-sm font-bold uppercase tracking-wide text-sky-600">{spot.poi.label}</p>
			<h1 class="mt-1 font-display text-4xl font-bold text-sky-950 lg:text-5xl">{spot.title}</h1>
			<div class="mt-3 flex flex-wrap gap-1">
				{#each spot.tags as tag (tag)}
					<span class="chip">{tag}</span>
				{/each}
			</div>
			<p class="mt-4 text-lg">{spot.summary}</p>
			<a href="/playground" class="mt-4 text-sm font-bold text-sky-700 hover:underline">
				Find it in the city ▶
			</a>
		</div>

		<div class="panel relative aspect-[4/3] overflow-hidden">
			{#if browser}
				{#key spot.slug}
					<Showcase {spot} />
				{/key}
			{/if}
			<p class="chip pointer-events-none absolute bottom-3 left-3">Drag to rotate</p>
		</div>
	</div>

	<div class="panel space-y-4 p-6 text-lg leading-relaxed">
		{#each spot.body as paragraph (paragraph)}
			<p>{paragraph}</p>
		{/each}
		{#if spot.list}
			<ul class="grid gap-2 sm:grid-cols-2">
				{#each spot.list as item (item)}
					<li class="flex gap-2"><span class="text-sky-500">◆</span>{item}</li>
				{/each}
			</ul>
		{/if}
		{#if spot.links}
			<div class="flex flex-wrap gap-3 pt-2">
				{#each spot.links as link (link.href)}
					<a
						class="btn-game"
						href={link.href}
						target={external(link.href) ? '_blank' : undefined}
						rel="noopener"
					>
						{link.label}
						{external(link.href) ? '↗' : '▶'}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	{#if spot.media}
		<div class="grid gap-6 sm:grid-cols-2">
			{#each spot.media as src (src)}
				<div class="panel overflow-hidden {spot.media.length === 1 ? 'sm:col-span-2' : ''}">
					{#if src.endsWith('.mp4')}
						<video {src} class="w-full" controls muted loop playsinline></video>
					{:else}
						<img {src} alt={spot.title} loading="lazy" class="w-full" />
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<nav class="flex justify-between gap-3">
		<a href={href(prev)} class="btn-game">◀ {prev.title}</a>
		<a href={href(next)} class="btn-game">{next.title} ▶</a>
	</nav>
</article>
