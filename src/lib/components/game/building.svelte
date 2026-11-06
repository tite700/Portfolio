<script module lang="ts">
	import {
		CanvasTexture,
		MeshLambertMaterial,
		NearestFilter,
		RepeatWrapping,
		SRGBColorSpace
	} from 'three';

	// One 16px window tile shared by every building (pixelated on purpose).
	let tile: CanvasTexture | undefined;
	function windowTile() {
		if (tile) return tile;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 16;
		const g = canvas.getContext('2d')!;
		g.fillStyle = '#ffffff';
		g.fillRect(0, 0, 16, 16);
		g.fillStyle = '#334766';
		g.fillRect(3, 3, 10, 9);
		g.fillStyle = '#9cc3f0';
		g.fillRect(4, 4, 3, 3);
		tile = new CanvasTexture(canvas);
		tile.magFilter = tile.minFilter = NearestFilter;
		tile.wrapS = tile.wrapT = RepeatWrapping;
		tile.colorSpace = SRGBColorSpace;
		return tile;
	}
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';

	type Vec3 = [number, number, number];

	// Box building standing on the ground at `position`, windows every 3m.
	let { position, size, color }: { position: Vec3; size: Vec3; color: string } = $props();

	const [w, h, d] = size;
	const facade = (width: number) => {
		const map = windowTile().clone();
		map.repeat.set(width / 3, h / 3);
		return new MeshLambertMaterial({ color, map });
	};
	const sides = facade(d);
	const front = facade(w);
	const roof = new MeshLambertMaterial({ color: '#64748b' });
	// BoxGeometry face order: +x, -x, +y, -y, +z, -z
	const materials = [sides, sides, roof, roof, front, front];
</script>

<T.Group position={[position[0], h / 2, position[2]]}>
	<RigidBody type="fixed">
		<Collider shape="cuboid" args={[w / 2, h / 2, d / 2]} />
	</RigidBody>
	<T.Mesh material={materials} castShadow receiveShadow>
		<T.BoxGeometry args={size} />
	</T.Mesh>
	<!-- Cornice and a rooftop unit -->
	<T.Mesh position.y={h / 2 + 0.2} castShadow>
		<T.BoxGeometry args={[w + 0.5, 0.4, d + 0.5]} />
		<T.MeshLambertMaterial color="#475569" />
	</T.Mesh>
	<T.Mesh position={[w / 5, h / 2 + 0.9, -d / 5]} castShadow>
		<T.BoxGeometry args={[2.5, 1.4, 2]} />
		<T.MeshLambertMaterial color="#94a3b8" />
	</T.Mesh>
</T.Group>
