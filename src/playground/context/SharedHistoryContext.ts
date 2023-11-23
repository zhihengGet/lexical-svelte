type ContextShape = {
	historyState?: HistoryState;
};

import type { HistoryState } from '@lexical/react/LexicalHistoryPlugin.svelte';

import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin.svelte';

import { getContext, setContext } from 'svelte';

export const createHistoryContext = () =>
	setContext('SharedHistoryContext', { historyState: createEmptyHistoryState() });

//const historyContext = useMemo(() => ({ historyState: createEmptyHistoryState() }), []);

export const useSharedHistoryContext = (): ContextShape => {
	return getContext('SharedHistoryContext');
};
