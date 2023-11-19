<script context="module">
  let totalComponents = 0;
</script>

<script lang="ts">
  import { useEffect, useMemo, useState } from "react";
  import { getContext, setContext } from "svelte";
  totalComponents += 1;
  let contextkey = totalComponents + "AutoCompleteContext";
  type Suggestion = null | string;
  type CallbackFn = (newSuggestion: Suggestion) => void;
  type SubscribeFn = (callbackFn: CallbackFn) => () => void;
  type PublishFn = (newSuggestion: Suggestion) => void;
  type ContextShape = [SubscribeFn, PublishFn];
  type HookShape = [suggestion: () => Suggestion, setSuggestion: PublishFn];

  setContext(contextkey, [
    (_cb) => () => {
      return;
    },
    (_newSuggestion: Suggestion) => {
      return;
    },
  ]);

  const context: ContextShape = useMemo(() => {
    let suggestion: Suggestion | null = null;
    const listeners: Set<CallbackFn> = new Set();
    return [
      (cb: (newSuggestion: Suggestion) => void) => {
        cb(suggestion);
        listeners.add(cb);
        return () => {
          listeners.delete(cb);
        };
      },
      (newSuggestion: Suggestion) => {
        suggestion = newSuggestion;
        for (const listener of listeners) {
          listener(newSuggestion);
        }
      },
    ];
  }, []);

  export const useSharedAutocompleteContext = (): HookShape => {
    const [subscribe, publish]: ContextShape = getContext(contextkey);
    const [suggestion, setSuggestion] = useState<Suggestion>(null);
    useEffect(() => {
      return subscribe((newSuggestion: Suggestion) => {
        setSuggestion(newSuggestion);
      });
    }, [subscribe]);
    return [suggestion, publish];
  };
</script>

<slot />
