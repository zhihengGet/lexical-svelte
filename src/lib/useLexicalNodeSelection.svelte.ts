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
	$isQuoteNode as isQuoteNode,
	HeadingTagType
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
import type { LexicalEditor, NodeKey } from 'lexical';
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
	DEPRECATED_$isGridSelection,
	ElementFormatType,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	KEY_MODIFIER_COMMAND,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND
} from 'lexical';

import {
	$createNodeSelection as createNodeSelection,
	$isNodeSelection as isNodeSelection,
	$setSelection as setSelection
} from 'lexical';

import { useCallback, useEffect, useState } from 'react';

function isNodeSelected(editor: LexicalEditor, key: NodeKey): boolean {
	return editor.getEditorState().read(() => {
		const node = getNodeByKey(key);

		if (node === null) {
			return false;
		}

		return node.isSelected();
	});
}

export function useLexicalNodeSelection(
	key: NodeKey
): [() => boolean, (arg0: boolean) => void, () => void] {
	const [editor] = useLexicalComposerContext();

	const [isSelected, setIsSelected] = useState(() => isNodeSelected(editor, key));

	useEffect(() => {
		let isMounted = true;
		const unregister = editor.registerUpdateListener(() => {
			if (isMounted) {
				setIsSelected(isNodeSelected(editor, key));
			}
		});

		return () => {
			isMounted = false;
			unregister();
		};
	}, [editor, key]);

	const setSelected = useCallback(
		(selected: boolean) => {
			editor.update(() => {
				let selection = getSelection();

				if (!isNodeSelection(selection)) {
					selection = createNodeSelection();
					setSelection(selection);
				}

				if (selected) {
					selection.add(key);
				} else {
					selection.delete(key);
				}
			});
		},
		[editor, key]
	);

	const clearSelected = useCallback(() => {
		editor.update(() => {
			const selection = getSelection();

			if (isNodeSelection(selection)) {
				selection.clear();
			}
		});
	}, [editor]);

	return [isSelected, setSelected, clearSelected];
}
