<script lang="ts">
	import { useRef } from 'react';
	import { getContext } from 'svelte';

	let {
		class: className,
		onClick,
		title
	} = $props<{
		class: string;
		children?: any;
		onClick: () => any;
		title?: string;
		'aria-label'?: string;
	}>();
	const ref = useRef(null);

	const dropDownContext = getContext('dialog');
	if (dropDownContext === null) {
		throw new Error('DropDownItem must be used within a DropDown');
	}
</script>

<button class={className} onclick={onClick} bind:this={ref.current} type="button">
	<slot />
</button>
