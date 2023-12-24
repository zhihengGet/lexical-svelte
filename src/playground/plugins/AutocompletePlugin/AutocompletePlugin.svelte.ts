import type { NodeKey } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { mergeRegister } from '@lexical/utils';
import {
	CLICK_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_RIGHT_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_TAB_COMMAND,
	$createTextNode as createTextNode,
	$getNodeByKey as getNodeByKey,
	$getSelection as getSelection,
	$isRangeSelection as isRangeSelection,
	$setSelection as setSelection
} from 'lexical';

import {
	AutocompleteNode,
	$createAutocompleteNode as createAutocompleteNode,
	search,
	useQuery,
	uuid,
	type SearchPromise,
	ClickAutoComplete
} from '.';
import { useSharedAutocompleteContext } from '../../context/SharedAutocompleteContext.svelte';
import { addSwipeRightListener } from '../../utils/swipe';
import { flushSync, onDestroy } from 'svelte';
import { debounce } from '@melt-ui/svelte/internal/helpers';
import type { EditorUpdateOptions, UpdateListener } from 'lexical/LexicalEditor';
export default function AutocompletePlugin({
	query = useQuery()
}: {
	query?: ReturnType<typeof useQuery>;
}) {
	const [editor] = useLexicalComposerContext();
	const suggestion_state = useSharedAutocompleteContext();
	const promises: Promise<string[]>[] = [];
	//const query = useQuery();

	let autocompleteNodeKey: null | NodeKey = null;
	let lastMatch: null | string = null;
	//let lastSuggestion: null | string = null;
	let searchPromise: null | SearchPromise = null;
	function clearSuggestion() {
		const autocompleteNode =
			autocompleteNodeKey !== null ? getNodeByKey(autocompleteNodeKey) : null;

		if (autocompleteNode !== null && autocompleteNode.isAttached()) {
			autocompleteNode.remove();
			autocompleteNodeKey = null;
		}
		if (searchPromise !== null) {
			searchPromise.dismiss();
			searchPromise = null;
		}
		lastMatch = null;
		//lastSuggestion = null;
		suggestion_state.suggestions = [];
	}
	function updateAsyncSuggestion(refSearchPromise: SearchPromise, newSuggestion: null | string[]) {
		if (searchPromise !== refSearchPromise || newSuggestion === null || newSuggestion.length == 0) {
			console.log(
				'🚀 ~ file: AutocompletePlugin.svelte.ts:64 ~ updateAsyncSuggestion ~ searchPromise:',
				searchPromise
			);
			// Outdated or no suggestion

			return;
		}

		editor.update(
			() => {
				const selection = getSelection();
				const [hasMatch, match] = search(selection);
				if (!hasMatch || match !== lastMatch || !isRangeSelection(selection)) {
					// Outdated
					return;
				}
				const old = selection.clone(); //use to skip autocomplete node TextNode-AutoCompleteNode-TextNode
				const node = createAutocompleteNode(uuid);
				autocompleteNodeKey = node.getKey();
				selection.insertNodes([node]);
				setSelection(old);
				suggestion_state.select = newSuggestion[0];
				suggestion_state.suggestions = newSuggestion;
			},
			{ tag: 'history-merge' }
		);
	}

	function handleAutocompleteNodeTransform(node: AutocompleteNode) {
		const key = node.getKey();
		if (node.__uuid === uuid && key !== autocompleteNodeKey) {
			// Max one Autocomplete node per session
			clearSuggestion();
		}
	}
	function handleUpdate(arg: Parameters<UpdateListener>[0]) {
		console.log('calling handleUpdate', arg);
		if (arg.tags.has('autocomplete') || arg.tags.has('history-merge')) return;
		editor.update(
			() => {
				const selection = getSelection();

				const [hasMatch, match] = search(selection);
				console.log(
					'🚀 ~ file: AutocompletePlugin.svelte.ts:116 ~ editor.update ~ hasMatch, match:',
					hasMatch,
					match,
					selection
				);
				if (!hasMatch) {
					clearSuggestion();
					return;
				}
				if (match === lastMatch) {
					return;
				}
				clearSuggestion();
				searchPromise = query(match);
				searchPromise.promise
					.then((newSuggestion) => {
						console.log(
							'🚀 ~ file: AutocompletePlugin.svelte.ts:113 ~ .then ~ newSuggestion:',
							newSuggestion
						);
						if (searchPromise !== null && newSuggestion) {
							updateAsyncSuggestion(searchPromise, ['!23']);
						}
					})
					.catch((e) => {
						console.error(e);
					});

				lastMatch = match;
			},
			{ tag: 'autocomplete' }
		);
	}
	function handleAutocompleteIntent(): boolean {
		const lastSuggestion = suggestion_state.select;
		if (lastSuggestion === null || autocompleteNodeKey === null) {
			return false;
		}
		const autocompleteNode = getNodeByKey(autocompleteNodeKey);
		if (autocompleteNode === null) {
			return false;
		}
		const textNode = createTextNode(lastSuggestion);
		autocompleteNode.replace(textNode);
		textNode.selectNext();
		clearSuggestion();
		return true;
	}
	function handleKeypressCommand(e: Event) {
		if (handleAutocompleteIntent()) {
			e.preventDefault();
			return true;
		}
		return false;
	}
	function handleSwipeRight(_force: number, e: TouchEvent) {
		editor.update(() => {
			if (handleAutocompleteIntent()) {
				e.preventDefault();
			}
		});
	}
	function unmountSuggestion() {
		editor.update(() => {
			clearSuggestion();
		});
	}

	const rootElem = editor.getRootElement();
	const waitFn = debounce(handleUpdate, 500);
	const un = mergeRegister(
		editor.registerNodeTransform(AutocompleteNode, handleAutocompleteNodeTransform),
		editor.registerUpdateListener(handleUpdate),
		editor.registerCommand(KEY_TAB_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),
		editor.registerCommand(ClickAutoComplete, handleAutocompleteIntent, COMMAND_PRIORITY_LOW),
		editor.registerCommand(
			KEY_ARROW_RIGHT_COMMAND,
			handleKeypressCommand,
			COMMAND_PRIORITY_CRITICAL
		),
		//editor.registerCommand(KEY_ENTER_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),

		...(rootElem !== null ? [addSwipeRightListener(rootElem, handleSwipeRight)] : []),
		unmountSuggestion
	);
	onDestroy(() => {
		console.log('plugin destroyed');
		un();
	});
	return un;
}
