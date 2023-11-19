<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
  import useLexicalEditable from "@lexical/react/useLexicalEditable";

  import { useCanShowPlaceholder } from "../shared/useCanShowPlaceholder";

  let { content } = $props<{ content: String }>();
  const [editor] = useLexicalComposerContext();
  const showPlaceholder = useCanShowPlaceholder(editor);
  const editable = useLexicalEditable();
</script>

{#if typeof content === "function"}
  {content(editable)}
{:else}
  {content ?? ""}
{/if}
