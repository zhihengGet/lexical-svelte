<script lang="ts">
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    MenuTextMatch,
    useBasicTypeaheadTriggerMatch,
  } from "@lexical/react/LexicalTypeaheadMenuPlugin.svelte";
  import { TextNode } from "lexical";
  import { useCallback, useEffect, useMemo, useState } from "react";
  import * as React from "react";
  import * as ReactDOM from "react-dom";

  import { $createMentionNode } from "../../nodes/MentionNode";
</script>
