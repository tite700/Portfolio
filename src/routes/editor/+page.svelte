<script lang="ts">
	import LevelMap from '$lib/components/level-map.svelte';
	import { spots } from '$lib/content';
	import { defaults, level, type Level } from '$lib/level';

	// Level editor: drag things on the top-down map, tweak them in the side panel,
	// then save to write src/lib/level.json (the playground reloads by itself).

	// Spots not placed yet get the position the city gives them.
	const initial = structuredClone(level);
	for (const s of spots) {
		initial.spots[s.slug] ??= {
			x: Math.round(s.poi.position[0] * 10) / 10,
			z: Math.round(s.poi.position[2] * 10) / 10,
			rotation: Math.round((s.poi.rotationY * 180) / Math.PI)
		};
	}
	let lv = $state<Level>(initial);

	let selected = $state<string | null>(null);
	let view = $state({ x: -70, y: -70, w: 140, h: 140 });
	let dirty = $state(false);
	let status = $state('');
	let svg = $state<SVGSVGElement>();
	const history: string[] = [];

	function snapshot() {
		history.push(JSON.stringify(lv));
		if (history.length > 100) history.shift();
		dirty = true;
	}
	function undo() {
		const prev = history.pop();
		if (prev) lv = JSON.parse(prev);
	}

	// The editable thing behind an id from LevelMap.
	type Target = { x: number; z: number; rotation?: number } & Record<string, unknown>;
	function target(id: string): Target {
		const [kind, key] = id.split(':');
		if (kind === 'spawn') return lv.spawn;
		if (kind === 'esplanade') return lv.esplanades[key as keyof Level['esplanades']];
		if (kind === 'spot') return lv.spots[key];
		return lv.objects[+key] as Target;
	}
	const current = $derived(selected ? target(selected) : null);
	const title = $derived.by(() => {
		if (!selected) return '';
		const [kind, key] = selected.split(':');
		if (kind === 'spot') return spots.find((s) => s.slug === key)?.title;
		if (kind === 'object') return lv.objects[+key].type;
		return kind === 'esplanade' ? `${key} esplanade` : 'Spawn';
	});

	// Pointer: drag elements (snapped to 0.5 m, Alt for 0.1 m), drag the background to pan.
	const snap = (v: number, e: PointerEvent) =>
		e.altKey ? Math.round(v * 10) / 10 : Math.round(v * 2) / 2;
	function toWorld(e: PointerEvent | WheelEvent) {
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg!.getScreenCTM()!.inverse());
		return { x: p.x, z: p.y };
	}
	let drag: { id: string; dx: number; dz: number; started: boolean } | null = null;
	let pan: { cx: number; cy: number; x: number; y: number } | null = null;

	function onpick(id: string, e: PointerEvent) {
		e.stopPropagation();
		selected = id;
		const p = toWorld(e);
		const t = target(id);
		drag = { id, dx: t.x - p.x, dz: t.z - p.z, started: false };
		svg!.setPointerCapture(e.pointerId);
	}
	function onpointerdown(e: PointerEvent) {
		selected = null;
		pan = { cx: e.clientX, cy: e.clientY, x: view.x, y: view.y };
		svg!.setPointerCapture(e.pointerId);
	}
	function onpointermove(e: PointerEvent) {
		if (drag) {
			const p = toWorld(e);
			const t = target(drag.id);
			const x = snap(p.x + drag.dx, e);
			const z = snap(p.z + drag.dz, e);
			if (x === t.x && z === t.z) return;
			if (!drag.started) snapshot();
			drag.started = true;
			// An esplanade carries its spots along.
			const [kind, key] = drag.id.split(':');
			if (kind === 'esplanade') {
				for (const s of spots.filter((s) => s.section === key)) {
					lv.spots[s.slug].x += x - t.x;
					lv.spots[s.slug].z += z - t.z;
				}
			}
			t.x = x;
			t.z = z;
		} else if (pan) {
			const scale = view.w / svg!.clientWidth;
			view.x = pan.x - (e.clientX - pan.cx) * scale;
			view.y = pan.y - (e.clientY - pan.cy) * scale;
		}
	}
	function onwheel(e: WheelEvent) {
		e.preventDefault();
		const p = toWorld(e);
		const f = Math.min(4, Math.max(0.25, Math.exp(e.deltaY * 0.001)));
		const w = Math.min(300, Math.max(15, view.w * f));
		const k = w / view.w;
		view = { x: p.x - (p.x - view.x) * k, y: p.z - (p.z - view.y) * k, w, h: w };
	}

	function add(type: string) {
		snapshot();
		const def = defaults.find((d) => d.type === type)!;
		const x = Math.round(view.x + view.w / 2);
		const z = Math.round(view.y + view.h / 2);
		lv.objects.push({ ...structuredClone(def), x, z });
		selected = `object:${lv.objects.length - 1}`;
	}
	function remove() {
		if (!selected?.startsWith('object:')) return;
		snapshot();
		lv.objects.splice(+selected.split(':')[1], 1);
		selected = null;
	}
	function duplicate() {
		if (!selected?.startsWith('object:')) return;
		snapshot();
		const o = lv.objects[+selected.split(':')[1]];
		lv.objects.push({ ...$state.snapshot(o), x: o.x + 2, z: o.z + 2 });
		selected = `object:${lv.objects.length - 1}`;
	}
	function rotate(step: number) {
		if (current?.rotation === undefined) return;
		snapshot();
		current.rotation = ((((current.rotation + step) % 360) + 540) % 360) - 180;
	}

	async function save() {
		status = 'Saving…';
		const res = await fetch('/editor/', { method: 'POST', body: JSON.stringify(lv) });
		status = res.ok ? 'Saved ✓' : `Error ${res.status}`;
		if (res.ok) dirty = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement) return;
		const ctrl = e.ctrlKey || e.metaKey;
		if (ctrl && e.key === 's') save();
		else if (ctrl && e.key === 'z') undo();
		else if (ctrl && e.key === 'd') duplicate();
		else if (e.key === 'r' || e.key === 'R') rotate(e.shiftKey ? -15 : 15);
		else if (e.key === 'Delete' || e.key === 'Backspace') remove();
		else if (e.key === 'Escape') selected = null;
		else return;
		e.preventDefault();
	}

	// Side panel inputs edit any field of the selection, by type.
	const fields = $derived(current ? Object.entries(current).filter(([k]) => k !== 'type') : []);
	function set(key: string, value: unknown) {
		if (current) current[key] = value;
	}
