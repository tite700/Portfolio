<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
    // @ts-ignore
	import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		// Init scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x202020);

		// Camera placée à 1.6m du sol (comme un humain debout)
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.y = 1.6;

		// Renderer lié à notre <canvas> Svelte
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);

		// Lumière directionnelle
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 10, 5);
		scene.add(light);

		// Sol
		const floorGeometry = new THREE.PlaneGeometry(100, 100);
		const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		scene.add(floor);

		// Un cube pour voir qu'on bouge
		const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
		const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(0, 0.5, -5); // devant la caméra
		scene.add(cube);

		// Controls FPS
		const controls = new PointerLockControls(camera, canvas);
		scene.add(controls.getObject());

		canvas.addEventListener('click', () => {
			controls.lock();
		});

		// Mouvements clavier
		const velocity = new THREE.Vector3();
		const direction = new THREE.Vector3();
		const move = { forward: false, backward: false, left: false, right: false };

		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': move.forward = true; break;
				case 'KeyS': move.backward = true; break;
				case 'KeyA': move.left = true; break;
				case 'KeyD': move.right = true; break;
			}
		};
		const onKeyUp = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': move.forward = false; break;
				case 'KeyS': move.backward = false; break;
				case 'KeyA': move.left = false; break;
				case 'KeyD': move.right = false; break;
			}
		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);

		const clock = new THREE.Clock();
		const animate = () => {
			requestAnimationFrame(animate);

			const delta = clock.getDelta();
			velocity.set(0, 0, 0);

			direction.z = Number(move.forward) - Number(move.backward);
			direction.x = Number(move.right) - Number(move.left);
			direction.normalize();

			const speed = 5;
			if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
			if (move.left || move.right) velocity.x -= direction.x * speed * delta;

			controls.moveRight(-velocity.x);
			controls.moveForward(-velocity.z);

			renderer.render(scene, camera);
		};

		animate();

		// Resize
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
	});
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas bind:this={canvas} style="width: 100vw; height: 100vh; display: block;" />
