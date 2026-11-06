<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import SpotGrid from '$lib/components/spot-grid.svelte';
	import { hobbies } from '$lib/content';
</script>

<svelte:head><title>Hobbies · Baptiste David</title></svelte:head>

<PageTitle
	title="Hobbies"
	quote="“There is more wisdom in your body than in your deepest philosophy.” – Nietzsche"
/>
<SpotGrid spots={hobbies} />
