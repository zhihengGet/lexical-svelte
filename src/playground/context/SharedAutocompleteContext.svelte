<script context="module" lang="ts">
	let totalComponents = 0;
	import { useEffect, useMemo, useState } from 'react';
	import { getContext, setContext } from 'svelte';
	totalComponents += 1;
	let contextkey = totalComponents + 'AutoCompleteContext';
	type Suggestion = null | string[];
	type CallbackFn = (newSuggestion: Suggestion) => void;
	type SubscribeFn = (callbackFn: CallbackFn) => () => void;
	type PublishFn = (newSuggestion: Suggestion) => void;
	type ContextShape = [SubscribeFn, PublishFn];
	type HookShape = [suggestion: () => Suggestion, setSuggestion: PublishFn];


	export const useSharedAutocompleteContext = () => {
		const data: autocomplete = getContext(contextkey);
		/* const [suggestion, setSuggestion] = useState<Suggestion>(null);
		useEffect(() => {
			return subscribe((newSuggestion: Suggestion) => {
				setSuggestion(newSuggestion);
			});
		}, [subscribe]); */
		return data;
	};
</script>

<script lang="ts">	class autocomplete {
	suggestions = $state<string[]>([]);
	select = $state<string | null>('');

	updateChoose(n: string) {
		this.select = n;
	}
}
	const c = new autocomplete();

	setContext(contextkey, c);
</script>

<slot />
