/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EntityMatch } from '@lexical/text';
import type { Klass, TextNode } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { registerLexicalTextEntity } from '@lexical/text';
import { mergeRegister } from '@lexical/utils';

import { onMount } from 'svelte';

export function useLexicalTextEntity<T extends TextNode>(
	getMatch: (text: string) => null | EntityMatch,
	targetNode: Klass<T>,
	createNode: (textNode: TextNode) => T
): void {
	const [editor] = useLexicalComposerContext();

	onMount(() => {
		return mergeRegister(...registerLexicalTextEntity(editor, getMatch, targetNode, createNode));
	});
}
