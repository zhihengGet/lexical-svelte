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
import {
	$isLinkNode as isLinkNode,
	LinkNode,
	TOGGLE_LINK_COMMAND,
	toggleLink
} from '@lexical/link';
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
	type ElementFormatType,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	KEY_MODIFIER_COMMAND,
	type LexicalEditor,
	type NodeKey,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
	COMMAND_PRIORITY_LOW,
	PASTE_COMMAND
} from 'lexical';
import { useEffect } from 'react';

type Props = {
	validateUrl?: (url: string) => boolean;
};

export function LinkPlugin({ validateUrl }: Props): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([LinkNode])) {
			throw new Error('LinkPlugin: LinkNode not registered on editor');
		}
		return mergeRegister(
			editor.registerCommand(
				TOGGLE_LINK_COMMAND,
				(payload) => {
					if (payload === null) {
						toggleLink(payload);
						return true;
					} else if (typeof payload === 'string') {
						if (validateUrl === undefined || validateUrl(payload)) {
							toggleLink(payload);
							return true;
						}
						return false;
					} else {
						const { url, target, rel, title } = payload;
						toggleLink(url, { rel, target, title });
						return true;
					}
				},
				COMMAND_PRIORITY_LOW
			),
			validateUrl !== undefined
				? editor.registerCommand(
						PASTE_COMMAND,
						(event) => {
							const selection = getSelection();
							if (
								!isRangeSelection(selection) ||
								selection.isCollapsed() ||
								!(event instanceof ClipboardEvent) ||
								event.clipboardData == null
							) {
								return false;
							}
							const clipboardText = event.clipboardData.getData('text');
							if (!validateUrl(clipboardText)) {
								return false;
							}
							// If we select nodes that are elements then avoid applying the link.
							if (!selection.getNodes().some((node) => isElementNode(node))) {
								editor.dispatchCommand(TOGGLE_LINK_COMMAND, clipboardText);
								event.preventDefault();
								return true;
							}
							return false;
						},
						COMMAND_PRIORITY_LOW
				  )
				: () => {
						// Don't paste arbritrary text as a link when there's no validate function
				  }
		);
	}, [editor, validateUrl]);

	return null;
}
