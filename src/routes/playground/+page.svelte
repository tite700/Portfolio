<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Color, Folder, Pane, Slider } from 'svelte-tweakpane-ui';
	import Scene from '@/components/scene.svelte';

	const light = $state({ x: 10, y: 15, z: 15, intensity: 1.2 });
	const ambient = $state({ color: '#d6efff' });
	const sphere = $state({ color: '#fff674' });
</script>

<div class="align flex w-full items-center justify-center px-5">
	<h1 class="md:py-15 py-10 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Playground
	</h1>
</div>

<div class="w-60">
	<Pane title="Tweak Tool" position="inline">
		<Folder title="Light">
			<Slider label="x" bind:value={light.x} />
			<Slider label="y" bind:value={light.y} />
			<Slider label="z" bind:value={light.z} />
			<Slider label="Intensity" bind:value={light.intensity} />
		</Folder>

		<Folder title="Ambient">
			<Color label="Color" bind:value={ambient.color} />
		</Folder>

		<Folder title="Sphere">
			<Color label="Color" bind:value={sphere.color} />
		</Folder>
	</Pane>
</div>

<Canvas>
	<Scene {light} {ambient} {sphere} />
</Canvas>
