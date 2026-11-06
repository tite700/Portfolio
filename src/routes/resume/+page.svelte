<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import { experiences } from '$lib/content';

	const education = [
		{
			years: 'Aug. 2023 – Jun. 2024',
			title: 'Master’s Degree in Computer Science',
			school: 'Université du Québec à Chicoutimi (Chicoutimi, Canada)',
			text: 'Specialization in video game development. Double degree with ENSIIE.'
		},
		{
			years: 'Sept. 2021 – Jun. 2023',
			title: 'Engineering Degree in Computer Science',
			school: 'ENSIIE Paris-Saclay (Évry, France)',
			text: 'École Nationale Supérieure d’Informatique pour l’Industrie et l’Entreprise. Specialization in digital interactions, video games and virtual reality.'
		},
		{
			years: 'Sept. 2019 – Jun. 2021',
			title: 'Preparatory Classes (PCSI, PC*)',
			school: 'Lycée Fénelon Sainte-Marie (Paris, France)',
			text: 'Preparatory classes for the selective entrance exams to engineering schools. Mathematics, physics and chemistry.'
		},
		{
			years: '2019',
			title: 'Scientific Baccalauréat',
			school: 'Lycée Notre-Dame (Boulogne-Billancourt, France)',
			text: 'Biology, mathematics, physics, chemistry. Specialization in computer science.'
		}
	];

	// Level out of 10, drawn as an RPG stat bar.
	const skills = [
		{ name: 'Unity', level: 8 },
		{ name: 'C#', level: 8 },
		{ name: 'Unreal Engine 5', level: 8 },
		{ name: 'C++', level: 7 },
		{ name: 'Blender', level: 7 },
		{ name: 'Version control & planning (Git, Perforce, Trello)', level: 8 }
	];

	const toolbox = [
		{ name: 'Languages', items: ['C#', 'C++', 'Python', 'PHP', 'HTML/CSS', 'TypeScript'] },
		{ name: 'Engines & frameworks', items: ['Unity', 'Unreal Engine', 'XR Interaction Toolkit'] },
		{ name: 'Tools', items: ['Git', 'Perforce', 'ClickUp', 'Trello', 'Blender', 'Cascadeur'] },
		{ name: 'Spoken', items: ['French (native)', 'English (C2)', 'Spanish (B2)'] }
	];

	const contacts = [
		{ label: 'Email', href: 'mailto:baptistedavidpro92@gmail.com' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/baptiste-david-851a88231/' },
		{ label: 'itch.io', href: 'https://itch.io/profile/tite700' }
	];
</script>

<svelte:head><title>Resume · Baptiste David</title></svelte:head>

<PageTitle
	title="Resume"
	quote="“A journey of a thousand miles begins with a single step.” – Lao Tzu"
/>

<div class="mt-6 text-center">
	<a class="btn-game" href="/cv/Baptiste_David_CV.pdf" download>Download my CV (PDF) ▼</a>
</div>

<div class="mx-auto grid max-w-6xl gap-6 p-5 lg:grid-cols-[1.3fr_1fr]">
	<div class="space-y-6">
		<section class="panel space-y-5 p-6">
			<div class="flex items-baseline justify-between">
				<h2 class="font-display text-2xl font-bold text-sky-950">Experience</h2>
				<a href="/work" class="text-sm font-bold text-sky-700 hover:underline">See the games ▶</a>
			</div>
			{#each experiences as xp (xp.company)}
				<div class="border-l-4 border-orange-400 pl-4">
					<span class="chip">{xp.dates}</span>
					<h3 class="mt-1 font-display text-xl font-bold">{xp.company}</h3>
					<p class="text-sm font-semibold text-sky-700">{xp.role} · {xp.place}</p>
					<ul class="mt-1 list-disc pl-5 text-slate-600">
						{#each xp.points as point (point)}
							<li>{point}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>

		<section class="panel space-y-5 p-6">
			<h2 class="font-display text-2xl font-bold text-sky-950">Education</h2>
			{#each education as e (e.title)}
				<div class="border-l-4 border-sky-400 pl-4">
					<span class="chip">{e.years}</span>
					<h3 class="mt-1 font-display text-xl font-bold">{e.title}</h3>
					<p class="text-sm font-semibold text-sky-700">{e.school}</p>
					<p class="mt-1 text-slate-600">{e.text}</p>
				</div>
			{/each}
		</section>
	</div>

	<div class="space-y-6">
		<section class="panel space-y-4 p-6">
			<h2 class="font-display text-2xl font-bold text-sky-950">Skills</h2>
			{#each skills as s (s.name)}
				<div>
					<p class="text-sm font-semibold">{s.name}</p>
					<div class="mt-1 flex gap-1" title="{s.level}/10">
						{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
							<span
								class="h-4 flex-1 -skew-x-[20deg] border border-sky-800/30 {i < s.level
									? 'bg-gradient-to-b from-yellow-300 to-orange-400'
									: 'bg-sky-100'}"
							></span>
						{/each}
					</div>
				</div>
			{/each}
		</section>

		<section class="panel space-y-3 p-6">
			<h2 class="font-display text-2xl font-bold text-sky-950">Toolbox</h2>
			{#each toolbox as group (group.name)}
				<div>
					<p class="text-sm font-semibold">{group.name}</p>
					<div class="mt-1 flex flex-wrap gap-1">
						{#each group.items as item (item)}
							<span class="chip">{item}</span>
						{/each}
					</div>
				</div>
			{/each}
		</section>

		<section class="panel space-y-3 p-6">
			<h2 class="font-display text-2xl font-bold text-sky-950">Contact</h2>
			<div class="flex flex-wrap gap-3">
				{#each contacts as c (c.label)}
					<a class="btn-game" href={c.href} target="_blank" rel="noopener">{c.label} ↗</a>
				{/each}
			</div>
		</section>
	</div>
</div>
