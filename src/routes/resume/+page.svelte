<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import { experiences } from '$lib/content';
	import { cvHref, t, trExperience } from '$lib/i18n.svelte';

	const education = $derived([
		{
			years: t('Aug. 2023 – Jun. 2024', 'Août 2023 – Juin 2024'),
			title: t('Master’s Degree in Computer Science', 'Maîtrise en informatique'),
			school: 'Université du Québec à Chicoutimi (Chicoutimi, Canada)',
			text: t(
				'Specialization in video game development. Double degree with ENSIIE.',
				'Spécialisation en développement de jeux vidéo. Double diplôme avec l’ENSIIE.'
			)
		},
		{
			years: t('Sep. 2021 – Jun. 2023', 'Sept. 2021 – Juin 2023'),
			title: t('Engineering Degree in Computer Science', 'Diplôme d’ingénieur en informatique'),
			school: 'ENSIIE Paris-Saclay (Évry, France)',
			text: t(
				'École Nationale Supérieure d’Informatique pour l’Industrie et l’Entreprise. Specialization in digital interactions, video games and virtual reality.',
				'École Nationale Supérieure d’Informatique pour l’Industrie et l’Entreprise. Spécialisation interactions numériques, jeux vidéo et réalité virtuelle.'
			)
		},
		{
			years: t('Sep. 2019 – Jun. 2021', 'Sept. 2019 – Juin 2021'),
			title: t('Preparatory Classes (PCSI, PC*)', 'Classes préparatoires (PCSI, PC*)'),
			school: 'Lycée Fénelon Sainte-Marie (Paris, France)',
			text: t(
				'Preparatory classes for the selective entrance exams to engineering schools. Mathematics, physics and chemistry.',
				'Classes préparatoires aux grandes écoles. Mathématiques, physique et chimie.'
			)
		},
		{
			years: '2019',
			title: t('Scientific Baccalauréat', 'Baccalauréat scientifique'),
			school: 'Lycée Notre-Dame (Boulogne-Billancourt, France)',
			text: t(
				'Biology, mathematics, physics, chemistry. Specialization in computer science.',
				'Biologie, mathématiques, physique, chimie. Spécialité informatique.'
			)
		}
	]);

	// Level out of 10, drawn as an RPG stat bar.
	const skills = $derived([
		{ name: 'Unity', level: 8 },
		{ name: 'C#', level: 8 },
		{ name: 'Unreal Engine 5', level: 8 },
		{ name: 'C++', level: 7 },
		{ name: 'Blender', level: 7 },
		{
			name: t(
				'Version control & planning (Git, Perforce, Trello)',
				'Gestion de version et planification (Git, Perforce, Trello)'
			),
			level: 8
		}
	]);

	const toolbox = $derived([
		{
			name: t('Languages', 'Langages'),
			items: ['C#', 'C++', 'Python', 'PHP', 'HTML/CSS', 'TypeScript']
		},
		{
			name: t('Engines & frameworks', 'Moteurs et frameworks'),
			items: ['Unity', 'Unreal Engine', 'XR Interaction Toolkit']
		},
		{
			name: t('Tools', 'Outils'),
			items: ['Git', 'Perforce', 'ClickUp', 'Trello', 'Blender', 'Cascadeur']
		},
		{
			name: t('Spoken', 'Langues'),
			items: [
				t('French (native)', 'Français (natif)'),
				t('English (C2)', 'Anglais (C2)'),
				t('Spanish (B2)', 'Espagnol (B2)')
			]
		}
	]);

	const contacts = [
		{ label: 'Email', href: 'mailto:baptistedavidpro92@gmail.com' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/BaptisteDavid' },
		{ label: 'itch.io', href: 'https://itch.io/profile/tite700' }
	];
</script>

<svelte:head><title>{t('Resume', 'CV')} · Baptiste David</title></svelte:head>

<PageTitle
	title={t('Resume', 'CV')}
	quote={t(
		'“A journey of a thousand miles begins with a single step.” – Lao Tzu',
		'« Un voyage de mille lieues commence toujours par un premier pas. » – Lao Tseu'
	)}
/>

<div class="mt-6 text-center">
	<a class="btn-game" href={cvHref()} download>
		{t('Download my resume (PDF) ▼', 'Télécharger mon CV (PDF) ▼')}
	</a>
</div>

<div class="mx-auto grid max-w-6xl gap-6 p-5 lg:grid-cols-[1.3fr_1fr]">
	<div class="space-y-6">
		<section class="panel space-y-5 p-6">
			<div class="flex items-baseline justify-between">
				<h2 class="font-display text-2xl font-bold text-sky-950">
					{t('Experience', 'Expérience')}
				</h2>
				<a href="/work" class="text-sm font-bold text-sky-700 hover:underline"
					>{t('See the games ▶', 'Voir les jeux ▶')}</a
				>
			</div>
			{#each experiences.map(trExperience) as xp (xp.company)}
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
			<h2 class="font-display text-2xl font-bold text-sky-950">{t('Education', 'Formation')}</h2>
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
			<h2 class="font-display text-2xl font-bold text-sky-950">{t('Skills', 'Compétences')}</h2>
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
			<h2 class="font-display text-2xl font-bold text-sky-950">{t('Toolbox', 'Boîte à outils')}</h2>
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
