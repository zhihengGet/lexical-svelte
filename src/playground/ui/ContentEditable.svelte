<script lang="ts">
	import './ContentEditable.css';

	import ContentEditable from '@lexical/react/LexicalContentEditable.svelte';

	let { class: cl } = $props<{ class?: string }>();
	console.log('content editorl class', cl || 'ContentEditable__root');

	const ref = (node: HTMLElement) => node.focus();
</script>

<ContentEditable class={cl || 'ContentEditable__root'} />
