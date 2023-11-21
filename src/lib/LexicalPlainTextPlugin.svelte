<script lang="ts">
  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";

  import { useDecorators } from "../shared/useDecorators.svelte.svelte";
  import { usePlainTextSetup } from "../shared/usePlainTextSetup.svelte";
  import Placeholder from "./placeholder.svelte";

  let { contentEditable, placeholder, contentEditableProps, placeholderProps } =
    $props<{
      contentEditable: any;
      placeholder: string;
      contentEditableProps: any;
      placeholderProps: any;
    }>();
  const [editor] = useLexicalComposerContext();
  useDecorators(editor);
  usePlainTextSetup(editor);
</script>

<svelte:component this={contentEditable} {...contentEditableProps} />

<Placeholder content={placeholder} {...placeholderProps} />
