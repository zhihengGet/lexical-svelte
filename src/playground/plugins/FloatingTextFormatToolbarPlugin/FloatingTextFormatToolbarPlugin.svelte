<script context="module" lang="ts">
</script>

<script lang="ts">
  import "./index.css";

  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";

  import Portal from "@ui/Portal.svelte";
  import UseFloatingTextFormatToolbar from "./useFloatingTextFormatToolbar.svelte";

  type props = {
    anchorElem?: HTMLElement;
  };
  let { anchorElem = document.body } = $props<props>();

  const [editor] = useLexicalComposerContext();
</script>

<UseFloatingTextFormatToolbar {editor} {anchorElem} />
