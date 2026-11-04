<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import type { Group } from 'three';
	import Box from './box.svelte';

	type Anim = { speed: number; skating: boolean; grounded: boolean };

	// Chibi low-poly character, feet at y = 0, facing +z.
	// Without `anim` it stays still (used by the statue).
	let { anim, stone }: { anim?: Anim; stone?: string } = $props();

	const c = (color: string) => stone ?? color;

	let legL = $state<Group>();
	let legR = $state<Group>();
	let armL = $state<Group>();
	let armR = $state<Group>();
	let phase = 0;

	useTask((dt) => {
		if (!anim || !legL || !legR || !armL || !armR) return;
		let leg = 0;
		let armOut = 0.1;
		if (anim.skating) {
			armOut = 1.1;
		} else if (!anim.grounded) {
			leg = 0.6;
			armOut = 2.4;
		} else {
			const s = Math.min(anim.speed / 5, 1);
			phase += dt * (3 + 9 * s);
			leg = Math.sin(phase) * 0.8 * s;
		}
		legL.rotation.x = leg;
		legR.rotation.x = -leg;
		armL.rotation.set(-leg, 0, -armOut);
		armR.rotation.set(leg, 0, armOut);
	});
</script>

<!-- Limbs pivot at the hip / shoulder -->
<T.Group position={[-0.12, 0.45, 0]} bind:ref={legL}>{@render leg()}</T.Group>
<T.Group position={[0.12, 0.45, 0]} bind:ref={legR}>{@render leg()}</T.Group>
<T.Group position={[-0.32, 0.86, 0]} bind:ref={armL}>{@render arm()}</T.Group>
<T.Group position={[0.32, 0.86, 0]} bind:ref={armR}>{@render arm()}</T.Group>

{#snippet leg()}
	<Box size={[0.18, 0.45, 0.2]} position={[0, -0.225, 0]} color={c('#2d3748')} />
	<Box size={[0.2, 0.1, 0.28]} position={[0, -0.4, 0.04]} color={c('#e53e3e')} />
{/snippet}

{#snippet arm()}
	<Box size={[0.14, 0.4, 0.14]} position={[0, -0.2, 0]} color={c('#2b6cb0')} />
	<Box size={[0.13, 0.1, 0.13]} position={[0, -0.43, 0]} color={c('#ffd7b5')} />
{/snippet}

<Box size={[0.5, 0.45, 0.3]} position={[0, 0.675, 0]} color={c('#2b6cb0')} />

<!-- Big chibi head with a cap -->
<T.Group position.y={1.15}>
	<Box size={[0.56, 0.5, 0.5]} color={c('#ffd7b5')} />
	<Box size={[0.6, 0.16, 0.56]} position={[0, 0.3, 0]} color={c('#e53e3e')} />
	<Box size={[0.5, 0.04, 0.25]} position={[0, 0.23, 0.35]} color={c('#e53e3e')} />
	<Box size={[0.58, 0.3, 0.1]} position={[0, 0.05, -0.25]} color={c('#3b2a20')} />
	{#each [-0.12, 0.12] as x (x)}
		<Box size={[0.08, 0.13, 0.02]} position={[x, 0, 0.251]} color={c('#111111')} />
		<Box size={[0.08, 0.04, 0.02]} position={[x * 1.5, -0.11, 0.251]} color={c('#f9a8b8')} />
	{/each}
</T.Group>
