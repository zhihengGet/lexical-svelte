<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import useLexicalEditable from "@lexical/react/useLexicalEditable.svelte";

  import { useCanShowPlaceholder } from "../shared/useCanShowPlaceholder.svelte";

  let { content, class: className } = $props<{
    content: String;
    class: string;
  }>();
  const [editor] = useLexicalComposerContext();
  const showPlaceholder = useCanShowPlaceholder(editor);
  const editable = useLexicalEditable();
</script>

<p class={className}>
  {#if typeof content === "function"}
    {content(editable)}
  {:else if showPlaceholder()}
    {content ?? ""}
  {/if}
</p>
