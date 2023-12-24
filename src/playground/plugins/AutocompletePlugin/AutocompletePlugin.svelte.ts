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
import { createRoot, flushSync, getAllContexts, onDestroy } from 'svelte';
import { debounce } from '@melt-ui/svelte/internal/helpers';
import type { EditorUpdateOptions, UpdateListener } from 'lexical/LexicalEditor';
import AutocompleteComponent from './AutocompleteComponent.svelte';
import { getCaretTopPoint } from '../../utils/careat';
/**
 * Get the caret position, relative to the window
 * @returns {object} left, top distance in pixels
 */
function getCaretGlobalPosition() {
	const r = document.getSelection().getRangeAt(0);
	const node = r.startContainer;
	const offset = r.startOffset;
	const pageOffset = { x: window.scrollX, y: window.scrollY };
	let rect, r2;

	if (offset > 0) {
		r2 = document.createRange();
		r2.setStart(node, offset - 1);
		r2.setEnd(node, offset);
		rect = r2.getBoundingClientRect();
		return { left: rect.right + pageOffset.x + 'px', top: rect.bottom + pageOffset.y + 'px' };
	}
}
export default function AutocompletePlugin({
	query = useQuery()
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

		searchPromise?.dismiss();
		searchPromise = null;
		suggestion_state.suggestions = [];
		editor.update(
			async () => {
				const selection = getSelection();

				if (!selection) return;
				const [hasMatch, match] = search(selection);

				if (hasMatch) {
					searchPromise = query(match);

					const words = (await searchPromise.promise) || [];
					const props = getCaretTopPoint();
					props.left += 10;
					props.top += 5;
					props.left += 'px';
					props.top += 'px';
					suggestion_state.suggestions = ['123123', '!23'];
					console.log('porps', props, getCaretGlobalPosition());
					el.$set(props);
				}
			},
			{ tag: 'autocomplete' }
		);
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
		//editor.registerCommand(KEY_TAB_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),
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
