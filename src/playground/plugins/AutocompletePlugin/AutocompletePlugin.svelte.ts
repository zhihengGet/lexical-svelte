import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { mergeRegister } from '@lexical/utils';
import {
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_LOW,
	KEY_ARROW_RIGHT_COMMAND,
	KEY_TAB_COMMAND,
	$createTextNode as createTextNode,
	$getSelection as getSelection
} from 'lexical';

import type { UpdateListener } from 'lexical/LexicalEditor';
import { createRoot, getAllContexts, onDestroy } from 'svelte';
import { ClickAutoComplete, search, type useQuery, type SearchPromise } from '.';
import { useSharedAutocompleteContext } from '../../context/SharedAutocompleteContext.svelte';
import { getCaretTopPoint } from '../../utils/careat';
import { addSwipeRightListener } from '../../utils/swipe';
import AutocompleteComponent from './AutocompleteComponent.svelte';

export default function AutocompletePlugin({
	query = () => {
		return {
			promise: new Promise((v) =>
				v([
					'test',
					'test1',
					'12333333333333333333333333333',
					'12333333333333333333333333333333',
					'test',
					'test1',
					'12333333333333333333333333333',
					'12333333333333333333333333333333'
				])
			),
			dismiss: () => {}
		};
	}
}: {
	query?: ReturnType<typeof useQuery>;
}) {
	const [editor] = useLexicalComposerContext();
	const suggestion_state = useSharedAutocompleteContext();
	//const query = useQuery();

	//let lastSuggestion: null | string = null;
	let searchPromise: null | SearchPromise = null;
	const editorContext = getAllContexts();
	const el = createRoot(AutocompleteComponent, {
		target: document.body,
		top: 0,
		left: 0,
		context: editorContext
	});
	async function handleUpdate(arg: Parameters<UpdateListener>[0]) {
		console.log('calling handleUpdate', arg);
		//if (arg.tags.has('autocomplete') || arg.tags.has('history-merge')) return;

		searchPromise?.dismiss?.();
		searchPromise = null;
		suggestion_state.suggestions = [];
		editor.update(async () => {
			const selection = getSelection()?.clone();

			if (!selection) return;

			const [hasMatch, match] = search(selection);

			if (hasMatch) {
				searchPromise = query(match);

				const words = (await searchPromise.promise) || [];

				const props = getCaretTopPoint();
				props.left += 10;
				props.top += -2;
				//props.visibility = 'visible';
				suggestion_state.suggestions = words;
				console.log('props', props);
				suggestion_state.select = words[0];
				el.$set(props);
			}
		});
	}
	function handleAutocompleteIntent(): boolean {
		const lastSuggestion = suggestion_state.select ?? '';
		const textNode = createTextNode(lastSuggestion);
		const selection = getSelection();
		selection?.insertNodes([textNode]);
		textNode.selectNext();
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
			//clearSuggestion();
		});
	}

	const rootElem = editor.getRootElement();
	//const waitFn = debounce(handleUpdate, 500);
	const un = mergeRegister(
		//	editor.registerNodeTransform(AutocompleteNode, handleAutocompleteNodeTransform),
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
		el.$destroy();
	});
	return un;
}
