<script lang="ts">
	import { href, type Spot } from '$lib/content';

	let { spots }: { spots: Spot[] } = $props();

	const cover = (s: Spot) => s.media?.find((m) => !m.endsWith('.mp4'));
</script>

<div class="mx-auto grid max-w-6xl gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
	{#each spots as spot (spot.slug)}
		<a
			href={href(spot)}
			class="panel group overflow-hidden transition hover:-translate-y-1 hover:border-yellow-400"
		>
			<div class="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-400 to-sky-700">
				{#if cover(spot)}
					<img
						src={cover(spot)}
						alt=""
						loading="lazy"
						class="h-full w-full object-cover transition group-hover:scale-105"
					/>
				{:else if spot.icon}
					<img src={spot.icon} alt="" class="mx-auto h-full p-8 drop-shadow-[4px_4px_0_#0c4a6e]" />
				{:else}
					<p
						class="flex h-full items-center justify-center font-display text-2xl font-bold text-white"
					>
						{spot.poi.label}
					</p>
				{/if}
			</div>
			<div class="p-4">
				<h2 class="font-display text-xl font-bold">{spot.title}</h2>
				<p class="mt-1 line-clamp-3 text-sm text-slate-600">{spot.summary}</p>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each spot.tags as tag (tag)}
						<span class="chip">{tag}</span>
					{/each}
				</div>
			</div>
		</a>
	{/each}
</div>
