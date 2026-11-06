<script lang="ts">
	const menu = [
		{ label: '▶ Explore the city', href: '/playground' },
		{ label: 'Work', href: '/work' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Hobbies', href: '/hobbies' },
		{ label: 'Resume', href: '/resume' }
	];
</script>

<div class="flex flex-col items-center px-5 pt-24 text-center lg:pt-32">
	<h1 class="font-display text-5xl font-bold text-sky-950 drop-shadow-[3px_3px_0_#fff] lg:text-6xl">
		Welcome aboard captain!
	</h1>
	<p class="mt-4 text-xl text-sky-900">I’m Baptiste David, a game developer.</p>

	<nav class="mt-10 flex w-full max-w-xs flex-col gap-3">
		{#each menu as item (item.href)}
			<a href={item.href} class="btn-game justify-center py-3 text-lg">{item.label}</a>
		{/each}
	</nav>
</div>
