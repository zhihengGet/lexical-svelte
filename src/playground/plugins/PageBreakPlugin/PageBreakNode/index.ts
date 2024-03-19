/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
import type { SvelteRender } from '@lexical/react/types';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.svelte';
import { mergeRegister } from '@lexical/utils';
import type {
	DOMConversionMap,
	DOMConversionOutput,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode
} from 'lexical';
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DecoratorNode,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND
} from 'lexical';
import { useEffect } from 'react';

export type SerializedPageBreakNode = SerializedLexicalNode;

function PageBreakComponent(...props: [HTMLElement, { nodeKey: NodeKey }]) {
	const { nodeKey } = props[1];
	if (!nodeKey) throw 'missing node key in page break component ' + nodeKey;
	const [editor] = useLexicalComposerContext();
	const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

	const onDelete = (event: KeyboardEvent) => {
		event.preventDefault();
		if (isSelected() && $isNodeSelection($getSelection())) {
			const node = $getNodeByKey(nodeKey);
			if ($isPageBreakNode(node)) {
				node.remove();
				return true;
			}
		}
		return false;
	};
	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				CLICK_COMMAND,
				(event: MouseEvent) => {
					const pbElem = editor.getElementByKey(nodeKey);

					if (event.target === pbElem) {
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
		const pbElem = editor.getElementByKey(nodeKey);
		if (pbElem !== null) {
			pbElem.className = isSelected() ? 'selected' : '';
		}
	}, [editor, isSelected, nodeKey]);

	return null;
}

export class PageBreakNode extends DecoratorNode<SvelteRender<any>> {
	static getType(): string {
		return 'page-break';
	}

	static clone(node: PageBreakNode): PageBreakNode {
		return new PageBreakNode(node.__key);
	}

	static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode {
		return $createPageBreakNode();
	}

	static importDOM(): DOMConversionMap | null {
		return {
			figure: (domNode: HTMLElement) => {
				const tp = domNode.getAttribute('type');
				if (tp !== this.getType()) return null;

				return {
					conversion: convertPageBreakElement,
					priority: COMMAND_PRIORITY_HIGH
				};
			}
		};
	}

	exportJSON(): SerializedLexicalNode {
		return {
			type: this.getType(),
			version: 1
		};
	}

	createDOM(): HTMLElement {
		const el = document.createElement('figure');
		el.style.pageBreakAfter = 'always';
		el.setAttribute('type', this.getType());
		return el;
	}

	getTextContent(): string {
		return '\n';
	}

	isInline(): false {
		return false;
	}

	updateDOM(): boolean {
		return false;
	}

	decorate(): SvelteRender {
		return { component: PageBreakComponent, props: { nodeKey: this.__key } };
	}
}

function convertPageBreakElement(): DOMConversionOutput {
	return { node: $createPageBreakNode() };
}

export function $createPageBreakNode(): PageBreakNode {
	return new PageBreakNode();
}

export function $isPageBreakNode(node: LexicalNode | null | undefined): node is PageBreakNode {
	return node instanceof PageBreakNode;
}
