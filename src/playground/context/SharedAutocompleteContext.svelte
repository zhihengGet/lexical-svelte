<script context="module" lang="ts">
	let totalComponents = 0;
	import { useEffect, useMemo, useState } from 'react';
	import { getContext, setContext } from 'svelte';
	totalComponents += 1;
	let contextkey = 'AutoCompleteContext';
	type Suggestion = null | string[];
	type CallbackFn = (newSuggestion: Suggestion) => void;
	type SubscribeFn = (callbackFn: CallbackFn) => () => void;
	type PublishFn = (newSuggestion: Suggestion) => void;
	type ContextShape = [SubscribeFn, PublishFn];
	type HookShape = [suggestion: () => Suggestion, setSuggestion: PublishFn];
	const autocomplete: { suggestions: string[]; select: string; search: string } = $state({
		suggestions: [],
		select: '',
		search: ''
	});

	export const useSharedAutocompleteContext = () => {
		const data = getContext(contextkey);
		/* const [suggestion, setSuggestion] = useState<Suggestion>(null);
		useEffect(() => {
			return subscribe((newSuggestion: Suggestion) => {
				setSuggestion(newSuggestion);
			});
		}, [subscribe]); */
		return data as typeof autocomplete;
	};
</script>

<script lang="ts">
	let { children } = $props();
	setContext(contextkey, autocomplete);
</script>

{@render children()}
