<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { RigidBody, Collider, useRapier, usePhysicsTask } from '@threlte/rapier';
	import {
		CoefficientCombineRule,
		type RigidBody as RapierRigidBody
	} from '@dimforge/rapier3d-compat';
	import { Group, Object3D, PerspectiveCamera, Vector3 } from 'three';
	import Box from './box.svelte';
	import Character from './character.svelte';
	import { game } from './state.svelte';
	import { spots } from '$lib/content';

	type Vec3 = [number, number, number];

	let { spawn = [0, 1, 12] as Vec3 }: { spawn?: Vec3 } = $props();

	// --- Tuning ---
	const WALK_SPEED = 5.5;
	const SKATE_PUSH = 10; // m/s² while holding a direction
	const SKATE_MAX = 15;
	const SKATE_TURN = 2.8; // rad/s
	const JUMP_SPEED = 7.5;
	const MOUSE_SENSITIVITY = 0.0025;
	const HALF_HEIGHT = 0.45;
	const RADIUS = 0.35;
	const FOOT = HALF_HEIGHT + RADIUS; // body center to feet

	const { renderer } = useThrelte();
	const { world, rapier } = useRapier();

	let body = $state<RapierRigidBody>();
	let camera = $state<PerspectiveCamera>();
	let visual = $state<Group>();
	const lightTarget = new Object3D();

	// Camera orbit around the player.
	let yaw = 0;
	let pitch = 0.3;
	let distance = 7;
	let camDistance = distance;
	const target = new Vector3(...spawn);

	let heading = Math.PI; // facing direction: (sin, cos) → starts toward -z
	let grounded = false;
	const anim = { speed: 0, skating: false, grounded: true };

	// event.code = physical key, so ZQSD (AZERTY) and WASD (QWERTY) both work.
	const keys = new Set<string>();
	let jumpQueued = false;
	const pressed = (...codes: string[]) => codes.some((c) => keys.has(c));

	const tmpV = new Vector3();

	// Rotate angle `a` toward `b` by at most `step`.
	function turnToward(a: number, b: number, step: number) {
		const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
		return a + Math.max(-step, Math.min(step, diff));
	}

	function respawn() {
		// Back to the plaza in the middle of the city, facing north.
		body?.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true);
		body?.setLinvel({ x: 0, y: 0, z: 0 }, true);
		body?.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
		body?.setAngvel({ x: 0, y: 0, z: 0 }, true);
		heading = Math.PI;
		yaw = 0;
		target.set(...spawn);
	}

	usePhysicsTask((dt) => {
		if (!body) return;
		const p = body.translation();
		if (p.y < -10) return respawn();

		const hit = world.castRayAndGetNormal(
			new rapier.Ray(p, { x: 0, y: -1, z: 0 }),
			FOOT + 0.25,
			true,
			undefined,
			undefined,
			undefined,
			body
		);
		grounded = !!hit && hit.normal.y > 0.3;

		// Input direction relative to the camera, on the ground plane.
		const fwd = (pressed('KeyW', 'ArrowUp') ? 1 : 0) - (pressed('KeyS', 'ArrowDown') ? 1 : 0);
		const right = (pressed('KeyD', 'ArrowRight') ? 1 : 0) - (pressed('KeyA', 'ArrowLeft') ? 1 : 0);
		let ix = -Math.sin(yaw) * fwd + Math.cos(yaw) * right;
		let iz = -Math.cos(yaw) * fwd - Math.sin(yaw) * right;
		const len = Math.hypot(ix, iz);
		if (len) {
			ix /= len;
			iz /= len;
		}

		let { x: vx, y: vy, z: vz } = body.linvel();

		if (game.skating) {
			// Split velocity along the board (f) and sideways (l).
			let hx = Math.sin(heading);
			let hz = Math.cos(heading);
			let f = vx * hx + vz * hz;
			let l = vx * hz - vz * hx;
			if (len) {
				const braking = ix * hx + iz * hz < -0.7 && Math.abs(f) > 1;
				if (braking) f *= Math.exp(-3 * dt);
				else {
					heading = turnToward(heading, Math.atan2(ix, iz), SKATE_TURN * dt);
					if (grounded && f < SKATE_MAX) f += SKATE_PUSH * dt;
				}
			}
			if (grounded) {
				// Wheels: kill sideways slide and carve velocity with the board.
				l *= Math.exp(-10 * dt);
				f *= Math.exp(-0.15 * dt);
				hx = Math.sin(heading);
				hz = Math.cos(heading);
				vx = hx * f + hz * l;
				vz = hz * f - hx * l;
			}
		} else {
			const a = 1 - Math.exp(-(grounded ? 14 : 3) * dt);
			vx += (ix * WALK_SPEED - vx) * a;
			vz += (iz * WALK_SPEED - vz) * a;
			if (len) heading = turnToward(heading, Math.atan2(ix, iz), 12 * dt);
		}

		if (jumpQueued) {
			jumpQueued = false;
			if (grounded) vy = JUMP_SPEED;
		}
		body.setLinvel({ x: vx, y: vy, z: vz }, true);

		anim.speed = Math.hypot(vx, vz);
		anim.skating = game.skating;
		anim.grounded = grounded;
	});

	useTask((dt) => {
		if (!body || !camera || !visual) return;
		const p = body.translation();

		// Only turn around the vertical axis: the character never tips over.
		visual.rotation.y = heading;

		// Third-person camera, pulled in when a wall is in the way.
		target.lerp(tmpV.set(p.x, p.y + 0.6, p.z), 1 - Math.exp(-12 * dt));
		const cp = Math.cos(pitch);
		const dir = { x: cp * Math.sin(yaw), y: Math.sin(pitch), z: cp * Math.cos(yaw) };
		const hit = world.castRay(
			new rapier.Ray(target, dir),
			distance,
			true,
			undefined,
			undefined,
			undefined,
			body
		);
		const wanted = hit ? Math.max(0.8, hit.timeOfImpact - 0.3) : distance;
		camDistance = wanted < camDistance ? wanted : camDistance + (wanted - camDistance) * 0.1;
		camera.position.set(
			target.x + dir.x * camDistance,
			target.y + dir.y * camDistance,
			target.z + dir.z * camDistance
		);
		camera.lookAt(target);

		// Shadows follow the player.
		lightTarget.position.set(p.x, p.y, p.z);

		// Nearest interactive spot in range.
		let near: string | null = null;
		let best = Infinity;
		for (const { slug, poi } of spots) {
			const d = Math.hypot(p.x - poi.position[0], p.z - poi.position[2]);
			if (d < Math.max(poi.size[0], poi.size[2]) / 2 + 2.5 && d < best) {
				near = slug;
				best = d;
			}
		}
		if (game.nearSlug !== near) game.nearSlug = near;
	});

	function onkeydown(e: KeyboardEvent) {
		if (game.openSlug) return;
		if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
			e.preventDefault();
		}
		if (!e.repeat) {
			if (e.code === 'Space') jumpQueued = true;
			if (e.key === 'Shift') game.skating = !game.skating;
			if (e.code === 'KeyR') respawn();
		}
		keys.add(e.code);
	}

	function onmousemove(e: MouseEvent) {
		if (document.pointerLockElement !== renderer.domElement) return;
		yaw -= e.movementX * MOUSE_SENSITIVITY;
		pitch = Math.min(1.3, Math.max(-0.1, pitch + e.movementY * MOUSE_SENSITIVITY));
	}

	$effect(() => {
		const canvas = renderer.domElement;
		// Left click: open the nearby project, otherwise grab the mouse.
		const down = (e: MouseEvent) => {
			if (e.button !== 0 || game.openSlug) return;
			if (game.nearSlug) {
				game.openSlug = game.nearSlug;
				keys.clear();
				document.exitPointerLock();
			} else canvas.requestPointerLock();
		};
		const wheel = (e: WheelEvent) => {
			e.preventDefault();
			distance = Math.min(14, Math.max(3, distance + e.deltaY * 0.01));
		};
		canvas.addEventListener('mousedown', down);
		canvas.addEventListener('wheel', wheel, { passive: false });
		return () => {
			canvas.removeEventListener('mousedown', down);
			canvas.removeEventListener('wheel', wheel);
		};
	});
