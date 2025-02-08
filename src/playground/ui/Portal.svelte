<script lang="ts" generics="T extends Component">
	import Portal from './Portal.svelte';
	import type { SvelteRender } from '@lexical/react/types';
	import { onDestroy, type Component, type Snippet } from 'svelte';

	let {
		components,
		snippet,
		children,
		portal = false,
		enable = true,
		...props
	}: SvelteRender<T> & { children?: Snippet; enable?: boolean } = $props();
	function refFn(node: HTMLElement) {
		console.log('portal refFn', node);
		if (!node) return console.error('portal element does not exists', node);
		props.target?.appendChild(node);
		//let p = usePortal(node, props.target);
		onDestroy(() => {
			console.log('portal destroy refFn', node);
			node?.remove();
		});
	}
	if (typeof props.initializor == 'function') {
		//console.log('call initializer');
		if (enable) props.initializor();
	}
	let ref = props.ref ?? { current: undefined };
	$effect.pre(() => {
		console.log('portal prerender', props.props);
		/* if ((props.component || props.target) && ref.current) {
			ref.current.innerHTML = '';
		} */
	});
	$effect(() => {
		//console.log('portal after render', ref.current, snippet);
		// useRef won't be called if decorator update so we have to call manually
		/* 	if (props.component && props.target && ref.current) {
			refFn(ref.current);
		} */
	});
</script>

{#snippet El()}
	{#await props.component}
		<div>wait</div>
	{:then C}
		{#if C}
			<C {...props.props ?? []}>
				{#each props.childComponents ?? [] as cp}
					<Portal {...cp} />
				{/each}
			</C>
		{/if}
	{/await}
	{#if snippet}
		{@render snippet({ refFn, ...props.props })}
	{/if}
{/snippet}
{#if (!components || components.length == 0) && (props.component || snippet || children) && enable}
	{#if portal == false || !props.target}
		{@render El()}
	{:else}
		<div class="inline-block" bind:this={ref.current} data-id="svelt-render-{props.nodeKey}">
			{@render El()}
		</div>
	{/if}
	{#if children}
		{@render children()}
	{/if}
{/if}
{#each components ?? [] as decorator}
	<Portal {...decorator} />
{/each}

<style>
</style>
