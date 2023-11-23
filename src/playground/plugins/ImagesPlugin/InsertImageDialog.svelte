<script context="module" lang="ts">
  export type InsertImagePayload = Readonly<ImagePayload>;

  const getDOMSelection = (targetWindow: Window | null): Selection | null =>
    CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

  export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
    createCommand("INSERT_IMAGE_COMMAND");
</script>

<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { mergeRegister } from "@lexical/utils";
  import type {
    LexicalCommand,
    LexicalEditor} from "lexical";
import {
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGOVER_COMMAND,
    DRAGSTART_COMMAND,
    DROP_COMMAND
  } from "lexical";
  import { useEffect, useRef, useState } from "react";
  import * as React from "react";
  import { CAN_USE_DOM } from "shared/canUseDOM";

  import landscapeImage from "../../images/landscape.jpg";
  import yellowFlowerImage from "../../images/yellow-flower.jpg";
  import type { ImagePayload } from "./ImageNode";
import { ImageNode } from "./ImageNode";
  import Button from "@ui/Button.svelte";
  import { default as DialogActions } from "@ui/DialogActions.svelte";
  import FileInput from "@ui/FileInput.svelte";
  import TextInput from "@ui/TextInput.svelte";
  import InsertImageUriDialogBody from "./InsertImageUriDialogBody.svelte";
  import DialogButtonsList from "@ui/DialogButtonsList.svelte";
  import InsertImageUploadedDialogBody from "./InsertImageUploadedDialogBody.svelte";
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");
  let { activeEditor, onClose } = $props<{
    activeEditor: LexicalEditor;
    onClose: () => void;
  }>();
  const [mode, setMode] = useState<null | "url" | "file">(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };
</script>

{#if !mode}
  <DialogButtonsList>
    <Button
      data-test-id="image-modal-option-sample"
      onClick={() =>
        onClick(
          hasModifier.current
            ? {
                altText:
                  "Daylight fir trees forest glacier green high ice landscape",
                src: landscapeImage,
              }
            : {
                altText: "Yellow flower in tilt shift lens",
                src: yellowFlowerImage,
              }
        )}
    >
      Sample
    </Button>
    <Button
      data-test-id="image-modal-option-url"
      onClick={() => setMode("url")}
    >
      URL
    </Button>
    <Button
      data-test-id="image-modal-option-file"
      onClick={() => setMode("file")}
    >
      File
    </Button>
  </DialogButtonsList>
{/if}

{#if mode() === "url"}
  <InsertImageUriDialogBody {onClick} />
{/if}

{#if mode() === "file"}
  <InsertImageUploadedDialogBody {onClick} />
{/if}
