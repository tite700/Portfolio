<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import SpotGrid from '$lib/components/spot-grid.svelte';
	import { hobbies } from '$lib/content';
	import { sectionTitle, t } from '$lib/i18n.svelte';
</script>

<svelte:head><title>{sectionTitle('hobbies')} · Baptiste David</title></svelte:head>

<PageTitle
	title={sectionTitle('hobbies')}
	quote={t(
		'“There is more wisdom in your body than in your deepest philosophy.” – Nietzsche',
		'« Il y a plus de raison dans ton corps que dans ta meilleure sagesse. » – Nietzsche'
	)}
/>
<SpotGrid spots={hobbies} />
