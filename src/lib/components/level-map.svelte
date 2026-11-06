<script lang="ts">
	import { sections, spots, type Section } from '$lib/content';
	import { corners, footprint, type Level } from '$lib/level';

	// Top-down drawing of the level (SVG group, 1 unit = 1 m, north up), used by the
	// minimap and the editor. `onpick` makes elements selectable: ids are 'spawn',
	// 'esplanade:<section>', 'spot:<slug>' and 'object:<index>'.
	let {
		level,
		selected = null,
		labels = false,
		onpick
	}: {
		level: Level;
		selected?: string | null;
		labels?: boolean;
		onpick?: (id: string, e: PointerEvent) => void;
	} = $props();

	const objectColor = (o: Level['objects'][number]) =>
		o.type === 'tree' ? (o.pink ? '#f9a8d4' : '#16a34a') : o.color;

	const octagon = (x: number, z: number, r: number) =>
		Array.from({ length: 8 }, (_, k) => {
			const a = (k * Math.PI) / 4 + Math.PI / 8;
			return `${x + r * Math.sin(a)},${z + r * Math.cos(a)}`;
		}).join(' ');

	const pick = (id: string) => (e: PointerEvent) => onpick?.(id, e);
	const ring = (id: string) => (selected === id ? '#facc15' : 'none');
	const esplanades = $derived(
		Object.entries(level.esplanades) as [Section, Level['esplanades'][Section]][]
	);
</script>

<rect x="-80" y="-80" width="160" height="160" fill="#86c06c" />
<rect x="-66" y="-66" width="132" height="132" fill="none" stroke="#475569" stroke-width="2" />

{#each esplanades as [section, e] (section)}
	<line x1={level.spawn.x} y1={level.spawn.z} x2={e.x} y2={e.z} stroke="#d6c7a8" stroke-width="4" />
{/each}
<circle cx={level.spawn.x} cy={level.spawn.z} r="8" fill="#e7d7b8" />

{#each esplanades as [section, e] (section)}
	{@const id = `esplanade:${section}`}
	<polygon
		points={octagon(e.x, e.z, e.radius + 6)}
		fill="#e7d7b8"
		stroke={selected === id ? '#facc15' : sections[section].color}
		stroke-width="1.6"
		onpointerdown={pick(id)}
	/>
	<circle cx={e.x} cy={e.z} r="2.7" fill="#4d7c0f" onpointerdown={pick(id)} />
{/each}

{#each level.objects as o, i (i)}
	<polygon
		points={corners(o.x, o.z, o.rotation, footprint(o))}
		fill={objectColor(o)}
		stroke={ring(`object:${i}`)}
		stroke-width="0.6"
		opacity={o.type === 'tree' || o.type === 'bush' ? 0.8 : 1}
		onpointerdown={pick(`object:${i}`)}
	/>
{/each}

{#each spots as spot (spot.slug)}
	{@const p = level.spots[spot.slug] ?? {
		x: spot.poi.position[0],
		z: spot.poi.position[2],
		rotation: 0
	}}
	{@const id = `spot:${spot.slug}`}
	<polygon
		points={corners(p.x, p.z, p.rotation, [
			-spot.poi.size[0] / 2,
			spot.poi.size[0] / 2,
			-spot.poi.size[2] / 2,
			spot.poi.size[2] / 2
		])}
		fill={sections[spot.section].color}
		stroke={selected === id ? '#facc15' : '#0f172a'}
		stroke-width={selected === id ? 0.6 : 0.2}
		onpointerdown={pick(id)}
	/>
	<circle cx={p.x} cy={p.z} r="0.9" fill={sections[spot.section].color} onpointerdown={pick(id)} />
	{#if labels}
		<text
			x={p.x}
			y={p.z - 2.2}
			font-size="1.6"
			text-anchor="middle"
			class="pointer-events-none fill-slate-900"
		>
			{spot.title}
		</text>
	{/if}
{/each}

<g onpointerdown={pick('spawn')}>
	<circle cx={level.spawn.x} cy={level.spawn.z} r="1.4" fill="#fff" stroke={ring('spawn')} />
	<circle cx={level.spawn.x} cy={level.spawn.z} r="0.7" fill="#0f172a" />
</g>
