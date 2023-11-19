<script>
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { default as TreeView } from "@lexical/react/LexicalTreeView.svelte";
  const [editor] = useLexicalComposerContext();
</script>

<TreeView
  viewClassName="tree-view-output"
  treeTypeButtonClassName="debug-treetype-button"
  timeTravelPanelClassName="debug-timetravel-panel"
  timeTravelButtonClassName="debug-timetravel-button"
  timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
  timeTravelPanelButtonClassName="debug-timetravel-panel-button"
  {editor}
/>
