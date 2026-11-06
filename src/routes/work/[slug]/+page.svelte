<script lang="ts">
	import Article from '$lib/components/article.svelte';
	import { work } from '$lib/content';

	let { data } = $props();
</script>

<Article spot={data.spot} list={work} />