</script>

<svelte:window
	{onkeydown}
	onkeyup={(e) => keys.delete(e.code)}
	{onmousemove}
	onblur={() => keys.clear()}
/>

<T.PerspectiveCamera makeDefault fov={60} near={0.1} far={300} bind:ref={camera} />

<!-- Light is a child of its target so shadows follow the player. -->
<T is={lightTarget}>
	<T.DirectionalLight
		target={lightTarget}
		position={[20, 40, 15]}
		intensity={2.2}
		castShadow
		shadow.mapSize={[2048, 2048]}
		shadow.camera.left={-30}
		shadow.camera.right={30}
		shadow.camera.top={30}
		shadow.camera.bottom={-30}
		shadow.camera.far={120}
		shadow.bias={-0.0005}
	/>
</T>

<T.Group position={spawn}>
	<!-- enabledRotations, not lockRotations: threlte applies enabledRotations
	     (default all true) after lockRotations, which silently unlocks them. -->
	<RigidBody bind:rigidBody={body} enabledRotations={[false, false, false]} ccd canSleep={false}>
		<Collider
			shape="capsule"
			args={[HALF_HEIGHT, RADIUS]}
			friction={0}
			frictionCombineRule={CoefficientCombineRule.Min}
		/>
		<T.Group position.y={-FOOT} bind:ref={visual}>
			{#if game.skating}
				<!-- Skateboard -->
				<Box size={[0.32, 0.05, 0.95]} position={[0, 0.12, 0]} color="#f97316" />
				{#each [-0.33, 0.33] as z (z)}
					<Box size={[0.34, 0.08, 0.1]} position={[0, 0.05, z]} color="#f8fafc" />
				{/each}
			{/if}
			<T.Group position.y={game.skating ? 0.15 : 0} rotation.y={game.skating ? -1.2 : 0}>
				<Character {anim} />
			</T.Group>
		</T.Group>
	</RigidBody>
</T.Group>
