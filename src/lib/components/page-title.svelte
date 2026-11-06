<script lang="ts">
	// Slanted banner title, like a 2010s game menu header.
	let { title, quote }: { title: string; quote?: string } = $props();
</script>

<div class="px-5 pt-12 text-center">
	<h1
		class="inline-block -skew-x-12 border-2 border-sky-800 bg-gradient-to-b from-sky-500 to-sky-700 px-8 py-2 shadow-[6px_6px_0_#0c4a6e]"
	>
		<span class="block skew-x-12 font-display text-4xl font-bold text-white lg:text-5xl"
			>{title}</span
		>
	</h1>
	{#if quote}
		<p class="mx-auto mt-5 max-w-2xl italic text-sky-950/70">{quote}</p>
	{/if}
</div>
