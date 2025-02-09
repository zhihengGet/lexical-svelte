/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
	EditorState,
	EditorThemeClasses,
	HTMLConfig,
	Klass,
	LexicalEditor,
	LexicalNode,
	LexicalNodeReplacement
} from 'lexical';

import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';

import { CustomParagraphNode } from '@nodes/CustomParagrahNode';
import { ParagraphNode, TextNode } from 'lexical';
import PlaygroundNodes from './PlaygroundNodes';
import { getContext, onDestroy, setContext, type SvelteComponent, type Snippet } from 'svelte';
import type { SearchPromise, useQuery } from '@plugins/AutocompletePlugin';
import { ExtendedTextNode } from '@nodes/CustomTextNode';

/* const hostName = typeof window!  window.location.hostname;
export const isDevPlayground: boolean =
	hostName !== 'playground.lexical.dev' && hostName !== 'lexical-playground.vercel.app'; */
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
	query?: ReturnType<typeof useQuery> | null;
	editable?: boolean;
	theme?: EditorThemeClasses;
	editorState?: InitialEditorStateType;
	html?: HTMLConfig;
	isHTML?: boolean; //is initial state html
}>;
export const DEFAULT_SETTINGS = {
	contentEditableAttrs: { 'data-a': 1 },
	disableBeforeInput: false,
	floatingToolbar: true,
	emptyEditor: false,
	equation: false,
	isAutocomplete: true,
	isCharLimit: false,
	isCharLimitUtf8: true,
	isUndoRedo: true,
	isBlockFormatDropdown: true,
	isFont: true,
	isCollab: false,
	isDraggable: true,
	isMaxLength: true,
	maxSizeMB: 5,
	maxLength: 10000,
	onSizeLimit: () => {},
	onSizeRefresh: () => {},
	isRichText: true,
	measureTypingPerf: false,
	shouldUseLexicalContextMenu: false,
	showNestedEditorTreeView: false,
	showTableOfContents: false,
	showTreeView: true,
	tableCellBackgroundColor: true,
	tableCellMerge: true,
	image: true,
	dev: true,
	editorCSS: '',
	toolbarCSS: '',
	markdown: false,
	hasLinkAttributes: false,
	showToolbar: true,
	imageUpload: true,
	onInput: (html: string) => {
		console.log('on input', html);
	},
	initialHTML: '',
	paragraphComment: false,
	allowedAttributesOnParagraph: ['data-chapter-comment-id'],
	paragraphCommentCloseFn: (props: {
		id: string;
		paragraphNode: ParagraphNode;
		paragraphContent: string;
	}) => {},
	paragraphCommentClickFn: (props: {
		id: string;
		paragraphNode: ParagraphNode;
		paragraphContent: string;
	}) => {},
	initialLifeCycle: {
		beforeInitialHTMLRender: () => null,
		afterInitialHTMLRender: () => null
	},
	paragraphCommentComponent: null,
	autoInsertComment: false,
	AutocompleteComponent: null,
	config: {
		query: undefined,
		upload: async (data: File) => '',
		editable: true,
		editorState: JSON.stringify(
			{
				editorState: {
					root: {
						children: [
							{
								children: [
									{
										detail: 0,
										format: 0,
										mode: 'normal',
										style: '',
										text: 'world',
										type: 'text',
										version: 1
									}
								],
								direction: 'ltr',
								format: '',
								indent: 0,
								type: 'paragraph',
								version: 1
							}
						],
						direction: 'ltr',
						format: '',
						indent: 0,
						type: 'root',
						version: 1
					}
				},
				lastSaved: 1701226322214,
				source: 'Playground',
				version: '0.12.4'
			}.editorState
		),
		namespace: 'Playground',
		nodes: [
			...PlaygroundNodes,
			CustomParagraphNode,
			{
				replace: ParagraphNode,
				with: () => {
					//CustomParagraphNode.allowedAttributes = DEFAULT_SETTINGS.allowedAttributesOnParagraph;
					/* 	const setting = useSettings();
					if (setting) {
						CustomParagraphNode.allowedAttributes = setting().allowedAttributesOnParagraph;
					} */
					return new CustomParagraphNode();
				}
			}, // Don't forget to register your custom node separately!
			ExtendedTextNode,
			{
				replace: TextNode,
				with: (node: TextNode) => {
					return new ExtendedTextNode(node.__text);
				}
			}
		],
		onError: (error: Error) => {
			console.error('error initialize', error);
			throw error;
		},
		theme: PlaygroundEditorTheme
	}
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = Omit<
	typeof DEFAULT_SETTINGS,
	'config' | 'paragraphCommentComponent' | 'AutocompleteComponent'
> & {
	config: InitialConfigType & { upload: (file: File) => Promise<string> };
	paragraphCommentComponent: SvelteComponent;
	AutocompleteComponent: SvelteComponent;
} & {
	onInput: (s: string) => unknown;
};

const context = 'setting context';
export const useSettings = () => {
	return getContext(context) as () => Settings;
};
export const settingContext = (config: () => Settings) => {
	setContext(context, config);
};
