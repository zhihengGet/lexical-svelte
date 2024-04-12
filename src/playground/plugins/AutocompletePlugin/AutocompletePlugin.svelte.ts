import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { mergeRegister } from '@lexical/utils';
import {
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_LOW,
	KEY_ARROW_RIGHT_COMMAND,
	KEY_ESCAPE_COMMAND,
	KEY_TAB_COMMAND,
	$createTextNode as createTextNode,
	$getSelection as getSelection
} from 'lexical';

import type { UpdateListener } from 'lexical/LexicalEditor';
import { getAllContexts, mount, onDestroy, onMount, type ComponentProps, unmount } from 'svelte';
import { ClickAutoComplete, search, type useQuery, type SearchPromise } from '.';
import { useSharedAutocompleteContext } from '../../context/SharedAutocompleteContext.svelte';
import { getCaretGlobalPosition, getCaretTopPoint } from '../../utils/careat';
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
	const el_states = $state({
		top: 0,
		left: 0,
		visibility: 'hidden'
	});
	const el = mount(AutocompleteComponent, {
		target: document.body,
		props: el_states,
		context: editorContext
	});
	function setElState(s: Partial<ComponentProps<AutocompleteComponent>>) {
		el_states.left = s.left ?? el_states.left;
		el_states.top = s.top ?? el_states.top;
		el_states.visibility = s.visibility ?? el_states.visibility;
		el_states.isEnd = s.isEnd;
	}
	const resizePos = () => {
		const props = getCaretGlobalPosition();
		props.left += 10;
		props.top += -2;
		//props.visibility = 'visible';
		setElState(props);
	};
	// update pos on resize
	onMount(() => {
		window.addEventListener('resize', resizePos);
		return () => window.removeEventListener('resize', resizePos);
	});
	async function handleUpdate(arg: Parameters<UpdateListener>[0]) {
		console.log('calling handleUpdate', arg);
		//if (arg.tags.has('autocomplete') || arg.tags.has('history-merge')) return;

		searchPromise?.dismiss?.();
		searchPromise = null;
		suggestion_state.suggestions = [];
		editor.update(async () => {
			const selection = getSelection()?.clone();
			suggestion_state.select = '';
			if (!selection) return;

			const [hasMatch, match, isEnd] = search(selection);
			suggestion_state.search = match;
			if (hasMatch) {
				searchPromise = query(match);

				const words = (await searchPromise.promise) || [];
				// remove matching prefix

				const props = getCaretGlobalPosition();
				props.left += 10;
				props.top += -20;
				//@ts-expect-error ts happy
				props.visibility = 'visible';
				//@ts-expect-error ts happy
				props.isEnd = isEnd;
				suggestion_state.suggestions = words;
				//console.log('props', props);
				suggestion_state.select = words[0];
				setElState(props);
			}
		});
	}
	function handleAutocompleteIntent(): boolean {
		const lastSuggestion = suggestion_state.select ?? '';
		if (lastSuggestion.startsWith(suggestion_state.search) == false) {
			console.warn('text does not start with term?');
		}
		const suffix = lastSuggestion.split(suggestion_state.search)[1]; // only match endWith :(
		if (!suffix) return true;
		const textNode = createTextNode(suffix);
		const selection = getSelection();
		selection?.insertNodes([textNode]);
		textNode.selectNext();
		//const text = textNode.getPreviousSibling();
		//text?.remove();
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
	function onEsc() {
		setElState({ visibility: 'hidden' });
		return false;
	}
	const rootElem = editor.getRootElement();
	//const waitFn = debounce(handleUpdate, 500);
	const un = mergeRegister(
		//	editor.registerNodeTransform(AutocompleteNode, handleAutocompleteNodeTransform),
		editor.registerUpdateListener(handleUpdate),
		editor.registerCommand(KEY_TAB_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),
		editor.registerCommand(KEY_ESCAPE_COMMAND, onEsc, COMMAND_PRIORITY_LOW),
		editor.registerCommand(
			KEY_ESCAPE_COMMAND,
			() => {
				setElState({ visibility: 'hidden' });
				return true;
			},
			COMMAND_PRIORITY_LOW
		),
		editor.registerCommand(ClickAutoComplete, handleAutocompleteIntent, COMMAND_PRIORITY_LOW),
		/* editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW), */
		//editor.registerCommand(KEY_ENTER_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),

		...(rootElem !== null ? [addSwipeRightListener(rootElem, handleSwipeRight)] : []),
		unmountSuggestion
	);
	onDestroy(() => {
		console.log('plugin destroyed');
		un();
		unmount(el);
	});
	return un;
}
