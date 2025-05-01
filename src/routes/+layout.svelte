<script lang="ts">
	import '../app.css';
	import MenuBar from '$lib/components/menubar.svelte';

	let { children } = $props();
</script>

<div class="px-5 py-5">
	<MenuBar />
</div>

<main>
	{@render children()}
</main>
