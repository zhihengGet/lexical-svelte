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
import { $generateHtmlFromNodes as toHTML } from '@lexical/html';
import { useSettings } from '../../appSettings';

export function MaxByteDancePlugin({
	maxLength = 10000,
	maxMB = 1024 * 5,
	onMaxLimit = () => {},
	onReset = () => {}
}: {
	maxLength?: number;
	maxMB: number;
	onMaxLimit: () => unknown;
	onReset?: () => unknown;
}): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		let lastRestoredEditorState: EditorState | null = null;

		return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
			onReset();
			const selection = getSelection();
			if (!isRangeSelection(selection) || !selection.isCollapsed()) {
				return;
			}
			const prevEditorState = editor.getEditorState();
			const prevKB = getMB(JSON.stringify(prevEditorState.read(() => toHTML(editor)))); // before change
			const nextKB = getMB(JSON.stringify(toHTML(editor))); // after change

			const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
			const textContentSize = rootNode.getTextContentSize();

			/* 	const delCount = textContentSize - 2;
			const delKbCount = prevKB - maxMB;
			const anchor = selection.anchor; */
			/* console.log(
				'text size',
				textContentSize,
				prevEditorState.toJSON().root.children[0].children[0],
				prevKB,
				nextKB
			); */

			// Restore the old editor state instead if the last
			// text content was already at the limit.
			if (prevTextContentSize == maxLength || textContentSize > maxLength || nextKB > maxMB) {
				restoreEditorState(editor, prevEditorState);
				lastRestoredEditorState = prevEditorState;
				onMaxLimit();
				return;
			} else if (prevKB >= maxMB) {
				/* if (lastRestoredEditorState) restoreEditorState(editor, lastRestoredEditorState);
					lastRestoredEditorState = prevEditorState; */
				//trimTextContentFromAnchor(editor, anchor, delCount);
			}
		});
	}, [editor, maxLength]);

	return null;
}
