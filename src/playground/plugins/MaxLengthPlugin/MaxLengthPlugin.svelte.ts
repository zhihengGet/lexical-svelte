import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { trimTextContentFromAnchor } from '@lexical/selection';
import { $restoreEditorState as restoreEditorState } from '@lexical/utils';
import {
	$getSelection as getSelection,
	$isRangeSelection as isRangeSelection,
	type EditorState,
	RootNode
} from 'lexical';
import { useEffect } from 'react';

export function MaxLengthPlugin({ maxLength = 10 }: { maxLength?: number }): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		let lastRestoredEditorState: EditorState | null = null;

		return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
			const selection = getSelection();
			if (!isRangeSelection(selection) || !selection.isCollapsed()) {
				return;
			}
			const prevEditorState = editor.getEditorState();
			const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
			const textContentSize = rootNode.getTextContentSize();
			if (prevTextContentSize !== textContentSize) {
				const delCount = textContentSize - maxLength;
				const anchor = selection.anchor;

				if (delCount > 0) {
					// Restore the old editor state instead if the last
					// text content was already at the limit.
					if (prevTextContentSize === maxLength && lastRestoredEditorState !== prevEditorState) {
						lastRestoredEditorState = prevEditorState;
						restoreEditorState(editor, prevEditorState);
					} else {
						trimTextContentFromAnchor(editor, anchor, delCount);
					}
				}
			}
		});
	}, [editor, maxLength]);

	return null;
}
