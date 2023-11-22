<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import useLexicalEditable from "@lexical/react/useLexicalEditable.svelte";
  import * as React from "react";

  import { useCanShowPlaceholder } from "../shared/useCanShowPlaceholder.svelte";
  import { useDecorators } from "../shared/useDecorators.svelte";
  import { useRichTextSetup } from "../shared/useRichTextSetup.svelte";
  import { SvelteComponent } from "svelte";
  import Placeholder from "./placeholder.svelte";
  import Portal from "@ui/Portal.svelte";

  let { contentEditable, placeholder } = $props<{
    contentEditable: SvelteComponent;
    placeholder: string;
    contentEditableProps: any;
    placeholderProps: any;
  }>();
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor);
  useRichTextSetup(editor);
</script>

<Portal component={contentEditable} props={contentEditableProps} />
{contentEditable}
<Placeholder content={placeholder} {...placeholderProps} />
<Portal component={decorators} />
