<script context="module" lang="ts">
</script>

<script lang="ts">
	import './index.css';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import UseFloatingTextFormatToolbar from './useFloatingTextFormatToolbar.svelte';

	type props = {
		anchorElem?: HTMLElement;
	};
	let { anchorElem = document.body } = $props<props>();

	const [editor] = useLexicalComposerContext();
	console.log('the anchorElemetn is', anchorElem);
</script>

<UseFloatingTextFormatToolbar {editor} {anchorElem} />
