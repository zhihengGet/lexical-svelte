<script>
  import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin.svelte";
  import * as React from "react";

  import { validateUrl } from "../../utils/url";
  LexicalLinkPlugin({ validateUrl });
</script>
