<script module lang="ts">
	import { $generateNodesFromDOM as generateNodesFromDOM } from '@lexical/html';

	const HISTORY_MERGE_OPTIONS = { tag: 'history-merge' };
</script>

<script lang="ts">
	import type { LexicalComposerContextType } from '@lexical/react/LexicalComposerContext.svelte';
	import * as lex from 'lexical';
	import {
		createLexicalComposerContext,
		setLexicalComposerContext
	} from '@lexical/react/LexicalComposerContext.svelte';
	import type { LexicalEditor } from 'lexical';
	import { createEditor } from 'lexical';

	import { $generateHtmlFromNodes as generateHtmlFromNodes } from '@lexical/html';
	import { onDestroy, type Snippet } from 'svelte';
	import { useSettings } from '../playground/appSettings';
	import { CustomParagraphNode } from '@nodes/CustomParagrahNode';

	let { children, bindEditor = $bindable() }: { children: Snippet; bindEditor?: LexicalEditor } =
		$props();
	let setting = useSettings();
	const {
		onInput,
		allowedAttributesOnParagraph,
		config: {
			theme,
			namespace,
			editor__DEPRECATED: initialEditor, // not used
			nodes,
			onError,
			editorState: initialEditorState,
			html,
			editable
		},
		initialHTML
	} = $derived(setting());

	CustomParagraphNode.allowedAttributes = allowedAttributesOnParagraph;

	const context: LexicalComposerContextType = $derived(createLexicalComposerContext(null, theme));
	let editor = initialEditor || null;

	if (editor === null) {
		// only editable need to be reactive, other is one-off setting?
		const newEditor = createEditor({
			editable: editable,
			html,
			namespace,
			nodes,
			onError: (error) => onError(error, newEditor),
			theme
		});
		//initializeEditor(newEditor, initialEditorState);

		editor = newEditor;
		$effect.pre(() => {
			editor!.update(() => {
				// In the browser you can use the native DOMParser API to parse the HTML string.
				const parser = new DOMParser();
				const dom = parser.parseFromString(initialHTML ?? '<p data-id="213">hi</p>', 'text/html');

				// Once you have the DOM instance it's easy to generate LexicalNodes.
				const nodes = generateNodesFromDOM(editor!, dom);

				// Select the root
				lex.$getRoot().select();
				lex.$getRoot().clear();
				// Insert them at a selection.
				lex.$insertNodes(nodes);
				console.log('lexical:initialHTML', initialHTML.length);
				// Insert them at a selection.
			}, HISTORY_MERGE_OPTIONS);
		});
		/* editor.update(() => {
				const root = getRoot();
				if (root.isEmpty()) {
					const paragraph = lex.$createParagraphNode();
					root.append(paragraph);
					const activeElement = CAN_USE_DOM ? document.activeElement : null;
					if (
						getSelection() !== null ||
						(activeElement !== null && activeElement === editor.getRootElement())
					) {
						paragraph.select();
					}
				}
			}, HISTORY_MERGE_OPTIONS); */
		/* editor.update(() => {
			// In the browser you can use the native DOMParser API to parse the HTML string.
			const parser = new DOMParser();
			const dom = parser.parseFromString(initialHTML ?? '<p data-id="213">hi</p>', 'text/html');

			// Once you have the DOM instance it's easy to generate LexicalNodes.
			const nodes = generateNodesFromDOM(editor, dom);

			// Select the root
			lex.$getRoot().select();
			// Insert them at a selection.
			lex.$insertNodes(nodes);

			// Insert them at a selection.
		}, HISTORY_MERGE_OPTIONS); */
		const un = editor.registerUpdateListener(({ editorState }) => {
			// In the browser you can use the native DOMParser API to parse the HTML string.
			// The latest EditorState can be found as `editorState`.
			// To read the contents of the EditorState, use the following API:
			if (!editable) {
				return;
			}
			editorState.read(() => {
				// Just like editor.update(), .read() expects a closure where you can use
				// the $ prefixed helper functions.
				if (editor) {
					const htmlString = generateHtmlFromNodes(editor);
					onInput(htmlString);
					//console.log('export html', htmlString);
				}
				//console.table('JSON', editorState.toJSON().root.children);
			});
		});
		onDestroy(un);
	}
	bindEditor = editor;
	setLexicalComposerContext([editor, context]);
	$effect(() => {
		editor?.setEditable(editable ?? true);
	});
</script>

{@render children()}
