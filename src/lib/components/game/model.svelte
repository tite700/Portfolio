<script module lang="ts">
	import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';

	// 16px net mesh, shared by the volley and football nets (pixelated on purpose).
	let net: CanvasTexture | undefined;
	function netTile() {
		if (net) return net;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 16;
		const g = canvas.getContext('2d')!;
		g.fillStyle = '#ffffff';
		g.fillRect(0, 0, 16, 2);
		g.fillRect(0, 0, 2, 16);
		net = new CanvasTexture(canvas);
		net.magFilter = net.minFilter = NearestFilter;
		net.wrapS = net.wrapT = RepeatWrapping;
		net.colorSpace = SRGBColorSpace;
		return net;
	}
	function netMap(w: number, h: number) {
		const map = netTile().clone();
		map.repeat.set(w * 5, h * 5);
		return map;
	}
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import type { ModelKind, Vec3 } from '$lib/content';
	import Box from './box.svelte';
	import Character from './character.svelte';
	import Tree from './tree.svelte';

	// The model of a spot, standing on y = 0 and facing +z.
	let { kind }: { kind: ModelKind } = $props();

	const capsules = ['#facc15', '#60a5fa', '#f472b6', '#4ade80', '#fb923c', '#a78bfa', '#f87171'];
</script>

{#snippet cyl(
	r: number,
	h: number,
	position: Vec3,
	color: string,
	rotation: Vec3 = [0, 0, 0],
	segments = 12
)}
	<T.Mesh {position} {rotation} castShadow receiveShadow>
		<T.CylinderGeometry args={[r, r, h, segments]} />
		<T.MeshLambertMaterial {color} />
	</T.Mesh>
{/snippet}

