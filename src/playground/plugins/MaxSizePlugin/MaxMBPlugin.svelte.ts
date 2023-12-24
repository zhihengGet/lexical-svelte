import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { trimTextContentFromAnchor } from '@lexical/selection';
import { $restoreEditorState as restoreEditorState } from '@lexical/utils';
import { getMB } from '../../utils/megabyte';
import {
	$getSelection as getSelection,
	$isRangeSelection as isRangeSelection,
	type EditorState,
	RootNode
} from 'lexical';
import { useEffect } from 'react';

export function MaxByteDancePlugin({
	maxLength = 10000,
	maxMB = 1024 * 5
}: {
	maxLength?: number;
	maxMB: number;
}): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		let lastRestoredEditorState: EditorState | null = null;

		return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
			const selection = getSelection();
			if (!isRangeSelection(selection) || !selection.isCollapsed()) {
				return;
			}
			const prevEditorState = editor.getEditorState();
			const kb = getMB(rootNode.getTextContent());
			const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
			const textContentSize = rootNode.getTextContentSize();
			if (prevTextContentSize !== textContentSize) {
				const delCount = textContentSize - maxLength;
				const delKbCount = kb - maxMB;
				const anchor = selection.anchor;

				if (delCount > 0 || delKbCount > 0) {
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
