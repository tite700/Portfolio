<script lang="ts">
	import '../../app.css';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { i18n, sectionTitle, setLang, t } from '$lib/i18n.svelte';

	const links = $derived([
		{ href: '/playground', label: 'Playground' },
		{ href: '/work', label: sectionTitle('work') },
		{ href: '/projects', label: sectionTitle('projects') },
		{ href: '/hobbies', label: sectionTitle('hobbies') },
		{ href: '/resume', label: t('Resume', 'CV') }
	]);
</script>

<Menubar.Root>
	<Menubar.Menu>
		<div class="flex justify-start">
			<a href="/">
				<Menubar.Trigger>Portfolio</Menubar.Trigger>
			</a>
		</div>

		<div class="ml-auto flex flex-1 justify-end sm:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger aria-label="Menu">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-7 w-7"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16 M4 12h16 M4 18h16"
						/></svg
					>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading>Portfolio</DropdownMenu.GroupHeading>
						<DropdownMenu.Separator />
						{#each links as link (link.href)}
							<a href={link.href}>
								<DropdownMenu.Item>{link.label}</DropdownMenu.Item>
							</a>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		<div class="ml-auto hidden flex-1 justify-end sm:flex">
			{#each links as link (link.href)}
				<a href={link.href}>
					<Menubar.Trigger>{link.label}</Menubar.Trigger>
				</a>
			{/each}
		</div>

		<!-- Language switch -->
		<button
			class="chip ml-2 flex gap-1 font-bold"
			onclick={() => setLang(i18n.lang === 'en' ? 'fr' : 'en')}
			aria-label={t('Passer en français', 'Switch to English')}
		>
			<span class={i18n.lang === 'en' ? 'text-sky-900' : 'text-sky-900/40'}>EN</span>
			<span class="text-sky-900/40">|</span>
			<span class={i18n.lang === 'fr' ? 'text-sky-900' : 'text-sky-900/40'}>FR</span>
		</button>
	</Menubar.Menu>
</Menubar.Root>
