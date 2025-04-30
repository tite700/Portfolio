<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	// @ts-ignore : Ignore l'erreur TypeScript car ce module n'a pas de types définis
	import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		// === Initialisation ===
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x202020);

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.y = 1.6; // Hauteur du joueur (debout)

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);

		// === Lumière ===
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 10, 5);
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x404040); // lumière douce
		scene.add(ambientLight);

		

		// === Sol ===
		const floorGeometry = new THREE.PlaneGeometry(100, 100);
		const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);

		// === Cube de test (à ne pas traverser) ===
		const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
		const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(0, 1, -5); // centré à hauteur 1
		cube.castShadow = true;
		cube.receiveShadow = true;
		scene.add(cube);

		// === Contrôle caméra (FPS) ===
		const controls = new PointerLockControls(camera, canvas);
		scene.add(controls.getObject());

		canvas.addEventListener('click', () => {
			controls.lock();
		});

		// === Variables de mouvement ===
		const velocity = new THREE.Vector3(); // Déplacement horizontal
		let velocityY = 0; // Vitesse verticale
		const direction = new THREE.Vector3(); // Direction souhaitée
		const move = { forward: false, backward: false, left: false, right: false };

		

		let canJump = false;

		// === Gestion clavier ===
		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': move.forward = true; break;
				case 'KeyS': move.backward = true; break;
				case 'KeyA': move.left = true; break;
				case 'KeyD': move.right = true; break;
				case 'Space':
					if (canJump) {
						velocityY = 5; // Force du saut
						canJump = false;
					}
					break;
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
		const gravity = 9.8;
		const playerHeight = 1.6;

		// === Boucle d'animation ===
		const animate = () => {
			requestAnimationFrame(animate);

			const delta = clock.getDelta();
			velocity.set(0, 0, 0);

			// Direction horizontale
			direction.z = Number(move.forward) - Number(move.backward);
			direction.x = Number(move.right) - Number(move.left);
			direction.normalize();

			const speed = 5;
			if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
			if (move.left || move.right) velocity.x -= direction.x * speed * delta;

			// Appliquer les mouvements horizontaux
			controls.moveRight(-velocity.x);
			controls.moveForward(-velocity.z);

			// Appliquer la gravité
			velocityY -= gravity * delta;

			const position = controls.getObject().position;
			position.y += velocityY * delta;

			// Ajout : collision AABB AVANT mouvement
			const nextPosition = position.clone();
			nextPosition.x += -velocity.x * delta;
			nextPosition.z += -velocity.z * delta;

			const playerBoxNext = new THREE.Box3().setFromCenterAndSize(
			new THREE.Vector3(nextPosition.x, nextPosition.y - playerHeight / 2, nextPosition.z),
			new THREE.Vector3(0.5, playerHeight, 0.5)
			);



			// Vérifie si le joueur est au sol
			const raycaster = new THREE.Raycaster(position, new THREE.Vector3(0, -1, 0));
			const intersects = raycaster.intersectObject(floor);
			if (intersects.length > 0 && intersects[0].distance < playerHeight) {
				velocityY = 0;
				position.y = intersects[0].point.y + playerHeight;
				canJump = true;
			} else {
				canJump = false;
			}

			// Collision simple avec le cube (AABB)
			const playerBox = new THREE.Box3().setFromCenterAndSize(
				new THREE.Vector3(position.x, position.y - playerHeight / 2, position.z),
				new THREE.Vector3(0.5, playerHeight, 0.5)
			);
			const cubeBox = new THREE.Box3().setFromObject(cube);

			// Si pas de collision, appliquer mouvement
			if (!playerBoxNext.intersectsBox(cubeBox)) {
				controls.moveRight(-velocity.x);
				controls.moveForward(-velocity.z);
			}

			renderer.render(scene, camera);
		};

		animate();

		// === Responsive ===
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
	});
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas bind:this={canvas} style="width: 100vw; height: 100vh; display: block;" />
