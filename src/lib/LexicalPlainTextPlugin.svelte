<script lang="ts">
  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

  import { useDecorators } from "../shared/useDecorators.svelte";
  import { usePlainTextSetup } from "../shared/usePlainTextSetup";
  import Placeholder from "./placeholder.svelte";

  let { contentEditable, placeholder } = $props<{
    contentEditable: any;
    placeholder: string;
  }>();
  const [editor] = useLexicalComposerContext();
  useDecorators(editor);
  usePlainTextSetup(editor);
</script>

<svelte:component this={contentEditable} />
<Placeholder content={placeholder} />
