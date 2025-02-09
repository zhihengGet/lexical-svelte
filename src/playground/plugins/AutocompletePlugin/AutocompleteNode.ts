/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalNode, SerializedLexicalNode, Spread } from 'lexical';

import type {
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	NodeKey,
	SerializedTextNode
} from 'lexical';
import { DecoratorNode } from 'lexical';

import { uuid as UUID } from '.';
import type { SvelteRender } from '@lexical/react/types';
import AutocompleteComponent from './AutocompleteComponent.svelte';
import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';

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

export class AutocompleteNode extends DecoratorNode<SvelteRender<
	typeof AutocompleteComponent
> | null> {
	// TODO add comment
	__uuid: string;

	static clone(node: AutocompleteNode): AutocompleteNode {
		return new AutocompleteNode(node.__uuid, node.__key);
	}

	static getType(): 'autocomplete' {
		return 'autocomplete';
	}

	static importJSON(serializedNode: SerializedAutocompleteNode): AutocompleteNode {
		return $createAutocompleteNode(serializedNode.uuid).updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedAutocompleteNode {
		return {
			...super.exportJSON(),
			uuid: this.__uuid
		};
	}
	constructor(uuid: string, key?: NodeKey) {
		super(key);
		this.__uuid = uuid;
	}
	exportDOM(): DOMExportOutput {
		return { element: null };
	}

	updateDOM(prevNode: unknown, dom: HTMLElement, config: EditorConfig): boolean {
		return false;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const node = document.createElement('span');
		node.style.position = 'relative';
		node.id = 'autocomplete';
		node.style.width = '0px';
		//node.style.display = 'inline-block';
		return node;
	}

	decorate(): SvelteRender<typeof AutocompleteComponent> | null {
		if (this.__uuid !== UUID) {
			return null;
		}
		return {
			component: AutocompleteComponent,
			props: {
				nodeKey: this.__key,
				visibility: 'visible',
				top: 0,
				isEnd: false,
				left: 0
			}
		};
	}
}

export function $createAutocompleteNode(uuid: string): AutocompleteNode {
	return new AutocompleteNode(uuid);
}

export function isAutocompleteNode(node: LexicalNode) {
	return node instanceof AutocompleteNode;
}
