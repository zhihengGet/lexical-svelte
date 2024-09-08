import type { SvelteRender } from '@lexical/react/types';
import {
	createCommand,
	DecoratorNode,
	type DOMConversionMap,
	type EditorConfig,
	type LexicalEditor,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode
} from 'lexical';
import Comment from './Comment.svelte';
import type { SvelteComponent } from 'svelte';
export type SerializedParagraphCommentkNode = SerializedLexicalNode;

export class ParagraphCmmtNode extends DecoratorNode<SvelteRender> {
	__id: string;
	__component: SvelteComponent | null = null;
	_clickFn?: (arg: { section_id: string }) => void;
	static getType(): string {
		return 'paragraph_comment';
	}

	static clone(node: ParagraphCmmtNode): ParagraphCmmtNode {
		return new ParagraphCmmtNode(node.__id, node.__key);
	}

	constructor(id: string, key?: NodeKey) {
		super(key);
		this.__id = id;
	}
	static importJSON(serializedNode: SerializedParagraphCommentkNode): ParagraphCmmtNode {
		const node = $createParagraphCommentNode(serializedNode);
		return node;
	}
	exportJSON() {
		return {
			type: this.__type,
			version: 1
		};
	}
	createDOM(_config: EditorConfig): HTMLElement {
		const node = document.createElement('span');
		node.classList.add(_config.theme['paragraphComment'].visible);
		node.style.cssText = 'opacity:var(--p-comment-opacity)';
		return node;
	}
	updateDOM(): false {
		return false;
	}
	getCommentId() {
		return this.getLatest().__id;
	}
	decorate(_editor: LexicalEditor, config: EditorConfig): SvelteRender {
		return {
			component: this.__component || Comment,
			nodeKey: this.getKey(),
			props: { nodeKey: this.getKey(), section_id: this.__id }
		};
	}
}

export function $createParagraphCommentNode(props: {
	clickFn?: (arg: { section_id: string }) => void;
	id: string;
	component?: SvelteComponent;
}): ParagraphCmmtNode {
	const p = new ParagraphCmmtNode(props.id);
	if (props.component) p.__component = props.component;
	p._clickFn = props.clickFn;
	return p;
}

export function $isParagraphCommentNode(
	node: LexicalNode | null | undefined
): node is ParagraphCmmtNode {
	return node instanceof ParagraphCmmtNode;
}

export const START_COMMENT_NODE = createCommand('CREATE_PARAGRAPH_NODE');
