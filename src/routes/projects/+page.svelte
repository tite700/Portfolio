<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import SpotGrid from '$lib/components/spot-grid.svelte';
	import { projects } from '$lib/content';
	import { sectionTitle, t } from '$lib/i18n.svelte';
</script>

<svelte:head><title>{sectionTitle('projects')} · Baptiste David</title></svelte:head>

<PageTitle
	title={sectionTitle('projects')}
	quote={t(
		'“Talent is something you make bloom, instinct is something you polish.” – Haruichi Furudate',
		'« Le talent, ça se fait éclore. L’instinct, ça se polit. » – Haruichi Furudate'
	)}
/>
<SpotGrid spots={projects} />
