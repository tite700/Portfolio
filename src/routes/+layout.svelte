<script lang="ts">
	import '../app.css';
	import MenuBar from '$lib/components/menubar.svelte';
	import PolyBg from '$lib/components/poly-bg.svelte';
	import { initLang } from '$lib/i18n.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(initLang);
</script>

<PolyBg />

<div class="px-5 py-5">
	<MenuBar />
</div>

<main>
	{@render children()}
</main>
