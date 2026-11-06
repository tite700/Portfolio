<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';
	import { spots, type Section, type Vec3 } from '$lib/content';
	import Block from './block.svelte';
	import Building from './building.svelte';
	import Poi from './poi.svelte';
	import QuarterPipe from './quarter-pipe.svelte';
	import Ramp from './ramp.svelte';
	import Sign from './sign.svelte';
	import Tree from './tree.svelte';

	// 3×3 city blocks of 36m, centers at -48 / 0 / 48, separated by 12m roads.
	// One district per column: hobbies west, student & personal projects in the middle,
	// professional work east. No buildings inside the city, for a clear view.
	// `sign`: distance from the block center to its district sign (17 = on the edge).
	const S = 48;
	const blocks: { c: [number, number]; ground: string; sign?: number }[] = [
		{ c: [-S, -S], ground: '#86c06c' }, // hobbies: park (football, books)
		{ c: [-S, 0], ground: '#d1d5db' }, // hobbies: skatepark (snowboard, gaming)
		{ c: [-S, S], ground: '#e9d8a6' }, // hobbies: beach (volley, council)
		{ c: [0, -S], ground: '#86c06c' }, // projects: garden (sakura, gacha, arcade)
		{ c: [0, 0], ground: '#e7d7b8' }, // plaza: spawn
		{ c: [0, S], ground: '#cbd5e1', sign: 12 }, // projects: statue, awale, hand, range, toaster
		{ c: [S, -S], ground: '#cbd5e1' }, // work: Albyon
		{ c: [S, 0], ground: '#cbd5e1' }, // work: Albyon
		{ c: [S, S], ground: '#86c06c' } // work: Crimson XR, Widid
	];

	// A district sign on the edge of every block (except the plaza), facing the middle.
	const signs = blocks
		.filter(({ c }) => c[0] || c[1])
		.map(({ c, sign = 17 }) => {
			const d = c[0] ? [-Math.sign(c[0]), 0] : [0, -Math.sign(c[1])];
			const section: Section = c[0] < 0 ? 'hobbies' : c[0] > 0 ? 'work' : 'projects';
			return {
				position: [c[0] + d[0] * sign, 0, c[1] + d[1] * sign] as Vec3,
				rotationY: Math.atan2(d[0], d[1]),
				section
			};
		});

	// Deterministic pseudo-random so the city is the same on every load.
	let seed = 7;
	const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	const colors = ['#f4a261', '#e9c46a', '#a8dadc', '#ffb4a2', '#cdb4db', '#bde0fe', '#ffd6a5'];
	const pick = () => colors[Math.floor(rand() * colors.length)];

	// Ring of tall buildings closing the city.
	const buildings: { position: Vec3; size: Vec3; color: string }[] = [];
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
		[-13, 0, -40],
		[13, 0, -40],
		[-6, 0, -63],
		[6, 0, -63],
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

{#each spots as spot (spot.slug)}
	<Poi {spot} />
{/each}

<!-- Street lamps at every block corner -->
{#each blocks as { c }, i (i)}
	{#each [[-17, -17], [17, -17], [-17, 17], [17, 17]] as [dx, dz] (`${dx}${dz}`)}
		<T.Group position={[c[0] + dx, 0, c[1] + dz]}>
			<T.Group position.y={2}>
				<RigidBody type="fixed">
					<Collider shape="cylinder" args={[2, 0.15]} />
				</RigidBody>
			</T.Group>
			<T.Mesh position.y={2} castShadow>
				<T.CylinderGeometry args={[0.08, 0.12, 4, 8]} />
				<T.MeshLambertMaterial color="#334155" />
			</T.Mesh>
			<T.Mesh position.y={4.15}>
				<T.CylinderGeometry args={[0.15, 0.3, 0.35, 6]} />
				<T.MeshBasicMaterial color="#fef08a" />
			</T.Mesh>
			<T.Mesh position.y={4.4}>
				<T.ConeGeometry args={[0.35, 0.25, 6]} />
				<T.MeshLambertMaterial color="#334155" flatShading />
			</T.Mesh>
		</T.Group>
	{/each}
{/each}

{#each signs as sign, i (i)}
	<Sign {...sign} />
{/each}

<!-- Skatepark, in the hobbies district (built around (0, -48), moved to (-48, 0)) -->
<T.Group position={[-S, 0, S]}>
	<Ramp position={[0, 0, -32]} run={4} height={1} width={4} />
	<QuarterPipe position={[8, 0, -48]} rotationY={-Math.PI / 2} radius={3.5} width={10} />
	<QuarterPipe position={[-8, 0, -48]} rotationY={Math.PI / 2} radius={3.5} width={10} />
	<Ramp position={[0, 0, -56]} run={3} height={1} width={5} color="#f97316" />
	<Block position={[0, 0.5, -60]} size={[5, 1, 2]} color="#64748b" />
	<Ramp position={[0, 0, -64]} rotationY={Math.PI} run={3} height={1} width={5} color="#f97316" />
</T.Group>

<!-- Shooting range counter -->
<Block position={[-10, 0.5, 61]} size={[7, 1, 0.6]} color="#92400e" />
