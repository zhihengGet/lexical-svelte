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
	EditorConfig,
	LexicalCommand,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode
} from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import HorizontalRuleComponent from './LexicalHorizontalRuleComponent.svelte';
import type { SvelteRender } from '../../../lib/types';
import { addClassNamesToElement, mergeRegister, removeClassNamesFromElement } from '@lexical/utils';
export type SerializedHorizontalRuleNode = SerializedLexicalNode;

export class HorizontalRuleNode extends DecoratorNode<SvelteRender> {
	static getType(): string {
		return 'horizontalrule';
	}

	static clone(node: HorizontalRuleNode): HorizontalRuleNode {
		return new HorizontalRuleNode(node.__key);
	}

	static importJSON(serializedNode: SerializedHorizontalRuleNode): HorizontalRuleNode {
		return $createHorizontalRuleNode();
	}

	static importDOM(): DOMConversionMap | null {
		return {
			hr: () => ({
				conversion: convertHorizontalRuleElement,
				priority: 0
			})
		};
	}

	exportJSON(): SerializedLexicalNode {
		return {
			type: 'horizontalrule',
			version: 1
		};
	}

	exportDOM(): DOMExportOutput {
		return { element: document.createElement('hr') };
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = document.createElement('hr');
		addClassNamesToElement(element, config.theme.hr);
		return element;
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
		return {
			component: HorizontalRuleComponent,
			props: { nodeKey: this.__key },
			nodeKey: this.__key,
			portal: false,
			target: null //TODO
		};
	}
}

function convertHorizontalRuleElement(): DOMConversionOutput {
	return { node: $createHorizontalRuleNode() };
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
	return $applyNodeReplacement(new HorizontalRuleNode());
}

export function $isHorizontalRuleNode(
	node: LexicalNode | null | undefined
): node is HorizontalRuleNode {
	return node instanceof HorizontalRuleNode;
}
