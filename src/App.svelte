<script lang="ts">
	let { ...props } = $props();

	let EditorInstance: any = $state();
	$effect(() => {
		EditorInstance = import('./Temp.svelte');
	});
</script>

{#await EditorInstance}
	Dynamically loading Editor
{:then { default: Editor }}
	<Editor
		isAutocomplete={false}
		dev={false}
		config={{ editable: false }}
		paragraphComment={true}
		{...props}
	/>
{/await}
