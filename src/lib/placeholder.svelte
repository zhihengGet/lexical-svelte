<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import useLexicalEditable from "@lexical/react/useLexicalEditable.svelte";

  import { useCanShowPlaceholder } from "../shared/useCanShowPlaceholder.svelte";

  let { content } = $props<{ content: String }>();
  const [editor] = useLexicalComposerContext();
  const showPlaceholder = useCanShowPlaceholder(editor);
  const editable = useLexicalEditable();
</script>

{#if typeof content === "function"}
  {content(editable)}
{:else if showPlaceholder()}
  {content ?? ""}
{/if}
