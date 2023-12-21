/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import { registerDragonSupport } from '@lexical/dragon';
import { registerRichText } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import { onMount } from 'svelte';

export function useRichTextSetup(editor: LexicalEditor): void {
	onMount(() => {
		return mergeRegister(registerRichText(editor), registerDragonSupport(editor));

		// We only do this for init
	});
}
