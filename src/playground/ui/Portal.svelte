<script lang="ts" generics="T extends SvelteComponent">
	import type { SvelteRender } from '@lexical/react/types';
	import { usePortal } from '@melt-ui/svelte/internal/actions';
	import InsertImageDialog from '@plugins/ImagesPlugin/InsertImageDialog.svelte';
	import { useRef } from 'react';
	import { onDestroy, type SvelteComponent, type Snippet } from 'svelte';

	let {
		components,
		snippet,
		children,
		portal = false,
		enable = true,
		...props
	} = $props<SvelteRender<T> & { children?: Snippet; enable?: boolean }>();
	function refFn(node: HTMLElement) {
		console.log('portal refFn', node);
		if (!node) return console.error('portal element does not exists', node);
		if (portal === false || !props.target) {
			return;
			// if we don't need to portal then remove the div that is wrapper it
			let parent = node.parentElement;
			let child = node.childNodes;
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
			console.log('portal destroy refFn', p);
			if (p && p.destroy) {
				p.destroy();
			}
		});
	}
	if (typeof props.initializor == 'function') {
		//console.log('call initializer');
		if (enable) props.initializor();
	}
	let ref = props.ref ?? { current: undefined };
	$effect.pre(() => {
		console.log('portal prerender', ref.current?.innerHTML);
		/* if ((props.component || props.target) && ref.current) {
			ref.current.innerHTML = '';
		} */
	});
	$effect(() => {
		console.log('portal after render', ref.current, props.component);
		// useRef won't be called if decorator update so we have to call manually
		/* 	if (props.component && props.target && ref.current) {
			refFn(ref.current);
		} */
	});
</script>

{#snippet El()}
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
	<svelte:self {...decorator} />
{/each}

<style>
</style>