</script>

<svelte:head><title>Level editor · Baptiste David</title></svelte:head>
<svelte:window {onkeydown} onbeforeunload={(e) => dirty && e.preventDefault()} />

<div class="grid h-[calc(100vh-5.5rem)] grid-cols-1 gap-4 px-4 pb-4 lg:grid-cols-[1fr_20rem]">
	<div class="panel relative overflow-hidden p-0">
		<svg
			bind:this={svg}
			viewBox="{view.x} {view.y} {view.w} {view.h}"
			class="h-full w-full touch-none select-none"
			role="application"
			aria-label="Level map"
			{onpointerdown}
			{onpointermove}
			onpointerup={() => (drag = pan = null)}
			{onwheel}
		>
			<LevelMap level={lv} {selected} labels {onpick} />
			<defs>
				<pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
					<path
						d="M4 0H0V4"
						fill="none"
						stroke="#0f172a"
						stroke-opacity="0.15"
						stroke-width="0.08"
					/>
				</pattern>
			</defs>
			<rect
				x="-80"
				y="-80"
				width="160"
				height="160"
				fill="url(#grid)"
				class="pointer-events-none"
			/>
		</svg>
		<p class="chip pointer-events-none absolute bottom-3 left-3">
			Drag: move (Alt: fine) · Wheel: zoom · R / Shift+R: rotate · Del: delete · Ctrl+D: duplicate ·
			Ctrl+Z: undo · Ctrl+S: save
		</p>
	</div>

	<aside class="panel flex flex-col gap-4 overflow-y-auto p-4">
		<div class="flex items-center gap-2">
			<button class="btn-game" onclick={save}>Save</button>
			<span class="text-sm font-semibold text-sky-700">{dirty ? 'Unsaved changes' : status}</span>
		</div>
		<a href="/playground" target="_blank" class="text-sm font-bold text-sky-700 hover:underline">
			Test in the playground ↗
		</a>

		<div>
			<h2 class="font-display text-lg font-bold">Add</h2>
			<div class="mt-1 flex flex-wrap gap-2">
				{#each defaults as d (d.type)}
					<button class="chip hover:bg-yellow-200" onclick={() => add(d.type)}>+ {d.type}</button>
				{/each}
			</div>
		</div>

		{#if current}
			<div class="space-y-2">
				<h2 class="font-display text-lg font-bold capitalize">{title}</h2>
				{#each fields as [key, value] (key)}
					<label class="flex items-center justify-between gap-2 text-sm">
						<span class="font-semibold">{key}</span>
						{#if typeof value === 'boolean'}
							<input
								type="checkbox"
								checked={value}
								onchange={(e) => (snapshot(), set(key, e.currentTarget.checked))}
							/>
						{:else if typeof value === 'string'}
							<input
								type="color"
								{value}
								onfocus={snapshot}
								oninput={(e) => set(key, e.currentTarget.value)}
							/>
						{:else}
							<input
								type="number"
								step={key === 'rotation' ? 15 : 0.5}
								{value}
								class="w-24 rounded border px-2 py-0.5"
								onfocus={snapshot}
								oninput={(e) => set(key, +e.currentTarget.value)}
							/>
						{/if}
					</label>
				{/each}
				{#if selected?.startsWith('object:')}
					<div class="flex gap-2 pt-2">
						<button class="chip hover:bg-yellow-200" onclick={duplicate}>Duplicate</button>
						<button class="chip hover:bg-red-200" onclick={remove}>Delete</button>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-slate-600">
				Click an element to select it. Spots, esplanades (they carry their spots), the spawn and
				objects can be dragged. Lamps and signs follow their esplanade.
			</p>
		{/if}
	</aside>
</div>
