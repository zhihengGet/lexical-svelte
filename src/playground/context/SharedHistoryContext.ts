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
let contextkey = 'AutoCompleteContext';
export const useSharedAutocompleteContext = () => {
	const data = getContext(contextkey);
	/* const [suggestion, setSuggestion] = useState<Suggestion>(null);
	useEffect(() => {
		return subscribe((newSuggestion: Suggestion) => {
			setSuggestion(newSuggestion);
		});
	}, [subscribe]); */
	return data as { suggestions: string[]; select: string; search: string };
};
