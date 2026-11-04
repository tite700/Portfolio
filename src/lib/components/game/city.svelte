<script lang="ts">
	import { T } from '@threlte/core';
	import { projects, type Vec3 } from '$lib/projects';
	import Block from './block.svelte';
	import Building from './building.svelte';
	import Poi from './poi.svelte';
	import QuarterPipe from './quarter-pipe.svelte';
	import Ramp from './ramp.svelte';
	import Tree from './tree.svelte';

	// 3×3 city blocks of 36m, centers at -48 / 0 / 48, separated by 12m roads.
	// Each block gets a ground color; some get a row of buildings on their back half.
	const S = 48;
	const blocks: { c: [number, number]; ground: string; buildings?: boolean }[] = [
		{ c: [0, 0], ground: '#e7d7b8' }, // plaza (statue)
		{ c: [0, -S], ground: '#d1d5db' }, // skatepark
		{ c: [-S, -S], ground: '#86c06c' }, // park (sakura)
		{ c: [S, -S], ground: '#cbd5e1', buildings: true }, // arcade
		{ c: [-S, 0], ground: '#cbd5e1', buildings: true }, // gacha
		{ c: [S, 0], ground: '#cbd5e1', buildings: true }, // toaster
		{ c: [-S, S], ground: '#e9d8a6' }, // shooting range
		{ c: [0, S], ground: '#cbd5e1', buildings: true }, // giant hand
		{ c: [S, S], ground: '#86c06c' } // portal
	];

	// Deterministic pseudo-random so the city is the same on every load.
	let seed = 7;
	const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	const colors = ['#f4a261', '#e9c46a', '#a8dadc', '#ffb4a2', '#cdb4db', '#bde0fe', '#ffd6a5'];
	const pick = () => colors[Math.floor(rand() * colors.length)];

	const buildings: { position: Vec3; size: Vec3; color: string }[] = [];
	for (const { c, buildings: has } of blocks) {
		if (!has) continue;
		for (const dx of [-11, 0, 11]) {
			buildings.push({
				position: [c[0] + dx, 0, c[1] - 9],
				size: [10, 6 + Math.floor(rand() * 6) * 3, 12],
				color: pick()
			});
		}
	}
	// Ring of tall buildings closing the city.
	for (let i = -78; i <= 78; i += 13) {
		for (const [x, z] of [
			[i, -86],
			[i, 86],
			[-86, i],
			[86, i]
		]) {
			buildings.push({ position: [x, 0, z], size: [13, 18 + rand() * 15, 13], color: pick() });
		}
	}

	const parkTrees: Vec3[] = [
		[-60, 0, -60],
		[-36, 0, -60],
		[-60, 0, -36],
		[-36, 0, -36],
		[-12, 0, -12],
		[12, 0, -12],
		[-12, 0, 12],
		[12, 0, 12],
		[56, 0, 60],
		[40, 0, 38]
	];
</script>

<T.Color attach="background" args={['#9fd8ff']} />
<T.Fog attach="fog" args={['#9fd8ff', 50, 140]} />
<T.HemisphereLight args={['#ffffff', '#8a9a7a', 1.4]} />

<!-- Asphalt everywhere, block grounds on top (visual only) -->
<Block position={[0, -0.5, 0]} size={[200, 1, 200]} color="#4b5563" />
{#each blocks as { c, ground }, i (i)}
	<T.Mesh position={[c[0], 0.02, c[1]]} rotation.x={-Math.PI / 2} receiveShadow>
		<T.PlaneGeometry args={[36, 36]} />
		<T.MeshLambertMaterial color={ground} />
	</T.Mesh>
{/each}

{#each buildings as b, i (i)}
	<Building {...b} />
{/each}

{#each parkTrees as position, i (i)}
	<Tree {position} leaves={i < 4 ? '#f9a8d4' : '#4ade80'} />
{/each}

{#each projects as project (project.slug)}
	<Poi {project} />
{/each}

<!-- Skatepark -->
<Ramp position={[0, 0, -32]} run={4} height={1} width={4} />
<QuarterPipe position={[8, 0, -48]} rotationY={-Math.PI / 2} radius={3.5} width={10} />
<QuarterPipe position={[-8, 0, -48]} rotationY={Math.PI / 2} radius={3.5} width={10} />
<Ramp position={[0, 0, -56]} run={3} height={1} width={5} color="#f97316" />
<Block position={[0, 0.5, -60]} size={[5, 1, 2]} color="#64748b" />
<Ramp position={[0, 0, -64]} rotationY={Math.PI} run={3} height={1} width={5} color="#f97316" />

<!-- Shooting range counter -->
<Block position={[-48, 0.5, 47]} size={[7, 1, 0.6]} color="#92400e" />
