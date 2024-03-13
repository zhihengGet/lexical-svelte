<script lang="ts">
	//import { type Settings } from 'lexical-svelte-runes/client';
	import { mount, onMount } from 'svelte';

	let { ...props } = $props();

	let EditorInstance: any = $state.frozen();
	onMount(async () => {
		EditorInstance = (await import('./App.svelte')).default;
		//	mount(EditorInstance, { target: document.body, props: { config: { editable: false } } });
	});
</script>

{#if !EditorInstance}
	loading
{/if}

<svelte:component
	this={EditorInstance}
	isAutocomplete={false}
	dev={false}
	config={{ editable: false }}
	{...props}
/>
