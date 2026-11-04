<script lang="ts">
	import { projects } from '$lib/projects';
</script>

<div class="align flex w-full items-center justify-center px-5">
	<h1 class="scroll-m-20 pt-[10rem] text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		My projects
	</h1>
</div>

<div class="mx-auto grid max-w-5xl gap-4 p-5 sm:grid-cols-2">
	{#each projects as project (project.slug)}
		<a
			href={project.url}
			target="_blank"
			rel="noopener"
			class="rounded-xl border p-4 hover:bg-muted"
		>
			<h2 class="text-lg font-bold">{project.title}</h2>
			<p class="mt-1 text-sm text-muted-foreground">{project.summary}</p>
			<div class="mt-2 flex flex-wrap gap-1">
				{#each project.tags as tag (tag)}
					<span class="rounded-full bg-secondary px-2 py-0.5 text-xs">{tag}</span>
				{/each}
			</div>
		</a>
	{/each}
</div>
