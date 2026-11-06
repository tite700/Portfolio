<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import SpotGrid from '$lib/components/spot-grid.svelte';
	import { experiences, work } from '$lib/content';
</script>

<svelte:head><title>Work · Baptiste David</title></svelte:head>

<PageTitle title="Work" quote="My professional experiences in VR and game development." />

{#each experiences as xp (xp.company)}
	<section class="mx-auto max-w-6xl px-5 pt-8">
		<div class="panel p-6">
			<div class="flex flex-wrap items-baseline justify-between gap-2">
				<h2 class="font-display text-3xl font-bold text-sky-950">{xp.company}</h2>
				<span class="chip">{xp.dates}</span>
			</div>
			<p class="font-semibold text-sky-700">{xp.role} · {xp.place}</p>
			<ul class="mt-3 space-y-1">
				{#each xp.points as point (point)}
					<li class="flex gap-2"><span class="text-orange-400">◆</span>{point}</li>
				{/each}
			</ul>
		</div>
	</section>
	<SpotGrid spots={work.filter((s) => xp.slugs.includes(s.slug))} />
{/each}
