/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import * as text from '@lexical/text';
import { mergeRegister } from '@lexical/utils';
import { useState } from '../react.svelte';
import useLayoutEffect from 'shared/useLayoutEffect.svelte';

function canShowPlaceholderFromCurrentEditorState(editor: LexicalEditor): boolean {
	const currentCanShowPlaceholder = editor
		.getEditorState()
		.read(text.$canShowPlaceholderCurry(editor.isComposing()));

	return currentCanShowPlaceholder;
}

export function useCanShowPlaceholder(editor: LexicalEditor) {
	const [canShowPlaceholder, setCanShowPlaceholder] = useState(() =>
		canShowPlaceholderFromCurrentEditorState(editor)
	);

	useLayoutEffect(() => {
		function resetCanShowPlaceholder() {
			const currentCanShowPlaceholder = canShowPlaceholderFromCurrentEditorState(editor);
			setCanShowPlaceholder(currentCanShowPlaceholder);
		}
		resetCanShowPlaceholder();
		return mergeRegister(
			editor.registerUpdateListener(() => {
				resetCanShowPlaceholder();
			}),
			editor.registerEditableListener(() => {
				resetCanShowPlaceholder();
			})
		);
	}, [editor]);

	return canShowPlaceholder;
}
