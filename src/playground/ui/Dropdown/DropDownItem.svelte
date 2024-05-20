<script lang="ts">
	import * as React from 'react';
	import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
	import { getContext, setContext } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let {
		enabled = true,
		...props
	}: {
		class: string;
		children?: any;
		onclick: () => any;
		title?: string;
		enabled?: boolean;
		'aria-label'?: string;
	} = $props();
	const ref = useRef(null);

	const dropDownContext = getContext('dialog');
	if (dropDownContext === null) {
		throw new Error('DropDownItem must be used within a DropDown');
	}
</script>

<!-- {#if enabled}
	<button class={className} onclick={onClick} bind:this={ref.current} type="button">
		<slot />
	</button>
{/if}
 -->
{#if enabled}
	<DropdownMenu.DropdownMenuItem {...props} class="item"
		>{@render props.children?.()}</DropdownMenu.DropdownMenuItem
	>
{/if}
