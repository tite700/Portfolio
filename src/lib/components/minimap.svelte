<script lang="ts">
	import { level } from '$lib/level';
	import { game } from './game/state.svelte';
	import LevelMap from './level-map.svelte';

	// Whole map, north up, with an arrow for the player.
	const { x, z, heading } = $derived(game.player);
</script>

<div class="panel pointer-events-none h-44 w-44 overflow-hidden p-0 sm:h-52 sm:w-52">
	<svg viewBox="-68 -68 136 136" class="h-full w-full">
		<LevelMap {level} />
		<g transform="translate({x} {z}) rotate({(-heading * 180) / Math.PI})">
			<polygon
				points="0,5 3.5,-3.5 0,-1.5 -3.5,-3.5"
				fill="#facc15"
				stroke="#0f172a"
				stroke-width="0.8"
			/>
		</g>
	</svg>
</div>
