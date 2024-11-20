/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { type ElementFormatType } from 'lexical';

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

const rootTypeToRootName = {
	root: 'Root',
	table: 'Table'
};

export const blockTypeToBlockName = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote',
	'custom-paragraph': 'Normal'
};

const INITIAL_TOOLBAR_STATE = {
	bgColor: '#fff',
	blockType: 'paragraph' as keyof typeof blockTypeToBlockName,
	canRedo: false,
	canUndo: false,
	codeLanguage: '',
	elementFormat: 'left' as ElementFormatType,
	fontColor: '#000',
	fontFamily: 'Arial',
	// Current font size in px
	fontSize: `${DEFAULT_FONT_SIZE}px`,
	// Font size input value - for controlled input
	fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
	isBold: false,
	isCode: false,
	isImageCaption: false,
	isItalic: false,
	isLink: false,
	isRTL: false,
	isStrikethrough: false,
	isSubscript: false,
	isSuperscript: false,
	isUnderline: false,
	rootType: 'root' as keyof typeof rootTypeToRootName
};

type ToolbarState = typeof INITIAL_TOOLBAR_STATE;

// Utility type to get keys and infer value types
type ToolbarStateKey = keyof ToolbarState;
type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key];

type ContextShape = {
	toolbarState: ToolbarState;
	updateToolbarState<Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>): void;
};

const Context = 'TOOLBAR CONTEXT';

export const ToolbarContext = () => {
	let toolbarState = $state(INITIAL_TOOLBAR_STATE);
	const selectionFontSize = toolbarState.fontSize;

	const updateToolbarState = <Key extends ToolbarStateKey>(
		key: Key,
		value: ToolbarStateValue<Key>
	) => {
		/* 	Object.assign(toolbarState, { [key]: value }); */
		toolbarState = {
			...toolbarState,
			[key]: value
		};
	};

	$effect(() => {
		untrack(() => {
			updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2));
		});
	});

	const contextValue = () => {
		return {
			toolbarState,
			updateToolbarState
		};
	};

	setContext(Context, contextValue);
};
import { getContext, setContext, untrack, type Snippet } from 'svelte';
export const useToolbarState = () => {
	const context: () => {
		toolbarState: ToolbarState;
		updateToolbarState: <Key extends ToolbarStateKey>(
			key: Key,
			value: ToolbarStateValue<Key>
		) => void;
	} = getContext(Context);

	if (context() === undefined) {
		throw new Error('useToolbarState must be used within a ToolbarProvider');
	}
	console.log('context', context().toolbarState);

	return context;
};