{#snippet ball(r: number, position: Vec3, color: string)}
	<T.Mesh {position} castShadow>
		<T.SphereGeometry args={[r, 14, 10]} />
		<T.MeshLambertMaterial {color} />
	</T.Mesh>
{/snippet}

{#snippet netPlane(w: number, h: number, position: Vec3, rotation: Vec3 = [0, 0, 0])}
	<T.Mesh {position} {rotation}>
		<T.PlaneGeometry args={[w, h]} />
		<T.MeshLambertMaterial map={netMap(w, h)} transparent alphaTest={0.5} side={2} />
	</T.Mesh>
{/snippet}

{#snippet bear(position: Vec3, hat?: string)}
	<!-- Chunky sitting bear, facing +z -->
	<T.Group {position}>
		<Box size={[0.7, 0.75, 0.55]} position={[0, 0.38, 0]} color="#92400e" />
		<Box size={[0.4, 0.45, 0.05]} position={[0, 0.4, 0.28]} color="#d6a36b" />
		<Box size={[0.56, 0.5, 0.5]} position={[0, 0.98, 0]} color="#92400e" />
		<Box size={[0.26, 0.18, 0.12]} position={[0, 0.92, 0.29]} color="#d6a36b" />
		<Box size={[0.08, 0.06, 0.04]} position={[0, 0.97, 0.36]} color="#111111" />
		{#each [-0.14, 0.14] as x (x)}
			<Box size={[0.07, 0.08, 0.02]} position={[x, 1.07, 0.26]} color="#111111" />
			<Box size={[0.16, 0.16, 0.1]} position={[x * 1.6, 1.27, 0]} color="#78350f" />
		{/each}
		{#if hat}
			<T.Mesh position.y={1.3}>
				<T.ConeGeometry args={[0.38, 0.28, 8]} />
				<T.MeshLambertMaterial color={hat} flatShading />
			</T.Mesh>
		{/if}
	</T.Group>
{/snippet}

{#snippet water(r: number)}
	<T.Mesh position.y={0.05} receiveShadow>
		<T.CylinderGeometry args={[r, r, 0.1, 10]} />
		<T.MeshLambertMaterial color="#38bdf8" flatShading />
	</T.Mesh>
{/snippet}

{#if kind === 'gacha'}
	<Box size={[1, 1.1, 1]} position={[0, 0.55, 0]} color="#e63946" />
	<Box size={[0.55, 0.4, 0.05]} position={[0, 0.75, 0.51]} color="#e2e8f0" />
	{@render cyl(0.13, 0.08, [0, 0.75, 0.56], '#94a3b8', [Math.PI / 2, 0, 0])}
	<Box size={[0.3, 0.05, 0.05]} position={[0, 0.75, 0.61]} color="#475569" />
	<Box size={[0.08, 0.16, 0.03]} position={[0.36, 0.95, 0.52]} color="#1e293b" />
	<Box size={[0.4, 0.25, 0.06]} position={[0, 0.3, 0.5]} color="#1e293b" />
	{@render cyl(0.5, 0.1, [0, 1.15, 0], '#cbd5e1', [0, 0, 0], 16)}
	{#each capsules as color, i (i)}
		{@render ball(
			0.14,
			[Math.cos(i * 2.4) * 0.28, 1.35 + (i % 3) * 0.17, Math.sin(i * 2.4) * 0.28],
			color
		)}
	{/each}
	<T.Mesh position.y={1.6}>
		<T.SphereGeometry args={[0.55, 20, 14]} />
		<T.MeshLambertMaterial color="#bde0fe" transparent opacity={0.35} />
	</T.Mesh>
	{@render cyl(0.35, 0.15, [0, 2.12, 0], '#e63946', [0, 0, 0], 16)}
	{@render ball(0.09, [0, 2.24, 0], '#facc15')}
{:else if kind === 'sakura'}
	<Tree scale={1.4} leaves="#f9a8d4" collider={false} />
{:else if kind === 'statue'}
	<Box size={[2.4, 0.3, 2.4]} position={[0, 0.15, 0]} color="#a8a29e" />
	<Box size={[2, 0.75, 2]} position={[0, 0.67, 0]} color="#78716c" />
	<Box size={[2.2, 0.15, 2.2]} position={[0, 1.12, 0]} color="#a8a29e" />
	<Box size={[0.9, 0.3, 0.04]} position={[0, 0.67, 1.01]} color="#d4a017" />
	<T.Group position.y={1.2} scale={2.2}>
		<Character stone="#d6d3d1" />
	</T.Group>
{:else if kind === 'arcade'}
	<Box size={[0.9, 1.9, 0.8]} position={[0, 0.95, 0]} color="#7c3aed" />
	{#each [-0.46, 0.46] as x (x)}
		<Box size={[0.02, 1.6, 0.5]} position={[x, 1, 0]} color="#f472b6" />
	{/each}
	<Box size={[0.7, 0.5, 0.05]} position={[0, 1.45, 0.41]} color="#22d3ee" emissive />
	<Box size={[0.9, 0.25, 0.85]} position={[0, 1.95, 0]} color="#f472b6" emissive />
	<Box size={[0.9, 0.1, 0.4]} position={[0, 1, 0.5]} rotation={[0.3, 0, 0]} color="#1e1b4b" />
	{@render cyl(0.025, 0.15, [-0.2, 1.12, 0.5], '#111827')}
	{@render ball(0.05, [-0.2, 1.2, 0.5], '#ef4444')}
	{#each ['#facc15', '#22c55e', '#3b82f6'] as color, i (i)}
		{@render cyl(0.04, 0.04, [0.05 + i * 0.12, 1.07, 0.52], color, [0.3, 0, 0])}
	{/each}
	<Box size={[0.3, 0.4, 0.05]} position={[0, 0.45, 0.41]} color="#1e1b4b" />
	{#each [-0.06, 0.06] as x (x)}
		<Box size={[0.04, 0.08, 0.02]} position={[x, 0.5, 0.44]} color="#facc15" emissive />
	{/each}
{:else if kind === 'targets'}
	{#each [-3, 3] as x (x)}
		<Box size={[0.15, 2.2, 0.15]} position={[x, 1.1, 0]} color="#92400e" />
	{/each}
	<Box size={[6.4, 0.15, 0.15]} position={[0, 2.1, 0]} color="#92400e" />
	{#each [-2, 0, 2] as x (x)}
		<Box size={[0.1, 0.5, 0.1]} position={[x, 0.25, -0.05]} color="#78350f" />
		{#each [0.7, 0.5, 0.3, 0.12] as r, i (r)}
			{@render cyl(
				r,
				0.05,
				[x, 1.2, i * 0.02],
				i % 2 ? '#dc2626' : '#f8fafc',
				[Math.PI / 2, 0, 0],
				24
			)}
		{/each}
	{/each}
{:else if kind === 'portal'}
	{@render cyl(2.6, 0.3, [0, 0.15, 0], '#57534e', [0, 0, 0], 8)}
	<T.Mesh position.y={2.6}>
		<T.TorusGeometry args={[2, 0.3, 8, 32]} />
		<T.MeshBasicMaterial color="#dc2626" />
	</T.Mesh>
	<T.Mesh position.y={2.6}>
		<T.CircleGeometry args={[1.75, 32]} />
		<T.MeshBasicMaterial color="#7f1d1d" transparent opacity={0.7} side={2} />
	</T.Mesh>
	{#each [0.4, 1.6, 2.7] as a (a)}
		<T.Mesh position={[Math.cos(a) * 2.7, 2.6 + Math.sin(a) * 2.7, 0]} rotation.z={a}>
			<T.OctahedronGeometry args={[0.25, 0]} />
			<T.MeshLambertMaterial color="#f87171" flatShading />
		</T.Mesh>
	{/each}
{:else if kind === 'hand'}
	<!-- A "V" sign -->
	<Box size={[2, 1, 2]} position={[0, 0.5, 0]} color="#78716c" />
	<Box size={[1.2, 1.4, 0.4]} position={[0, 1.7, 0]} color="#d97706" />
	<Box size={[0.28, 1.2, 0.3]} position={[-0.2, 2.9, 0]} rotation={[0, 0, 0.15]} color="#d97706" />
	<Box size={[0.28, 1.2, 0.3]} position={[0.2, 2.9, 0]} rotation={[0, 0, -0.15]} color="#d97706" />
	<Box size={[0.6, 0.35, 0.35]} position={[0.3, 2.45, 0.1]} color="#d97706" />
	<Box
		size={[0.28, 0.8, 0.3]}
		position={[-0.75, 1.9, 0.05]}
		rotation={[0, 0, 0.6]}
		color="#d97706"
	/>
{:else if kind === 'toaster'}
	<Box size={[3.2, 2, 2]} position={[0, 1.05, 0]} color="#cbd5e1" />
	{#each [-1.3, 1.3] as x (x)}
		{#each [-0.8, 0.8] as z (z)}
			<Box size={[0.3, 0.1, 0.3]} position={[x, 0.05, z]} color="#475569" />
		{/each}
	{/each}
	{#each [-0.45, 0.45] as z (z)}
		<Box size={[1.3, 0.9, 0.22]} position={[0, 2.25, z]} color="#e9c46a" />
	{/each}
	<Box size={[0.12, 0.6, 0.12]} position={[1.66, 1.5, 0]} color="#64748b" />
	<Box size={[0.2, 0.15, 0.3]} position={[1.72, 1.8, 0]} color="#1e293b" />
	<!-- Cat face and tail -->
	{#each [-1.1, 1.1] as x (x)}
		<Box
			size={[0.5, 0.5, 0.2]}
			position={[x, 2.25, 0.7]}
			rotation={[0, 0, Math.PI / 4]}
			color="#94a3b8"
		/>
		<Box size={[0.2, 0.3, 0.02]} position={[x * 0.4, 1.25, 1.01]} color="#111111" />
	{/each}
	<Box size={[0.2, 0.12, 0.02]} position={[0, 1, 1.01]} color="#f472b6" />
	<Box size={[0.2, 0.2, 0.7]} position={[-1.2, 0.8, -1.3]} rotation={[0.4, 0, 0]} color="#94a3b8" />
	<Box size={[0.2, 0.6, 0.2]} position={[-1.2, 1.2, -1.6]} color="#94a3b8" />
{:else if kind === 'awale'}
	<Box size={[2.2, 0.8, 0.9]} position={[0, 0.4, 0]} color="#a8a29e" />
	<Box size={[2.8, 0.3, 1.4]} position={[0, 0.95, 0]} color="#a16207" />
	{#each [-1.25, 1.25] as x (x)}
		<Box size={[0.25, 0.03, 0.9]} position={[x, 1.1, 0]} color="#713f12" />
	{/each}
	{#each Array.from({ length: 12 }, (_, i) => i) as i (i)}
		{@const p = [-0.95 + (i % 6) * 0.38, 1.1, i < 6 ? -0.3 : 0.3] as Vec3}
		{@render cyl(0.15, 0.03, p, '#713f12', [0, 0, 0], 16)}
		{#each [-0.05, 0.05] as dx, j (j)}
			{@render ball(0.045, [p[0] + dx, 1.14, p[2] + dx * (i % 2 ? 1 : -1)], capsules[(i + j) % 7])}
		{/each}
	{/each}
{:else if kind === 'volley'}
	{#each [-3, 3] as x (x)}
		{@render cyl(0.08, 2.6, [x, 1.3, 0], '#64748b', [0, 0, 0], 8)}
	{/each}
	{@render netPlane(6, 0.9, [0, 1.95, 0])}
	<Box size={[6, 0.08, 0.04]} position={[0, 2.4, 0]} color="#f8fafc" />
	<Box size={[6, 0.04, 0.03]} position={[0, 1.5, 0]} color="#f8fafc" />
	{@render ball(0.2, [1.5, 0.2, 1.2], '#facc15')}
	<T.Mesh position={[1.5, 0.2, 1.2]} rotation.x={0.6}>
		<T.TorusGeometry args={[0.2, 0.03, 6, 16]} />
		<T.MeshLambertMaterial color="#2563eb" />
	</T.Mesh>
{:else if kind === 'football'}
	<!-- Goal mouth at z = +0.9, net back at z = -0.9 -->
	{#each [-2.5, 2.5] as x (x)}
		{@render cyl(0.07, 2.4, [x, 1.2, 0.9], '#f8fafc', [0, 0, 0], 8)}
		{@render cyl(0.04, 2.4, [x, 1.2, -0.9], '#cbd5e1', [0, 0, 0], 8)}
		{@render netPlane(1.8, 2.4, [x, 1.2, 0], [0, Math.PI / 2, 0])}
	{/each}
	{@render cyl(0.07, 5.1, [0, 2.4, 0.9], '#f8fafc', [0, 0, Math.PI / 2], 8)}
	{@render netPlane(5, 2.4, [0, 1.2, -0.9])}
	{@render netPlane(5, 1.8, [0, 2.4, 0], [Math.PI / 2, 0, 0])}
	<T.Mesh position={[0.8, 0.22, 1.6]} castShadow>
		<T.IcosahedronGeometry args={[0.22, 1]} />
		<T.MeshLambertMaterial color="#f8fafc" flatShading />
	</T.Mesh>
{:else if kind === 'gaming'}
	<T.Group position.z={-0.35}>
		<Box size={[2.2, 0.08, 0.9]} position={[0, 0.75, 0]} color="#1f2937" />
		{#each [-1, 1] as x (x)}
			<Box size={[0.08, 0.72, 0.8]} position={[x, 0.36, 0]} color="#111827" />
		{/each}
		<Box size={[0.35, 0.03, 0.2]} position={[0, 0.8, -0.25]} color="#111827" />
		<Box size={[0.08, 0.3, 0.06]} position={[0, 0.95, -0.28]} color="#111827" />
		<Box size={[1.1, 0.62, 0.06]} position={[0, 1.35, -0.25]} color="#0f172a" />
		<Box size={[1, 0.54, 0.02]} position={[0, 1.35, -0.215]} color="#38bdf8" emissive />
		<Box size={[0.7, 0.04, 0.22]} position={[0, 0.81, 0.1]} color="#334155" />
		<Box size={[0.7, 0.01, 0.02]} position={[0, 0.82, 0.215]} color="#f472b6" emissive />
		<Box size={[0.08, 0.04, 0.12]} position={[0.55, 0.81, 0.1]} color="#334155" />
		<T.Mesh position={[-0.75, 0.82, 0]} rotation.x={-Math.PI / 2}>
			<T.TorusGeometry args={[0.13, 0.025, 6, 12, Math.PI]} />
			<T.MeshLambertMaterial color="#dc2626" />
		</T.Mesh>
		{#each [-0.88, -0.62] as x (x)}
			{@render cyl(0.06, 0.05, [x, 0.82, 0], '#111827')}
		{/each}
		<!-- Trophy -->
		<Box size={[0.14, 0.05, 0.14]} position={[0.85, 0.81, -0.2]} color="#78350f" />
		{@render cyl(0.02, 0.1, [0.85, 0.88, -0.2], '#eab308')}
		<T.Mesh position={[0.85, 1.02, -0.2]} castShadow>
			<T.CylinderGeometry args={[0.1, 0.04, 0.18, 12]} />
			<T.MeshLambertMaterial color="#facc15" />
		</T.Mesh>
	</T.Group>
	<!-- Chair -->
	<T.Group position.z={0.5}>
		<T.Mesh position.y={0.08} castShadow>
			<T.CylinderGeometry args={[0.32, 0.32, 0.05, 5]} />
			<T.MeshLambertMaterial color="#111827" />
		</T.Mesh>
		{@render cyl(0.04, 0.38, [0, 0.3, 0], '#475569')}
		<Box size={[0.6, 0.1, 0.55]} position={[0, 0.52, 0]} color="#111827" />
		<Box
			size={[0.6, 0.85, 0.1]}
			position={[0, 1.0, 0.27]}
			rotation={[-0.15, 0, 0]}
			color="#dc2626"
		/>
		<Box
			size={[0.2, 0.86, 0.11]}
			position={[0, 1.0, 0.27]}
			rotation={[-0.15, 0, 0]}
			color="#111827"
		/>
	</T.Group>
{:else if kind === 'council'}
	<Box size={[1.2, 0.12, 0.8]} position={[0, 0.06, 0]} color="#475569" />
	<Box size={[1, 1.1, 0.6]} position={[0, 0.67, 0]} color="#1d4ed8" />
	<Box size={[1.1, 0.06, 0.7]} position={[0, 1.25, 0.02]} rotation={[0.25, 0, 0]} color="#1e3a8a" />
	{@render cyl(0.2, 0.04, [0, 0.75, 0.31], '#facc15', [Math.PI / 2, 0, 0], 5)}
	{@render cyl(0.015, 0.4, [0.25, 1.45, 0.1], '#111827', [0.4, 0, 0])}
	{@render ball(0.05, [0.25, 1.64, 0.18], '#334155')}
	{@render cyl(0.03, 2.5, [-0.85, 1.25, 0], '#94a3b8', [0, 0, 0], 8)}
	<Box size={[0.7, 0.45, 0.02]} position={[-0.47, 2.2, 0]} color="#f8fafc" />
	<Box size={[0.7, 0.15, 0.03]} position={[-0.47, 2.2, 0]} color="#0284c7" />
	<!-- Party balloons tied to the podium -->
	{#each [{ color: '#f472b6', x: 0.75, y: 2.1 }, { color: '#facc15', x: 0.95, y: 2.35 }] as b (b.color)}
		{@render ball(0.2, [b.x, b.y, 0], b.color)}
		{@render cyl(0.006, b.y - 1.4, [b.x, (b.y + 1) / 2, 0], '#475569', [0, 0, 0], 4)}
	{/each}
{:else if kind === 'books'}
	{#each ['#b91c1c', '#1d4ed8', '#15803d', '#7c3aed'] as color, i (color)}
		<T.Group position={[-0.5, 0.08 + i * 0.17, 0]} rotation.y={i * 0.35 - 0.5}>
			<Box size={[0.9 - i * 0.06, 0.16, 0.65]} {color} />
			<Box size={[0.86 - i * 0.06, 0.12, 0.67]} color="#fef3c7" />
		</T.Group>
	{/each}
	<Box size={[0.12, 0.6, 0.12]} position={[0.55, 0.3, 0]} color="#78350f" />
	<T.Group position={[0.55, 0.65, 0]} rotation.x={0.5}>
		<Box size={[1.2, 0.03, 0.8]} position={[0, -0.04, 0]} color="#b91c1c" />
		{#each [-1, 1] as s (s)}
			<Box
				size={[0.56, 0.05, 0.75]}
				position={[s * 0.29, 0.02, 0]}
				rotation={[0, 0, -s * 0.1]}
				color="#fffbeb"
			/>
		{/each}
		<Box size={[0.03, 0.02, 0.5]} position={[0.05, 0.05, 0.3]} color="#dc2626" />
	</T.Group>
{:else if kind === 'snowboard'}
	<T.Mesh scale={[1, 0.45, 1]}>
		<T.IcosahedronGeometry args={[1.5, 1]} />
		<T.MeshLambertMaterial color="#f8fafc" flatShading />
	</T.Mesh>
	{#each [[-0.9, -0.8], [1, -0.6]] as [x, z] (x)}
		{@render cyl(0.08, 0.4, [x, 0.4, z], '#6b4226', [0, 0, 0], 6)}
		{#each [0, 1, 2] as i (i)}
			<T.Mesh position={[x, 0.85 + i * 0.3, z]} castShadow>
				<T.ConeGeometry args={[0.5 - i * 0.13, 0.6, 7]} />
				<T.MeshLambertMaterial color={i === 2 ? '#e2e8f0' : '#166534'} flatShading />
			</T.Mesh>
		{/each}
	{/each}
	<T.Group position={[0.2, 1.25, 0.45]} rotation.z={0.15}>
		<Box size={[0.32, 1.5, 0.05]} color="#f97316" />
		<Box size={[0.33, 0.12, 0.06]} position={[0, 0.45, 0]} color="#f8fafc" />
		{#each [-0.3, 0.2] as y (y)}
			<Box size={[0.28, 0.1, 0.15]} position={[0, y, 0.08]} color="#111827" />
		{/each}
	</T.Group>
{:else if kind === 'bearboat'}
	{@render water(1.5)}
	<Box size={[2.2, 0.4, 1]} position={[0, 0.3, 0]} color="#a16207" />
	<Box size={[2, 0.08, 0.8]} position={[0, 0.48, 0]} color="#78350f" />
	{@render bear([0.3, 0.45, 0], '#facc15')}
	{@render cyl(0.02, 1.8, [-0.4, 1.3, 0.3], '#451a03', [0, 0, 0.9], 6)}
	{@render cyl(0.005, 1, [-1.15, 1.25, 0.3], '#e2e8f0', [0, 0, 0], 4)}
	<Box size={[0.3, 0.12, 0.08]} position={[-1, 0.45, 0.8]} rotation={[0, 0, 0.6]} color="#fb923c" />
{:else if kind === 'bearscouts'}
	<!-- Tent: a triangular prism with its ridge up -->
	<T.Mesh position={[0.3, 0.45, -0.3]} rotation.x={-Math.PI / 2} castShadow>
		<T.CylinderGeometry args={[0.9, 0.9, 1.8, 3]} />
		<T.MeshLambertMaterial color="#f97316" flatShading />
	</T.Mesh>
	{@render bear([-1, 0, 0.6], '#15803d')}
	<T.Group position={[0.8, 0, 0.8]}>
		{#each [0.5, -0.5] as r (r)}
			<Box size={[0.6, 0.1, 0.12]} position={[0, 0.06, 0]} rotation={[0, r, 0]} color="#78350f" />
		{/each}
		<T.Mesh position.y={0.3}>
			<T.ConeGeometry args={[0.18, 0.45, 6]} />
			<T.MeshBasicMaterial color="#fb923c" />
		</T.Mesh>
		<T.Mesh position.y={0.25}>
			<T.ConeGeometry args={[0.1, 0.25, 6]} />
			<T.MeshBasicMaterial color="#fde047" />
		</T.Mesh>
	</T.Group>
{:else if kind === 'loot'}
	<!-- Diamond ore: a faceted rock with gems poking out, rubble and a pickaxe -->
	<T.Mesh position.y={0.55} scale={[1, 0.8, 0.9]} castShadow receiveShadow>
		<T.IcosahedronGeometry args={[0.8, 0]} />
		<T.MeshLambertMaterial color="#78716c" flatShading />
	</T.Mesh>
	{#each [[0.45, 0.55, 0.5], [-0.4, 0.75, 0.45], [0.1, 1.05, 0.2], [0.55, 0.35, -0.3], [-0.5, 0.45, -0.4], [-0.1, 0.9, -0.45]] as [x, y, z], i (i)}
		<T.Mesh
			position={[x, y, z]}
			rotation={[Math.atan2(z, y - 0.55), 0, -Math.atan2(x, y - 0.55)]}
			scale={[1, 1.7, 1]}
		>
			<T.OctahedronGeometry args={[0.13 + (i % 3) * 0.04, 0]} />
			<T.MeshLambertMaterial color="#67e8f9" emissive="#0891b2" flatShading />
		</T.Mesh>
	{/each}
	{#each [[0.9, 0.5], [-0.8, 0.7], [0.3, -0.85]] as [x, z] (x)}
		<T.Mesh position={[x, 0.12, z]}>
			<T.DodecahedronGeometry args={[0.16, 0]} />
			<T.MeshLambertMaterial color="#a8a29e" flatShading />
		</T.Mesh>
	{/each}
	{@render cyl(0.03, 1, [-0.95, 0.48, 0.55], '#78350f', [0, 0, 0.3], 6)}
	<Box
		size={[0.5, 0.08, 0.08]}
		position={[-1.09, 0.95, 0.55]}
		rotation={[0, 0, 0.3]}
		color="#94a3b8"
	/>
{:else if kind === 'plundr'}
	{@render water(1.5)}
	<Box size={[2.4, 0.6, 1]} position={[0, 0.45, 0]} color="#78350f" />
	<Box size={[0.6, 0.35, 0.9]} position={[-0.85, 0.9, 0]} color="#92400e" />
	<Box size={[2.2, 0.06, 0.85]} position={[0, 0.76, 0]} color="#a16207" />
	{@render cyl(0.05, 2, [0.2, 1.75, 0], '#451a03', [0, 0, 0], 8)}
	<Box size={[0.04, 0.9, 1.2]} position={[0.25, 1.75, 0]} color="#f8fafc" />
	<Box size={[0.02, 0.25, 0.4]} position={[0.2, 2.65, 0.2]} color="#111111" />
	<Box size={[0.03, 0.08, 0.08]} position={[0.2, 2.67, 0.2]} color="#f8fafc" />
{:else if kind === 'witchgrove'}
	<T.Mesh position.y={0.55} scale={[1, 0.85, 1]} castShadow>
		<T.SphereGeometry args={[0.65, 16, 12]} />
		<T.MeshLambertMaterial color="#1e293b" />
	</T.Mesh>
	<T.Mesh position.y={0.98} rotation.x={Math.PI / 2}>
		<T.TorusGeometry args={[0.5, 0.06, 6, 16]} />
		<T.MeshLambertMaterial color="#334155" />
	</T.Mesh>
	{@render cyl(0.48, 0.02, [0, 0.96, 0], '#4ade80', [0, 0, 0], 16)}
	{#each [[0.15, 1.05, 0.1], [-0.2, 1.12, -0.05], [0.05, 1.22, -0.15]] as p, i (i)}
		<T.Mesh position={p as Vec3}>
			<T.SphereGeometry args={[0.07 - i * 0.015, 8, 6]} />
			<T.MeshBasicMaterial color="#86efac" />
		</T.Mesh>
	{/each}
	<!-- Broom leaning on the cauldron -->
	{@render cyl(0.03, 1.6, [0.75, 0.75, 0.1], '#78350f', [0, 0, 0.25], 6)}
	<T.Mesh position={[0.92, 0.12, 0.1]} rotation.z={0.25}>
		<T.ConeGeometry args={[0.15, 0.4, 7]} />
		<T.MeshLambertMaterial color="#ca8a04" flatShading />
	</T.Mesh>
	<!-- Witch hat and mushrooms -->
	<T.Mesh position={[-0.75, 0.3, 0.5]} rotation.z={0.3}>
		<T.ConeGeometry args={[0.25, 0.6, 8]} />
		<T.MeshLambertMaterial color="#7c3aed" flatShading />
	</T.Mesh>
	{#each [[-0.6, -0.6], [0.6, -0.6], [0.2, 0.75]] as [x, z] (x)}
		{@render cyl(0.05, 0.2, [x, 0.1, z], '#fef3c7', [0, 0, 0], 6)}
		<T.Mesh position={[x, 0.2, z]}>
			<T.SphereGeometry args={[0.14, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
			<T.MeshLambertMaterial color="#dc2626" />
		</T.Mesh>
	{/each}
{:else if kind === 'vineyard'}
	{#each [-0.6, 0.6] as z (z)}
		{#each [-1.5, 0, 1.5] as x (x)}
			{@render cyl(0.05, 1.3, [x, 0.65, z], '#78350f', [0, 0, 0], 6)}
		{/each}
		<Box size={[3, 0.02, 0.02]} position={[0, 1.1, z]} color="#94a3b8" />
		{#each [-1.1, -0.4, 0.4, 1.1] as x (x)}
			<T.Mesh position={[x, 1.05, z]} castShadow>
				<T.IcosahedronGeometry args={[0.3, 1]} />
				<T.MeshLambertMaterial color="#4d7c0f" flatShading />
			</T.Mesh>
			{#each [0, 1, 2] as k (k)}
				{@render ball(0.06, [x + (k - 1) * 0.07, 0.78 - (k % 2) * 0.08, z + 0.25], '#7e22ce')}
			{/each}
		{/each}
	{/each}
	{@render cyl(0.32, 0.7, [1.5, 0.35, 0.05], '#92400e', [Math.PI / 2, 0, 0], 12)}
{/if}
