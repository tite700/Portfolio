<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import SpotGrid from '$lib/components/spot-grid.svelte';
	import { projects } from '$lib/content';
</script>

<svelte:head><title>Projects · Baptiste David</title></svelte:head>

<PageTitle
	title="Projects"
	quote="“Talent is something you make bloom, instinct is something you polish.” – Haruichi Furudate"
/>
<SpotGrid spots={projects} />
