import {
	$getNodeByKey as getNodeByKey,
	type NodeKey,
	$getSelection as getSelection,
	$isNodeSelection as isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND
} from 'lexical';
import { $isHorizontalRuleNode as isHorizontalRuleNode } from './LexicalHorizontalRuleNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.svelte';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { mergeRegister } from '@lexical/utils';

export function HorizontalRuleComponent(...props: { nodeKey: NodeKey }) {
	console.log(props);
	debugger;
	if (!nodeKey) throw 'no node key in horizontal rule';
	const [editor] = useLexicalComposerContext();
	const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

	const onDelete = useCallback(
		(event: KeyboardEvent) => {
			if (isSelected() && isNodeSelection(getSelection())) {
				event.preventDefault();
				const node = getNodeByKey(nodeKey);
				if (isHorizontalRuleNode(node)) {
					node.remove();
				}
			}
			return false;
		},
		[isSelected, nodeKey]
	);

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				CLICK_COMMAND,
				(event: MouseEvent) => {
					const hrElem = editor.getElementByKey(nodeKey);

					if (event.target === hrElem) {
						if (!event.shiftKey) {
							clearSelection();
						}
						setSelected(!isSelected());
						return true;
					}

					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
		);
	}, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

	useEffect(() => {
		const hrElem = editor.getElementByKey(nodeKey);
		if (hrElem !== null) {
			hrElem.className = isSelected() ? 'selected' : '';
		}
	}, [editor, isSelected, nodeKey]);

	return null;
}
