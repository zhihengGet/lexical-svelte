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
	$applyNodeReplacement,
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	createCommand,
	DecoratorNode,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND
} from 'lexical';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { mount, SvelteComponent } from 'svelte';
import LexicalHorizontalRuleComponent from './LexicalHorizontalRuleComponent.svelte';
import type { SvelteRender } from './types';

export type SerializedHorizontalRuleNode = SerializedLexicalNode;

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand(
	'INSERT_HORIZONTAL_RULE_COMMAND'
);

export class HorizontalRuleNode extends DecoratorNode<JSX.Element> {
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

	createDOM(): HTMLElement {
		return document.createElement('hr');
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
		return { component: LexicalHorizontalRuleComponent, nodeKey: this.__key };
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
