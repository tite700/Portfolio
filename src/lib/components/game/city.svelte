<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';
	import { SPAWN, esplanades, sections, spots, type Section, type Vec3 } from '$lib/content';
	import { level, rad } from '$lib/level';
	import Block from './block.svelte';
	import Building from './building.svelte';
	import Poi from './poi.svelte';
	import QuarterPipe from './quarter-pipe.svelte';
	import Ramp from './ramp.svelte';
	import Sign from './sign.svelte';
	import Tree from './tree.svelte';

	// A grass park: the spawn plaza in the middle, one octagonal esplanade per section
	// around it, and skate obstacles, trees and bushes from level.json (edit them in /editor).
	const plaza: [number, number] = [SPAWN[0], SPAWN[2]];

	const districts = (Object.keys(esplanades) as Section[]).map((section) => {
		const { center, radius } = esplanades[section];
		// Direction from the esplanade toward the plaza: the entrance side.
		const dx = plaza[0] - center[0];
		const dz = plaza[1] - center[1];
		const d = Math.hypot(dx, dz);
		const entrance = Math.atan2(dx, dz);
		const out = (r: number): Vec3 => [center[0] + (dx / d) * r, 0, center[1] + (dz / d) * r];
		return {
			section,
			center,
			size: radius + 6,
			sign: { position: out(radius + 8), rotationY: entrance, section },
			// Stone path from the plaza to the esplanade.
			path: { position: out(d / 2), length: d, angle: entrance },
			lamps: Array.from({ length: 8 }, (_, i) => {
				const a = entrance + ((i + 0.5) / 8) * Math.PI * 2;
				return [center[0] + Math.sin(a) * (radius + 5), center[1] + Math.cos(a) * (radius + 5)];
			})
		};
	});

	// Deterministic pseudo-random so the park is the same on every load.
	let seed = 7;
	const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	const colors = ['#f4a261', '#e9c46a', '#a8dadc', '#ffb4a2', '#cdb4db', '#bde0fe', '#ffd6a5'];
	const pick = () => colors[Math.floor(rand() * colors.length)];

	// Ring of buildings closing the park.
	const buildings: { position: Vec3; size: Vec3; color: string }[] = [];
	for (let i = -60; i <= 60; i += 12) {
		for (const [x, z] of [
			[i, -72],
			[i, 72],
			[-72, i],
			[72, i]
		]) {
			buildings.push({ position: [x, 0, z], size: [12, 12 + rand() * 14, 12], color: pick() });
		}
	}
</script>

<T.Color attach="background" args={['#9fd8ff']} />
<T.Fog attach="fog" args={['#9fd8ff', 45, 120]} />
<T.HemisphereLight args={['#ffffff', '#8a9a7a', 1.4]} />

<!-- Grass ground -->
<Block position={[0, -0.5, 0]} size={[160, 1, 160]} color="#86c06c" />

{#snippet octagon(x: number, z: number, r: number, y: number, color: string)}
	<T.Mesh position={[x, y, z]} rotation.y={Math.PI / 8} receiveShadow>
		<T.CylinderGeometry args={[r, r, 0.02, 8]} />
		<T.MeshLambertMaterial {color} />
	</T.Mesh>
{/snippet}

{#snippet lamp(x: number, z: number)}
	<T.Group position={[x, 0, z]}>
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
{/snippet}

<!-- Spawn plaza -->
{@render octagon(plaza[0], plaza[1], 8, 0.03, '#e7d7b8')}

{#each districts as d (d.section)}
	<T.Mesh position={d.path.position} rotation.y={d.path.angle} receiveShadow>
		<T.BoxGeometry args={[4, 0.04, d.path.length]} />
		<T.MeshLambertMaterial color="#d6c7a8" />
	</T.Mesh>
	<!-- Esplanade: section-colored border, stone floor, a planter in the middle -->
	{@render octagon(d.center[0], d.center[1], d.size + 0.8, 0.035, sections[d.section].color)}
	{@render octagon(d.center[0], d.center[1], d.size, 0.045, '#e7d7b8')}
	<T.Group position={[d.center[0], 0.3, d.center[1]]}>
		<RigidBody type="fixed">
			<Collider shape="cylinder" args={[0.3, 2.7]} />
		</RigidBody>
		<T.Mesh rotation.y={Math.PI / 8} castShadow receiveShadow>
			<T.CylinderGeometry args={[2.6, 2.8, 0.6, 8]} />
			<T.MeshLambertMaterial color="#a8a29e" flatShading />
		</T.Mesh>
		<T.Mesh position.y={0.31} rotation.y={Math.PI / 8}>
			<T.CylinderGeometry args={[2.3, 2.3, 0.02, 8]} />
			<T.MeshLambertMaterial color="#4d7c0f" />
		</T.Mesh>
	</T.Group>
	<Tree
		position={[d.center[0], 0.6, d.center[1]]}
		scale={0.9}
		leaves={sections[d.section].color}
		collider={false}
	/>
	<Sign {...d.sign} />
	{#each d.lamps as [x, z], i (i)}
		{@render lamp(x, z)}
	{/each}
{/each}

{#each spots as spot (spot.slug)}
	<Poi {spot} />
{/each}

{#each buildings as b, i (i)}
	<Building {...b} />
{/each}
<!-- Objects placed in the level editor -->
{#each level.objects as o, i (i)}
	{#if o.type === 'ramp'}
		<Ramp
			position={[o.x, 0, o.z]}
			rotationY={rad(o.rotation)}
			run={o.run}
			height={o.height}
			width={o.width}
			color={o.color}
		/>
	{:else if o.type === 'quarterpipe'}
		<QuarterPipe
			position={[o.x, 0, o.z]}
			rotationY={rad(o.rotation)}
			radius={o.radius}
			width={o.width}
			color={o.color}
		/>
	{:else if o.type === 'block'}
		<Block
			position={[o.x, o.height / 2, o.z]}
			rotation={[0, rad(o.rotation), 0]}
			size={[o.width, o.height, o.depth]}
			color={o.color}
		/>
	{:else if o.type === 'tree'}
		<Tree position={[o.x, 0, o.z]} scale={o.scale} leaves={o.pink ? '#f9a8d4' : '#4ade80'} />
	{:else if o.type === 'bush'}
		<T.Mesh position={[o.x, 0.3, o.z]} castShadow>
			<T.IcosahedronGeometry args={[0.6, 0]} />
			<T.MeshLambertMaterial color={o.color} flatShading />
		</T.Mesh>
	{/if}
{/each}
