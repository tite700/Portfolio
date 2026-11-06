<script lang="ts">
	// Faceted low-poly sky behind every page: a jittered grid cut into triangles.
	const COLS = 14;
	const ROWS = 9;
	const W = 1400;
	const H = 900;

	// Deterministic pseudo-random so server and browser draw the same sky.
	let seed = 11;
	const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

	const points = Array.from({ length: ROWS + 1 }, (_, r) =>
		Array.from({ length: COLS + 1 }, (_, c) => {
			const edge = r === 0 || c === 0 || r === ROWS || c === COLS;
			const j = edge ? 0 : 0.7;
			return [(c + (rand() - 0.5) * j) * (W / COLS), (r + (rand() - 0.5) * j) * (H / ROWS)];
		})
	);

	const triangles: { d: string; fill: string }[] = [];
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const [a, b, cc, d] = [
				points[r][c],
				points[r][c + 1],
				points[r + 1][c + 1],
				points[r + 1][c]
			];
			for (const tri of [
				[a, b, cc],
				[a, cc, d]
			]) {
				// Light sky blue at the top, almost white at the bottom, each facet a bit off.
				const l = 72 + (r / ROWS) * 20 + (rand() - 0.5) * 6;
				triangles.push({
					d: `M${tri.map((p) => p.join(',')).join('L')}Z`,
					fill: `hsl(203 90% ${l}%)`
				});
			}
		}
	}
</script>

<svg
	class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="none"
	aria-hidden="true"
>
	{#each triangles as t, i (i)}
		<path d={t.d} fill={t.fill} stroke={t.fill} stroke-width="1" />
	{/each}
</svg>
