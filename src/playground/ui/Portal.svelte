<script lang="ts" generics="T extends SvelteComponent">
	import type { SvelteRender } from '@lexical/react/types';
	import { usePortal } from '@melt-ui/svelte/internal/actions';
	import { onDestroy, type SvelteComponent, type Snippet } from 'svelte';

	let {
		components,
		snippet,
		children,
		portal = false,
		...props
	} = $props<SvelteRender<T> & { children?: Snippet }>();

	function refFn(node: HTMLElement) {
		if (portal === false || !props.target) {
			// if we dont need to portal then remove the div that is wrapper it
			let child = node.childNodes;
			let parent = node.parentElement;
			if (parent && child) {
				parent?.removeChild(node);
				parent.append(...child);
			} else if (parent) {
				parent.removeChild(node);
			}

			return;
		}
		let p = usePortal(node, props.target);

		onDestroy(() => {
			if (p && p.destroy) {
				p.destroy();
			}
		});
	}
	if (typeof props.initializor == 'function') {
		console.log('call initializor');
		props.initializor();
	}
	let ref = props.ref ?? { current: undefined };
	$effect(() => {
		console.log('in portal components:', components);
	});
</script>

{#each components ?? [] as decorator}
	<svelte:self {...decorator} />
{/each}
{#snippet El()}
	<svelte:fragment>
		{#await props.component}
			<div>wait</div>
		{:then component}
			{#if component}
				<svelte:component this={component} {...props.props ?? []}>
					{#each props.childComponents ?? [] as cp}
						<svelte:self {...cp} />
					{/each}
				</svelte:component>
			{:else if snippet}
				{@render snippet({ refFn, ...props.props })}
			{/if}
		{/await}
	</svelte:fragment>
{/snippet}
{#if (!components || components.length == 0) && (props.component || snippet)}
	{#if portal == false || !props.target}
		{@render El()}
	{:else}
		<div class="inline-block" use:refFn bind:this={ref.current} data-id="svelt-render">
			{@render El()}
		</div>
	{/if}
{/if}

<style>
</style>
