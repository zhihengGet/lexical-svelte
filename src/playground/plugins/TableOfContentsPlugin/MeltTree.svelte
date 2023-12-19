<script lang="ts">
	import { Bird } from 'lucide-svelte';
	import Tree from './tree.svelte';
	import { createTableOfContents } from '@melt-ui/svelte';
	import Portal from '@ui/Portal.svelte';

	const {
		elements: { item },
		states: { activeHeadingIdxs, headingsTree }
	} = createTableOfContents({
		selector: '.editor-container',
		exclude: [],
		activeType: 'all',
		//	headingFilterFn: (heading) => !heading.hasAttribute('data-toc-ignore'),
		scrollFn: (id) => {
			/**
			 * Here we're overwriting the default scroll function
			 * so that we only scroll within the ToC preview
			 * container, instead of the entire page.
			 */
			const container = document.getElementById('toc-builder-preview');
			const element = document.getElementById(id);

			if (container && element) {
				container.scrollTo({
					top: element.offsetTop - container.offsetTop - 16,
					behavior: 'smooth'
				});
			}
		}
	});

	let hideHeading = false;
</script>

<Portal target={document.body} portal={true}>
	<div
		class="grid h-[18rem] grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 relative"
	>
		<div class="overflow-y-auto rounded-lg bg-white p-4 absolute left-0 top-0">
			<p class="font-semibold text-neutral-900">On This Page</p>
			<nav>
				{#key $headingsTree}
					<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
				{/key}
			</nav>
		</div>
	</div>
</Portal>

<!-- <style>
	#toc-builder-preview > h2 {
		@apply text-xl font-bold;
	}

	#toc-builder-preview > h3 {
		@apply text-lg font-bold;
	}

	#toc-builder-preview > h4 {
		@apply text-lg font-semibold;
	}

	.hide-heading {
		display: inline-flex;
		height: theme(spacing.8);
		cursor: default;
		align-items: center;
		justify-content: center;
		border-radius: theme(borderRadius.md);
		background-color: theme(colors.magnum.200);
		padding-inline: theme(spacing.4);
		line-height: 1;
		font-weight: theme(fontWeight.semibold);
		color: theme(colors.magnum.900);
		@apply transition;

		&:hover {
			opacity: 0.75;
		}
	}
</style>
 -->
