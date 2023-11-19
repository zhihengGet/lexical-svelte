<script lang="ts">
  import type { HistoryState } from "@lexical/react/LexicalHistoryPlugin";

  import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin";
  import * as React from "react";
  import { createContext, useMemo } from "react";
  import { getContext, setContext } from "svelte";

  type ContextShape = {
    historyState?: HistoryState;
  };

  setContext("SharedHistoryContext", {});

  const historyContext = useMemo(
    () => ({ historyState: createEmptyHistoryState() }),
    []
  );

  export const useSharedHistoryContext = (): ContextShape => {
    return getContext("SharedHistoryContext");
  };
</script>

<slot />
