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
		if (portal === false || !props.target) return;
		let p = usePortal(node, props.target);

		let child = node.children;
		if (child) {
			/* const react = child.item(0)?.getBoundingClientRect();
			console.log(react, child);
			node.style.width = react?.width ?? 0;
			node.style.height = react?.heights ?? 0;
			debugger; */
		}

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
		console.log('in portal Portal render', components);
	});
</script>

{#each components ?? [] as decorator}
	<svelte:self {...decorator} />
{/each}

{#if !components || components.length == 0}
	<div
		use:refFn
		bind:this={ref.current}
		data-id="svelt-render"
		data-portal={props.component?.name}
		class="overflow-hidden inline m-0 p-0 inline-flex flex-col"
	>
		<!-- render decorators -->
		<!-- render regular svelte components -->
		{#await props.component}
			<div>wait</div>
		{:then component}
			{#if component && !components}
				<!-- {@debug component} -->
				<svelte:component this={component} {...props.props ?? []}>
					{#each props.childComponents ?? [] as cp}
						<svelte:self {...cp} />
					{/each}
					<!-- {#if children}
					{@render children()}
				{/if} -->
				</svelte:component>
			{:else if snippet}
				{@render snippet({ refFn, ...props.props })}
			{/if}
		{/await}
	</div>
{/if}

<style>
</style>
