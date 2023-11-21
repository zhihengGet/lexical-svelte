<script lang="ts">
  import "./ContentEditable.css";

  import ContentEditable from "@lexical/react/LexicalContentEditable.svelte";

  let { className } = $props<{ className?: string }>();
</script>

<ContentEditable class={className || "ContentEditable__root"} />
