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
	$effect(() => {
		console.log('in portal components:', components);
	});
</script>

{#each components ?? [] as decorator}
	<svelte:self {...decorator} />
{/each}

{#if (!components || components.length == 0) && (props.component || snippet)}
	<span
		class="inline-block mx-1 !p-0 leading-0"
		use:refFn
		bind:this={ref.current}
		data-id="svelt-render"
	>
		<!-- render decorators -->
		<!-- render regular svelte components -->
		{#await props.component}
			<div>wait</div>
		{:then component}
			{#if component}
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
	</span>
{/if}

<style>
</style>
