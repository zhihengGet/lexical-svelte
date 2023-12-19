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
import { ParagraphNode } from 'lexical';
import PlaygroundNodes from './PlaygroundNodes';
import { getContext, setContext } from 'svelte';
const hostName = window.location.hostname;
export const isDevPlayground: boolean =
	hostName !== 'playground.lexical.dev' && hostName !== 'lexical-playground.vercel.app';
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
	query: (query: string) => string[];
	editable?: boolean;
	theme?: EditorThemeClasses;
	editorState?: InitialEditorStateType;
	html?: HTMLConfig;
	isHTML?: boolean; //is initial state html
}>;
export const DEFAULT_SETTINGS = {
	disableBeforeInput: false,
	emptyEditor: isDevPlayground,
	isAutocomplete: false,
	isCharLimit: false,
	isCharLimitUtf8: true,
	isUndoRedo: true,
	isBlockFormatDropdown: true,
	isFont: true,
	isCollab: false,
	isMaxLength: false,
	isRichText: true,
	measureTypingPerf: false,
	shouldUseLexicalContextMenu: false,
	showNestedEditorTreeView: false,
	showTableOfContents: false,
	showTreeView: true,
	tableCellBackgroundColor: true,
	tableCellMerge: true,
	onInput: (html) => {},
	initialHTML: '<p>Hi</p>',
	allowedAttributesOnParagraph: [''],
	config: {
		query: async () => [],
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
					return new CustomParagraphNode();
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

export type Settings = Omit<typeof DEFAULT_SETTINGS, 'config'> & { config: InitialConfigType } & {
	onInput: (s: string) => unknown;
};
const context = 'setting context';
export const useSettings = () => {
	return getContext(context) as () => Settings;
};
export const settingContext = (config: () => Settings) => {
	setContext(context, config);
};
