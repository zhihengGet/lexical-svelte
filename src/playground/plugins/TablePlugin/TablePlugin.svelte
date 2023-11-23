<script context="module" lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import {
		$createCodeNode as createCodeNode,
		$isCodeNode as isCodeNode,
		CODE_LANGUAGE_FRIENDLY_NAME_MAP,
		CODE_LANGUAGE_MAP,
		getLanguageFriendlyName
	} from '@lexical/code';
	import { $isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
	import {
		$isListNode as isListNode,
		INSERT_CHECK_LIST_COMMAND,
		INSERT_ORDERED_LIST_COMMAND,
		INSERT_UNORDERED_LIST_COMMAND,
		ListNode,
		REMOVE_LIST_COMMAND
	} from '@lexical/list';
	import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin.svelte';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { $isDecoratorBlockNode as isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
	import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
	import {
		$createHeadingNode as createHeadingNode,
		$createQuoteNode as createQuoteNode,
		$isHeadingNode as isHeadingNode,
		$isQuoteNode as isQuoteNode
	} from '@lexical/rich-text';
	import {
		$getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
		$isParentElementRTL as isParentElementRTL,
		$patchStyleText as patchStyleText,
		$setBlocksType as setBlocksType
	} from '@lexical/selection';
	import { $isTableNode as isTableNode } from '@lexical/table';
	import {
		$findMatchingParent as findMatchingParent,
		$getNearestBlockElementAncestorOrThrow as getNearestBlockElementAncestorOrThrow,
		$getNearestNodeOfType as getNearestNodeOfType,
		mergeRegister
	} from '@lexical/utils';
	import {
		$createParagraphNode as createParagraphNode,
		$getNodeByKey as getNodeByKey,
		$getRoot as getRoot,
		$getSelection as getSelection,
		$isElementNode as isElementNode,
		$isRangeSelection as isRangeSelection,
		$isRootOrShadowRoot as isRootOrShadowRoot,
		$isTextNode as isTextNode,
		CAN_REDO_COMMAND,
		CAN_UNDO_COMMAND,
		COMMAND_PRIORITY_CRITICAL,
		COMMAND_PRIORITY_NORMAL,
		FORMAT_ELEMENT_COMMAND,
		FORMAT_TEXT_COMMAND,
		INDENT_CONTENT_COMMAND,
		KEY_MODIFIER_COMMAND,
		OUTDENT_CONTENT_COMMAND,
		REDO_COMMAND,
		SELECTION_CHANGE_COMMAND,
		UNDO_COMMAND,
		type Klass,
		type LexicalNode,
		type LexicalEditor,
		type EditorThemeClasses,
		type LexicalCommand,
		createCommand
	} from 'lexical';

	import { createContext, useEffect, useMemo, useState } from 'react';
	import * as React from 'react';
	import invariant from 'shared/invariant';

	import {
		$createTableNodeWithDimensions as createTableNodeWithDimensions,
		TableNode
	} from '@nodes/TableNode/TableNode.svelte';
	import Button from '@ui/Button.svelte';
	import DialogActions from '@ui/DialogActions.svelte';
	import TextInput from '@ui/TextInput.svelte';

	export type InsertTableCommandPayload = Readonly<{
		columns: string;
		rows: string;
		includeHeaders?: boolean;
	}>;

	export type CellContextShape = {
		cellEditorConfig: null | CellEditorConfig;
		cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
		set: (
			cellEditorConfig: null | CellEditorConfig,
			cellEditorPlugins: null | JSX.Element | Array<JSX.Element>
		) => void;
	};

	export type CellEditorConfig = Readonly<{
		namespace: string;
		nodes?: ReadonlyArray<Klass<LexicalNode>>;
		onError: (error: Error, editor: LexicalEditor) => void;
		readOnly?: boolean;
		theme?: EditorThemeClasses;
	}>;

	export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> = createCommand(
		'INSERT_NEW_TABLE_COMMAND'
	);

	export const CellContext = createContext<CellContextShape>({
		cellEditorConfig: null,
		cellEditorPlugins: null,
		set: () => {
			// Empty
		}
	});
</script>

<script lang="ts">
</script>
