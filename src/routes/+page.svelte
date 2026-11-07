<script lang="ts">
	import { sectionTitle, t } from '$lib/i18n.svelte';

	const menu = $derived([
		{ label: t('▶ Explore the city', '▶ Explorer la ville'), href: '/playground' },
		{ label: sectionTitle('work'), href: '/work' },
		{ label: sectionTitle('projects'), href: '/projects' },
		{ label: sectionTitle('hobbies'), href: '/hobbies' },
		{ label: t('Resume', 'CV'), href: '/resume' }
	]);
</script>

<div class="flex flex-col items-center px-5 pt-24 text-center lg:pt-32">
	<h1 class="font-display text-5xl font-bold text-sky-950 drop-shadow-[3px_3px_0_#fff] lg:text-6xl">
		{t('Welcome aboard captain!', 'Bienvenue à bord, capitaine !')}
	</h1>
	<p class="mt-4 text-xl text-sky-900">
		{t(
			'I’m Baptiste David, a game developer.',
			'Je suis Baptiste David, développeur de jeux vidéo.'
		)}
	</p>

	<nav class="mt-10 flex w-full max-w-xs flex-col gap-3">
		{#each menu as item (item.href)}
			<a href={item.href} class="btn-game justify-center py-3 text-lg">{item.label}</a>
		{/each}
	</nav>
</div>
