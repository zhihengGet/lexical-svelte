type ContextShape = {
  historyState?: HistoryState;
};

import type { HistoryState } from "@lexical/react/LexicalHistoryPlugin.svelte";

import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin.svelte";
import * as React from "react";
import { createContext, useMemo } from "react";
import { getContext, setContext } from "svelte";

export const createHistoryContext = () =>
  setContext("SharedHistoryContext", {});

const historyContext = useMemo(
  () => ({ historyState: createEmptyHistoryState() }),
  []
);

export const useSharedHistoryContext = (): ContextShape => {
  return getContext("SharedHistoryContext");
};
