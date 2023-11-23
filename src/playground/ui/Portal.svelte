<script lang="ts">
	import type { SvelteRender } from '@lexical/react/types';
	import { usePortal } from '@melt-ui/svelte/internal/actions';
	import { onDestroy, type Snippet } from 'svelte';

	let {
		components,
		snippet,
		children,
		portal = false,
		...props
	} = $props<SvelteRender & { children?: Snippet }>();

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
		props.initializor();
	}
	let ref = props.ref ?? { current: undefined };
</script>

<div use:refFn bind:this={ref.current}>
	<!-- render decorators -->
	{#each components ?? [] as decorator}
		<svelte:self {...decorator} />
	{/each}
	<!-- render regular svelte components -->
	{#await props.component}
		<div>wait</div>
	{:then component}
		{#if props.component && !components}
			<svelte:component this={component} {...props}>
				{#each props.childComponents ?? [] as cp}
					<svelte:component this={cp.component} />
				{/each}
			</svelte:component>
		{:else if snippet}
			{@render snippet({ children, refFn, ...props })}
		{/if}
	{/await}
</div>
