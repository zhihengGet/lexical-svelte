<script context="module" lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import {
    $insertNodeToNearestRoot as insertNodeToNearestRoot,
    mergeRegister,
  } from "@lexical/utils";
  import * as lexical from "lexical";
  import type {
    LexicalCommand} from "lexical";
import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand
  } from "lexical";
  import { useEffect } from "react";

  import {
    $createPageBreakNode as createPageBreakNode,
    PageBreakNode,
  } from "./PageBreakNode";

  export const INSERT_PAGE_BREAK: LexicalCommand<undefined> = createCommand();
</script>

<script lang="ts">
  type props = {};
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode]))
      throw new Error(
        "PageBreakPlugin: PageBreakNode is not registered on editor"
      );

    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK,
        () => {
          const selection = getSelection();

          if (!isRangeSelection(selection)) return false;

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = createPageBreakNode();
            insertNodeToNearestRoot(pgBreak);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
</script>
