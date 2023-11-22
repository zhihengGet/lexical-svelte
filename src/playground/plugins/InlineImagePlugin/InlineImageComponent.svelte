<script context="module" lang="ts">
  type CommandPayload = {
    equation: string;
    inline: boolean;
  };
  const imageCache = new Set();
  //TODO cache image
  export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
    lexical.createCommand("RIGHT_CLICK_IMAGE_COMMAND");
</script>

<script lang="ts">
  import type {
    GridSelection,
    LexicalCommand,
    LexicalEditor,
    NodeKey,
    NodeSelection,
    RangeSelection,
  } from "lexical";

  import "./ImageNode.css";

  import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin.svelte";
  import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext.svelte";
  import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin.svelte";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin.svelte";
  import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin.svelte";
  import { default as LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer.svelte";
  import { default as RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin.svelte";
  import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection.svelte";
  import { mergeRegister } from "@lexical/utils";
  import * as lexical from "lexical";
  import * as React from "react";
  import { useCallback, useEffect, useRef, useState } from "react";

  import { createWebsocketProvider } from "../../collaboration";
  import { useSettings } from "../../context/SettingsContext.svelte";
  import EmojisPlugin from "../EmojisPlugin";
  import KeywordsPlugin from "../KeywordsPlugin";
  import { LinkPlugin } from "../LinkPlugin";
  // import MentionsPlugin from "../plugins/MentionsPlugin";
  //import TreeViewPlugin from "../../plugins/TreeViewPlugin.svelte";
  import ContentEditable from "@ui/ContentEditable.svelte";
  import ImageResizer from "../ImagesPlugin/ImageResizer.svelte";
  import { $isImageNode as isImageNode } from "../ImagesPlugin/ImageNode";
  import { useSharedHistoryContext } from "../../context/SharedHistoryContext";
  import {
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGSTART_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    SELECTION_CHANGE_COMMAND,
  } from "lexical";
  import {
    $isInlineImageNode as isInlineImageNode,
    Position,
  } from "./InlineImageNode.svelte";
  import UpdateInlineImageDialog from "./UpdateInlineImageDialog.svelte";
  import useModal from "../../hooks/useModal";
  import FloatingLinkEditorPlugin from "@plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin.svelte";
  import FloatingTextFormatToolbarPlugin from "@plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin.svelte";
  import Portal from "@ui/Portal.svelte";
  let { src, altText, nodeKey, width, height, showCaption, caption, position } =
    $props<{
      altText: string;
      caption: LexicalEditor;
      height: "inherit" | number;
      nodeKey: NodeKey;
      showCaption: boolean;
      src: string;
      width: "inherit" | number;
      position: Position;
    }>();
  //TODO lazy image
  const [modal, showModal] = useModal();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && lexical.$isNodeSelection(lexical.$getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = lexical.$getNodeByKey(nodeKey);
        if (isInlineImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = lexical.$getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        lexical.$isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (showCaption) {
          // Move focus into nested editor
          lexical.$setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (
          buttonElem !== null &&
          buttonElem !== document.activeElement
        ) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption]
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (
        activeEditorRef.current === caption ||
        buttonRef.current === event.target
      ) {
        lexical.$setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected]
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    onEscape,
    setSelected,
  ]);

  const draggable = isSelected && lexical.$isNodeSelection(selection);
  const isFocused = isSelected;
  AutoFocusPlugin({});
</script>

<div {draggable}>
  <img
    class={isFocused
      ? `focused ${lexical.$isNodeSelection(selection) ? "draggable" : ""}`
      : null}
    {src}
    alt={altText}
    bind:this={imageRef.current}
    {width}
    {height}
    style={"max-width:" + maxWidth}
  />
</div>
<div {draggable}>
  <button class="image-edit-button" bind:this={buttonRef.current}>
    Edit
  </button>
  <img
    class={isFocused
      ? `focused ${lexical.$isNodeSelection(selection) ? "draggable" : ""}`
      : null}
    {src}
    alt={altText}
    bind:this={imageRef.current}
    {width}
    {height}
    data-position={position}
  />
</div>

<div class="image-caption-container">
  <LexicalNestedComposer initialEditor={caption}>
    <LinkPlugin />
    <FloatingLinkEditorPlugin
      isLinkEditMode={false}
      setIsLinkEditMode={() => {}}
    />
    <FloatingTextFormatToolbarPlugin />
    <RichTextPlugin
      contentEditableProps={{ class: "InlineImageNode__contentEditable" }}
      contentEditable={ContentEditable}
      placeholderProps={"InlineImageNode__placeholder"}
      placeholder={" Enter a caption..."}
    />
  </LexicalNestedComposer>
</div>

<Portal {...modal} />
