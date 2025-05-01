<script lang="ts">
	import '../../app.css';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
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
				<DropdownMenu.Trigger>
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
						<a href="/playground">
							<DropdownMenu.Item>Playground</DropdownMenu.Item>
						</a>
						<a href="/posts">
							<DropdownMenu.Item>Posts</DropdownMenu.Item>
						</a>
						<a href="/projects">
							<DropdownMenu.Item>Projects</DropdownMenu.Item>
						</a>
						<a href="/resume">
							<DropdownMenu.Item>Resume</DropdownMenu.Item>
						</a>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		<div class="ml-auto hidden flex-1 justify-end sm:flex">
			<a href="/playground">
				<Menubar.Trigger>Playground</Menubar.Trigger>
			</a>
			<a href="/posts">
				<Menubar.Trigger>Posts</Menubar.Trigger>
			</a>
			<a href="/projects">
				<Menubar.Trigger>Projects</Menubar.Trigger>
			</a>
			<a href="/resume">
				<Menubar.Trigger>Resume</Menubar.Trigger>
			</a>
		</div>
	</Menubar.Menu>
</Menubar.Root>
