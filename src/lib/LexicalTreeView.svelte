<script lang="ts">
	import type { EditorState, LexicalEditor } from 'lexical';
	import {
		type CustomPrintNodeFn,
		generateContent,
		useLexicalCommandsLog
	} from './lexical-devtools-core/src';
	import { TreeView as TreeViewCore } from './lexical-devtools-core/src';
	import { mergeRegister } from '@lexical/utils';
	import { useRef, useState } from 'react';

	const NON_SINGLE_WIDTH_CHARS_REPLACEMENT: Readonly<Record<string, string>> = Object.freeze({
		'\t': '\\t',
		'\n': '\\n'
	});
	const NON_SINGLE_WIDTH_CHARS_REGEX = new RegExp(
		Object.keys(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).join('|'),
		'g'
	);
	const SYMBOLS: Record<string, string> = Object.freeze({
		ancestorHasNextSibling: '|',
		ancestorIsLastChild: ' ',
		hasNextSibling: '├',
		isLastChild: '└',
		selectedChar: '^',
		selectedLine: '>'
	});

	let {
		treeTypeButtonclass,
		timeTravelButtonclass,
		timeTravelPanelSliderclass,
		timeTravelPanelButtonclass,
		viewclass,
		timeTravelPanelclass,
		editor,
		customPrintNode
	}: {
		editor: LexicalEditor;
		treeTypeButtonclass?: string;
		timeTravelButtonclass?: string;
		timeTravelPanelButtonclass?: string;
		timeTravelPanelclass?: string;
		timeTravelPanelSliderclass?: string;
		viewclass?: string;
		customPrintNode?: CustomPrintNodeFn;
	} = $props();
	//unwrap below function
	const treeElementRef = useRef<Element>(null);
	const [editorCurrentState, setEditorCurrentState] = useState<EditorState>(
		editor.getEditorState()
	);

	const commandsLog = useLexicalCommandsLog(editor);

	$effect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				setEditorCurrentState(editorState);
			}),
			editor.registerEditableListener(() => {
				setEditorCurrentState(editor.getEditorState());
			})
		);
	});

	$effect(() => {
		const element = treeElementRef.current;
		if (element !== null) {
			// @ts-ignore Internal field
			element.__lexicalEditor = editor;

			return () => {
				// @ts-ignore Internal field
				element.__lexicalEditor = null;
			};
		}
	});

	const handleEditorReadOnly = (isReadonly: boolean) => {
		const rootElement = editor.getRootElement();
		if (rootElement == null) {
			return;
		}

		rootElement.contentEditable = isReadonly ? 'false' : 'true';
	};
</script>

<TreeViewCore
	{treeTypeButtonclass}
	{timeTravelButtonclass}
	{timeTravelPanelSliderclass}
	{timeTravelPanelButtonclass}
	{viewclass}
	{timeTravelPanelclass}
	setEditorReadOnly={handleEditorReadOnly}
	editorState={editorCurrentState()}
	setEditorState={(state) => editor.setEditorState(state)}
	generateContent={async function (exportDOM) {
		return generateContent(editor, commandsLog(), exportDOM, customPrintNode);
	}}
	ref={treeElementRef}
/>
