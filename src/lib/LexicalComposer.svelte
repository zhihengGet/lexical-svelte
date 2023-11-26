<script context="module" lang="ts">
	export type InitialEditorStateType =
		| null
		| string
		| EditorState
		| ((editor: LexicalEditor) => void);

	export type InitialConfigType = Readonly<{
		editor__DEPRECATED?: LexicalEditor | null;
		namespace: string;
		nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
		onError: (error: Error, editor: LexicalEditor) => void;
		editable?: boolean;
		theme?: EditorThemeClasses;
		editorState?: InitialEditorStateType;
		html?: HTMLConfig;
	}>;
	type Props = {
		initialConfig: InitialConfigType;
	};
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
	import { createEditor } from 'lexical';

	import { CAN_USE_DOM } from 'shared/canUseDOM';
	import { useMemo } from 'react';

	let { initialConfig } = $props<Props>();

	const composerContext: [LexicalEditor, LexicalComposerContextType] = useMemo(() => {
		const {
			theme,
			namespace,
			editor__DEPRECATED: initialEditor,
			nodes,
			onError,
			editorState: initialEditorState,
			html
		} = initialConfig;

		const context: LexicalComposerContextType = createLexicalComposerContext(null, theme);
		let editor = initialEditor || null;
		if (editor === null) {
			const newEditor = createEditor({
				editable: initialConfig.editable,
				html,
				namespace,
				nodes,
				onError: (error) => onError(error, newEditor),
				theme
			});

			initializeEditor(newEditor, initialEditorState);

			editor = newEditor;
			editor.registerUpdateListener((v) => {
				console.log(v.editorState.toJSON());
			});
		}
		//    editor?.setEditable(true);
		return [editor, context];
	}, []);

	setLexicalComposerContext(composerContext);
	//  return [editor, context];

	/*   useLayoutEffect(() => {
    const isEditable = initialConfig.editable;
    const [editor] = composerContext;
    editor.setEditable(isEditable !== undefined ? isEditable : true);

    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }); */

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
					const parsedEditorState = editor.parseEditorState(initialEditorState);
					editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
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
