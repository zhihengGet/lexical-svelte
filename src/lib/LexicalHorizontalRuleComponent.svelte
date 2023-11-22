<script context="module" lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import type {
		DOMConversionMap,
		DOMConversionOutput,
		DOMExportOutput,
		LexicalCommand,
		LexicalNode,
		NodeKey,
		SerializedLexicalNode
	} from 'lexical';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.svelte';
	import { mergeRegister } from '@lexical/utils';
	import {
		$applyNodeReplacement as applyNodeReplacement,
		$getNodeByKey as getNodeByKey,
		$getSelection as getSelection,
		$isNodeSelection as isNodeSelection,
		CLICK_COMMAND,
		COMMAND_PRIORITY_LOW,
		createCommand,
		DecoratorNode,
		KEY_BACKSPACE_COMMAND,
		KEY_DELETE_COMMAND
	} from 'lexical';
	import * as React from 'react';
	import { useCallback, useEffect } from 'react';
	import { HorizontalRuleNode } from './LexicalHorizontalRuleNode';

	export type SerializedHorizontalRuleNode = SerializedLexicalNode;

	export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand(
		'INSERT_HORIZONTAL_RULE_COMMAND'
	);

	function convertHorizontalRuleElement(): DOMConversionOutput {
		return { node: createHorizontalRuleNode() };
	}

	export function createHorizontalRuleNode(): HorizontalRuleNode {
		return applyNodeReplacement(new HorizontalRuleNode());
	}

	export function isHorizontalRuleNode(
		node: LexicalNode | null | undefined
	): node is HorizontalRuleNode {
		return node instanceof HorizontalRuleNode;
	}
</script>

<script lang="ts">
	let { nodeKey } = $props<{ nodeKey: NodeKey }>();
	const [editor] = useLexicalComposerContext();
	const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

	const onDelete = useCallback(
		(event: KeyboardEvent) => {
			if (isSelected && isNodeSelection(getSelection())) {
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
						setSelected(!isSelected);
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
			hrElem.className = isSelected ? 'selected' : '';
		}
	}, [editor, isSelected, nodeKey]);
</script>
