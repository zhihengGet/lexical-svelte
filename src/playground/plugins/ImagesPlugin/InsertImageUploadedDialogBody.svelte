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
    LexicalCommand} from "lexical";
import {
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGOVER_COMMAND,
    DRAGSTART_COMMAND,
    DROP_COMMAND,
    LexicalEditor,
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
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");
  let { onClick } = $props<{
    onClick: (payload: InsertImagePayload) => void;
  }>();
  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
      return "";
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };
  const isDisabled = src() === "";
</script>

<FileInput
  label="Image Upload"
  onChange={loadImage}
  accept="image/*"
  data-test-id="image-modal-file-upload"
/>
<TextInput
  label="Alt Text"
  placeholder="Descriptive alternative text"
  onChange={setAltText}
  value={altText()}
  data-test-id="image-modal-alt-text-input"
/>
<DialogActions>
  <Button
    data-test-id="image-modal-file-upload-btn"
    disabled={isDisabled}
    onClick={() => onClick({ altText: altText(), src: src() })}
  >
    Confirm
  </Button>
</DialogActions>
