// The /playground map, stored in level.json and edited with /editor (dev only).
// Positions are on the ground plane (x east, z south), rotations in degrees around y.
import data from './level.json';

type Placed = { x: number; z: number; rotation: number };

export type LevelObject = Placed &
	(
		| { type: 'ramp'; run: number; height: number; width: number; color: string }
		| { type: 'quarterpipe'; radius: number; width: number; color: string }
		| { type: 'block'; width: number; height: number; depth: number; color: string }
		| { type: 'tree'; scale: number; pink: boolean }
		| { type: 'bush'; color: string }
	);

export type Level = {
	spawn: { x: number; z: number };
	esplanades: Record<'work' | 'projects' | 'hobbies', { x: number; z: number; radius: number }>;
	spots: Record<string, Placed>;
	objects: LevelObject[];
};

export const level = data as Level;

/** New objects added from the editor. */
export const defaults: LevelObject[] = [
	{ type: 'ramp', x: 0, z: 0, rotation: 0, run: 3, height: 1, width: 4, color: '#f59e0b' },
	{ type: 'quarterpipe', x: 0, z: 0, rotation: 0, radius: 3, width: 8, color: '#38bdf8' },
	{ type: 'block', x: 0, z: 0, rotation: 0, width: 4, height: 0.5, depth: 1, color: '#94a3b8' },
	{ type: 'tree', x: 0, z: 0, rotation: 0, scale: 1, pink: false },
	{ type: 'bush', x: 0, z: 0, rotation: 0, color: '#4ade80' }
];

export const rad = (deg: number) => (deg * Math.PI) / 180;

/** Footprint of an object as a local rectangle [x0, x1, z0, z1] (ramps start at their low edge). */
export function footprint(o: LevelObject): [number, number, number, number] {
	switch (o.type) {
		case 'ramp':
			return [-o.width / 2, o.width / 2, -o.run, 0];
		case 'quarterpipe':
			return [-o.width / 2, o.width / 2, -o.radius - 3, 0];
		case 'block':
			return [-o.width / 2, o.width / 2, -o.depth / 2, o.depth / 2];
		case 'tree':
			return [-1.5 * o.scale, 1.5 * o.scale, -1.5 * o.scale, 1.5 * o.scale];
		case 'bush':
			return [-0.6, 0.6, -0.6, 0.6];
	}
}

/** SVG points of a local rectangle placed at (x, z) and turned like a three.js rotation.y. */
export function corners(x: number, z: number, rotation: number, [x0, x1, z0, z1]: number[]) {
	const t = rad(rotation);
	const c = Math.cos(t);
	const s = Math.sin(t);
	return [
		[x0, z0],
		[x1, z0],
		[x1, z1],
		[x0, z1]
	]
		.map(([lx, lz]) => `${x + lx * c + lz * s},${z - lx * s + lz * c}`)
		.join(' ');
}
