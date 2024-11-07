/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
	type LinkAttributes,
	$toggleLink as toggleLink,
	LinkNode,
	TOGGLE_LINK_COMMAND
} from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { mergeRegister, objectKlassEquals } from '@lexical/utils';
import {
	COMMAND_PRIORITY_LOW,
	PASTE_COMMAND,
	$getSelection as getSelection,
	$isElementNode as isElementNode,
	$isRangeSelection as isRangeSelection
} from 'lexical';
import { useEffect } from 'react';

type Props = {
	validateUrl?: (url: string) => boolean;
	attributes?: LinkAttributes;
};

export function LinkPlugin({ validateUrl, attributes }: Props): null {
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
						toggleLink(url, {
							...attributes,
							rel,
							target,
							title
						});
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
								!objectKlassEquals(event, ClipboardEvent)
							) {
								return false;
							}
							const clipboardEvent = event as ClipboardEvent;
							if (clipboardEvent.clipboardData === null) {
								return false;
							}
							const clipboardText = clipboardEvent.clipboardData.getData('text');
							if (!validateUrl(clipboardText)) {
								return false;
							}
							// If we select nodes that are elements then avoid applying the link.
							if (!selection.getNodes().some((node) => isElementNode(node))) {
								editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
									...attributes,
									url: clipboardText
								});
								event.preventDefault();
								return true;
							}
							return false;
						},
						COMMAND_PRIORITY_LOW
					)
				: () => {
						// Don't paste arbitrary text as a link when there's no validate function
					}
		);
	}, [editor, validateUrl]);

	return null;
}
