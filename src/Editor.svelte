<script lang="ts">
  import { default as PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin.svelte";

  import useLexicalEditable from "@lexical/react/useLexicalEditable.svelte";
  import { CAN_USE_DOM } from "shared/canUseDOM";
  import LexicalContentEditable from "./lib/LexicalContentEditable.svelte";
  import { useState } from "./react.svelte";
  import LexicalTreeView from "./lib/LexicalTreeView.svelte";
  import TreeViewPlugin from "./playground/plugins/TreeViewPlugin/TreeViewPlugin.svelte";

  const isEditable = true;
  const text = "Enter some plain text...";
  const placeholder = text;

  /*   const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false); */

  /*   const cellEditorConfig = {
    namespace: "Playground",
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  }; */

  $effect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  });

  // your script goes here
</script>

<PlainTextPlugin contentEditable={LexicalContentEditable} {placeholder} />
<TreeViewPlugin />
