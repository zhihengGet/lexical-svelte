<script lang="ts">
  import "./ContentEditable.css";

  import ContentEditable from "@lexical/react/LexicalContentEditable.svelte";
  import * as React from "react";

  let { className } = $props<{ className?: string }>();
</script>

<ContentEditable class={className || "ContentEditable__root"} />
