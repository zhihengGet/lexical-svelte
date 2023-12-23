<script lang="ts">
	import * as React from 'react';
	import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
	import { getContext, setContext } from 'svelte';

	let {
		class: className,
		onClick,
		enabled = true,
		title
	} = $props<{
		class: string;
		children?: any;
		onClick: () => any;
		title?: string;
		enabled?: boolean;
		'aria-label'?: string;
	}>();
	const ref = useRef(null);

	const dropDownContext = getContext('dialog');
	if (dropDownContext === null) {
		throw new Error('DropDownItem must be used within a DropDown');
	}
</script>

{#if enabled}
	<button class={className} onclick={onClick} bind:this={ref.current} type="button">
		<slot />
	</button>
{/if}
