<script lang="ts">
	import { game } from './game/state.svelte';

	// Touch joystick writing to game.stick. Inside the dashed ring (30 %) you walk,
	// beyond it you skate (handled by the player).
	const SIZE = 128;
	const R = SIZE / 2;

	let base = $state<HTMLDivElement>();
	let id: number | null = null;

	function move(e: PointerEvent) {
		if (e.pointerId !== id || !base) return;
		const box = base.getBoundingClientRect();
		let x = (e.clientX - box.left - R) / R;
		let y = (e.clientY - box.top - R) / R;
		const d = Math.hypot(x, y);
		if (d > 1) {
			x /= d;
			y /= d;
		}
		game.stick.x = x;
		game.stick.y = y;
	}
	function start(e: PointerEvent) {
		id = e.pointerId;
		base!.setPointerCapture(id);
		game.stick.active = true;
		move(e);
	}
	function end(e: PointerEvent) {
		if (e.pointerId !== id) return;
		id = null;
		game.stick.x = game.stick.y = 0;
		game.stick.active = false;
	}
</script>

<div
	bind:this={base}
	class="relative touch-none rounded-full border-4 border-white/70 bg-sky-900/30"
	style="width: {SIZE}px; height: {SIZE}px"
	role="slider"
	aria-label="Joystick"
	aria-valuenow={Math.round(Math.hypot(game.stick.x, game.stick.y) * 100)}
	tabindex="-1"
	onpointerdown={start}
	onpointermove={move}
	onpointerup={end}
	onpointercancel={end}
>
	<div
		class="pointer-events-none absolute rounded-full border-2 border-dashed border-white/70"
		style="inset: {R * 0.7}px"
	></div>
	<div
		class="pointer-events-none absolute h-14 w-14 rounded-full border-2 border-sky-900 bg-gradient-to-b from-yellow-200 to-yellow-400 shadow-lg"
		style="left: {R - 28 + game.stick.x * R}px; top: {R - 28 + game.stick.y * R}px"
	></div>
</div>
