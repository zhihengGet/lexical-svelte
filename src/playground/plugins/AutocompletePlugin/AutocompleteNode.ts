/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Spread } from 'lexical';

import type { EditorConfig, NodeKey, SerializedLexicalNode } from 'lexical';
import { DecoratorNode, LexicalNode } from 'lexical';

import { uuid as UUID } from '.';
import type { SvelteRender } from '@lexical/react/types';
import AutocompleteComponent from './AutocompleteComponent.svelte';

declare global {
	interface Navigator {
		userAgentData?: {
			mobile: boolean;
		};
	}
}

export type SerializedAutocompleteNode = Spread<
	{
		uuid: string;
	},
	SerializedLexicalNode
>;

export class AutocompleteNode extends DecoratorNode<SvelteRender | null> {
	// TODO add comment
	__uuid: string;

	static clone(node: AutocompleteNode): AutocompleteNode {
		return new AutocompleteNode(node.__uuid, node.__key);
	}

	static getType(): 'autocomplete' {
		return 'autocomplete';
	}

	static importJSON(serializedNode: SerializedAutocompleteNode): AutocompleteNode {
		const node = $createAutocompleteNode(serializedNode.uuid);
		return node;
	}

	exportJSON(): SerializedAutocompleteNode {
		return {
			//...super.exportJSON(),
			type: 'autocomplete',
			uuid: this.__uuid,
			version: 1
		};
	}

	constructor(uuid: string, key?: NodeKey) {
		super(key);
		this.__uuid = uuid;
	}

	updateDOM(prevNode: unknown, dom: HTMLElement, config: EditorConfig): boolean {
		return false;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const node = document.createElement('span');
		node.style.position = 'relative';
		//node.style.display = 'inline-block';
		return node;
	}

	decorate(): SvelteRender | null {
		if (this.__uuid !== UUID) {
			return null;
		}
		return { component: AutocompleteComponent };
	}
}

export function $createAutocompleteNode(uuid: string): AutocompleteNode {
	return new AutocompleteNode(uuid);
}
