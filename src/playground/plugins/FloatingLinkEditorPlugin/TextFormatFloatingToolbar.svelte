<script context="module" lang="ts">
  export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand(
    "INSERT_INLINE_COMMAND"
  );
</script>

<script lang="ts">
  import "./index.css";

  import { TOGGLE_LINK_COMMAND } from "@lexical/link";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { mergeRegister } from "@lexical/utils";
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    GridSelection,
    KEY_ESCAPE_COMMAND,
    LexicalEditor,
    NodeSelection,
    RangeSelection,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    LexicalCommand,
    createCommand,
  } from "lexical";
  import { useCallback, useEffect, useRef, useState } from "react";

  import { getSelectedNode } from "../../utils/getSelectedNode";
  import { setFloatingElemPositionForLinkEditor } from "../../utils/setFloatingElemPositionForLinkEditor";
  import { sanitizeUrl } from "../../utils/url";
  import { getDOMRangeRect } from "../../utils/getDOMRangeRect";
  import { setFloatingElemPosition } from "../../utils/setFloatingElemPosition";

  type props = {
    editor: LexicalEditor;
    anchorElem: HTMLElement;
    isBold: boolean;
    isCode: boolean;
    isItalic: boolean;
    isLink: boolean;
    isStrikethrough: boolean;
    isSubscript: boolean;
    isSuperscript: boolean;
    isUnderline: boolean;
  };
  let {
    editor,
    anchorElem,
    isLink,
    isBold,
    isItalic,
    isUnderline,
    isCode,
    isStrikethrough,
    isSubscript,
    isSuperscript,
  } = $props<props>();
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink
      );
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateTextFormatFloatingToolbar]);
</script>

<div
  bind:this={popupCharStylesEditorRef.current}
  class="floating-text-format-popup"
>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    }}
    class={"popup-item spaced " + (isBold ? "active" : "")}
    aria-label="Format text as bold"
  >
    <i class="format bold" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    }}
    class={"popup-item spaced " + (isItalic ? "active" : "")}
    aria-label="Format text as italics"
  >
    <i class="format italic" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    }}
    class={"popup-item spaced " + (isUnderline ? "active" : "")}
    aria-label="Format text to underlined"
  >
    <i class="format underline" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
    }}
    class={"popup-item spaced " + (isStrikethrough ? "active" : "")}
    aria-label="Format text with a strikethrough"
  >
    <i class="format strikethrough" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
    }}
    class={"popup-item spaced " + (isSubscript ? "active" : "")}
    title="Subscript"
    aria-label="Format Subscript"
  >
    <i class="format subscript" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
    }}
    class={"popup-item spaced " + (isSuperscript ? "active" : "")}
    title="Superscript"
    aria-label="Format Superscript"
  >
    <i class="format superscript" />
  </button>
  <button
    type="button"
    onClick={() => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
    }}
    class={"popup-item spaced " + (isCode ? "active" : "")}
    aria-label="Insert code block"
  >
    <i class="format code" />
  </button>
  <button
    type="button"
    onClick={insertLink}
    class={"popup-item spaced " + (isLink ? "active" : "")}
    aria-label="Insert link"
  >
    <i class="format link" />
  </button>

  <button
    type="button"
    onClick={insertComment}
    class={"popup-item spaced insert-comment"}
    aria-label="Insert comment"
  >
    <i class="format add-comment" />
  </button>
</div>
