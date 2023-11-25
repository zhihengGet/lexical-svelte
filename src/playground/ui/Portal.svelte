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
</script>

<div use:refFn bind:this={ref.current} data-id="svelt-render">
	<!-- render decorators -->
	{#each components ?? [] as decorator}
		<svelte:self {...decorator} />
	{/each}
	<!-- render regular svelte components -->
	{#await props.component}
		<div>wait</div>
	{:then component}
		{#if props.component && !components}
			<svelte:component this={component} {...props.props ?? []}>
				{#each props.childComponents ?? [] as cp}
					<svelte:self {...cp} />
				{/each}
				<!-- {#if children}
					{@render children()}
				{/if} -->
			</svelte:component>
		{:else if snippet}
			{@render snippet({ refFn, ...props })}
		{/if}
	{/await}
</div>
