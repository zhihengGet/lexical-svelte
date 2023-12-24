<script context="module" lang="ts">
	import { $generateNodesFromDOM as generateNodesFromDOM } from '@lexical/html';

	const HISTORY_MERGE_OPTIONS = { tag: 'history-merge' };
</script>

<script lang="ts">
	/* intialize editor */
	import type { LexicalComposerContextType } from '@lexical/react/LexicalComposerContext.svelte';
	import * as lex from 'lexical';

	import {
		createLexicalComposerContext,
		setLexicalComposerContext
	} from '@lexical/react/LexicalComposerContext.svelte';
	import type {
		EditorState,
		EditorThemeClasses,
		HTMLConfig,
		Klass,
		LexicalEditor,
		LexicalNode,
		LexicalNodeReplacement
	} from 'lexical';
	import { createEditor, $getRoot as getRoot } from 'lexical';

	import { CAN_USE_DOM } from 'shared/canUseDOM';
	import { useMemo } from 'react';
	import { $generateHtmlFromNodes as generateHtmlFromNodes } from '@lexical/html';
	import { useSettings, type InitialEditorStateType } from '../playground/appSettings';

	let setting = useSettings();
	const {
		onInput,
		config: {
			theme,
			namespace,
			editor__DEPRECATED: initialEditor,
			nodes,
			onError,
			editorState: initialEditorState,
			html,
			editable
		},
		initialHTML
	} = setting();
	useMemo(() => {
		const context: LexicalComposerContextType = createLexicalComposerContext(null, theme);
		let editor = initialEditor || null;
		if (editor === null) {
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

			editor.update(() => {
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
			});
			editor.registerUpdateListener(({ editorState }) => {
				// In the browser you can use the native DOMParser API to parse the HTML string.
				// The latest EditorState can be found as `editorState`.
				// To read the contents of the EditorState, use the following API:

				editorState.read(() => {
					// Just like editor.update(), .read() expects a closure where you can use
					// the $ prefixed helper functions.
					if (editor) {
						const htmlString = generateHtmlFromNodes(editor);
						onInput(htmlString);
						//console.log('export html', htmlString);
					}
					console.table('JSON', editorState.toJSON().root.children);
				});
			});
		}
		setLexicalComposerContext([editor, context]);
		//    editor?.setEditable(true);
		return [editor, context];
	}, []);

	function initializeEditor(
		editor: LexicalEditor,
		initialEditorState?: InitialEditorStateType
	): void {
		if (initialEditorState === null) {
			return;
		} else if (initialEditorState === undefined) {
			editor.update(() => {
				const root = lex.$getRoot();
				if (root.isEmpty()) {
					const paragraph = lex.$createParagraphNode();
					root.append(paragraph);
					const activeElement = CAN_USE_DOM ? document.activeElement : null;
					if (
						lex.$getSelection() !== null ||
						(activeElement !== null && activeElement === editor.getRootElement())
					) {
						paragraph.select();
					}
				}
			}, HISTORY_MERGE_OPTIONS);
		} else if (initialEditorState !== null) {
			switch (typeof initialEditorState) {
				case 'string': {
					if (initialHTML) {
						editor.update(() => {
							// In the browser you can use the native DOMParser API to parse the HTML string.
							const parser = new DOMParser();
							const dom = parser.parseFromString(initialEditorState, 'text/html');

							// Once you have the DOM instance it's easy to generate LexicalNodes.
							const nodes = generateNodesFromDOM(editor, dom);

							// Select the root
							lex.$getRoot().select();

							// Insert them at a selection.
							lex.$insertNodes(nodes);
						});
					} else {
						const parsedEditorState = editor.parseEditorState(initialEditorState);
						editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
					}

					break;
				}
				case 'object': {
					console.log('setting editor state', initialEditorState);
					editor.setEditorState(initialEditorState, HISTORY_MERGE_OPTIONS);
					break;
				}
				case 'function': {
					editor.update(() => {
						const root = lex.$getRoot();
						if (root.isEmpty()) {
							initialEditorState(editor);
						}
					}, HISTORY_MERGE_OPTIONS);
					break;
				}
			}
		}
	}
</script>

<slot />
