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
			<p class="font-semibold text-neutral-900">
				TOC<svg
					width="24px"
					height="24px"
					viewBox="0 0 1024 1024"
					class="icon inline pl-2"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					fill="#000000"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier"
						><path
							d="M91.89 238.457c-29.899 0-54.133 24.239-54.133 54.134 0 29.899 24.234 54.137 54.133 54.137s54.138-24.238 54.138-54.137c0-29.896-24.239-54.134-54.138-54.134z"
							fill="#E5594F"
						></path><path
							d="M91.89 462.463c-29.899 0-54.133 24.239-54.133 54.139 0 29.895 24.234 54.133 54.133 54.133s54.138-24.238 54.138-54.133c0-29.9-24.239-54.139-54.138-54.139z"
							fill="#C45FA0"
						></path><path
							d="M91.89 686.475c-29.899 0-54.133 24.237-54.133 54.133 0 29.899 24.234 54.138 54.133 54.138s54.138-24.238 54.138-54.138c0-29.896-24.239-54.133-54.138-54.133z"
							fill="#F39A2B"
						></path><path
							d="M941.26 234.723H328.964c-28.867 0-52.263 23.4-52.263 52.268v3.734c0 28.868 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.401 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
							fill="#F0D043"
						></path><path
							d="M941.26 682.74H328.964c-28.867 0-52.263 23.399-52.263 52.268v3.734c0 28.863 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.405 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
							fill="#4A5699"
						></path><path
							d="M709.781 458.729H328.964c-28.867 0-52.263 23.4-52.263 52.269v3.734c0 28.873 23.396 52.269 52.263 52.269h380.817c28.866 0 52.271-23.396 52.271-52.269v-3.734c0.001-28.869-23.405-52.269-52.271-52.269z"
							fill="#E5594F"
						></path></g
					></svg
				>
			</p>
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
