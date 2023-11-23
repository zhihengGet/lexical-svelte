<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { onMount, onDestroy } from "svelte";
  import { useMemo, useState } from "react";
  import type { PlaygroundEmbedConfig } from ".";
  import type {
    EmbedMatchResult} from "@lexical/react/LexicalAutoEmbedPlugin.svelte";
import {
    URL_MATCHER,
  } from "@lexical/react/LexicalAutoEmbedPlugin.svelte";
  const debounce = (callback: (text: string) => void, delay: number) => {
    let timeoutId: number;
    return (text: string) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(text);
      }, delay);
    };
  };
  import { default as DialogActions } from "../../ui/DialogActions.svelte";
  import Button from "@ui/Button.svelte";
  let { embedConfig, onClose } = $props<{
    embedConfig: PlaygroundEmbedConfig;
    onClose: () => void;
  }>();
  const [text, setText] = useState("");
  const [editor] = useLexicalComposerContext();
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then(
            (parseResult) => {
              setEmbedResult(parseResult);
            }
          );
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult]
  );

  const onClick = () => {
    if (embedResult != null) {
      embedConfig.insertNode(editor, embedResult()); // Assuming `editor` is available
      onClose();
    }
  };

  onDestroy(() => {
    // Clean-up logic if needed
  });
</script>

<div style="width: 600px">
  <div class="Input__wrapper">
    <input
      type="text"
      value={text()}
      class="Input__input"
      placeholder={embedConfig.exampleUrl}
      data-test-id={`${embedConfig.type}-embed-modal-url`}
      oninput={(e) => {
        const { value } = e.target;
        setText(value);
        validateText(value);
      }}
    />
  </div>
  <DialogActions>
    <Button
      disabled={!embedResult}
      {onClick}
      data-test-id={`${embedConfig.type}-embed-modal-submit-btn`}
    >
      Embed
    </Button>
  </DialogActions>
</div>
