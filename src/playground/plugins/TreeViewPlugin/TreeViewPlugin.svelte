<script>
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { default as TreeView } from '@lexical/react/LexicalTreeView.svelte';
	const [editor] = useLexicalComposerContext();
</script>

<TreeView
	viewclass="tree-view-output"
	treeTypeButtonclass="debug-treetype-button"
	timeTravelPanelclass="debug-timetravel-panel"
	timeTravelButtonclass="debug-timetravel-button"
	timeTravelPanelSliderclass="debug-timetravel-panel-slider"
	timeTravelPanelButtonclass="debug-timetravel-panel-button"
	{editor}
/>
