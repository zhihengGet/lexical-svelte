import {
	ParagraphNode,
	type DOMConversionMap,
	type SerializedElementNode,
	type SerializedLexicalNode,
	type EditorConfig,
	type SerializedParagraphNode
} from 'lexical';

type SerializedCustomParagraphNode = SerializedParagraphNode & {
	attr: { [s in string]: string };
	'data-chapter-id': string;
};

export class CustomParagraphNode extends ParagraphNode {
	static allowedAttributes: string[] = ['data-chapter-id'];
	attr: { [s in string]: string } = {};

	static getType() {
		return 'custom-paragraph';
	}

	static clone(node) {
		return new CustomParagraphNode(node.__key);
	}

	exportJSON() {
		console.log('export json', this.attr);
		return {
			...super.exportJSON(),
			'data-chapter-id': this['data-chapter-id'],
			attr: this.attr,
			type: this.getType()
		};
	}
	exportDOM(editor) {
		const dom = super.exportDOM(editor);
		this.setAttribute(dom.element);
		console.log('export dom', dom, JSON.stringify(this.attr));
		return dom;
	}
	static getAtt(el: HTMLElement, names: string[]) {
		const att: { [s in string]: string } = {};
		for (const x of names) {
			att[x] = el.getAttribute(x) || 'null';
		}
		return att;
	}
	static importJSON(serializedNode: SerializedCustomParagraphNode): ParagraphNode {
		const node = super.importJSON(serializedNode);
		node.attr = serializedNode.attr;
		return node;
	}
	static importDOM(): DOMConversionMap | null {
		return {
			p: () => {
				return {
					conversion: (element) => {
						const t = new CustomParagraphNode();
						t.attr = this.getAtt(element, this.allowedAttributes);
						return { node: t };
					},
					priority: 4
				};
			}
		};
	}
	setAttribute(dom: HTMLElement) {
		Object.keys(this.attr).forEach((v) => {
			dom.setAttribute(v, this.attr[v]);
		});
	}
	createDOM(config) {
		const dom = super.createDOM(config);
		this.setAttribute(dom);
		return dom;
	}
	updateDOM(prevNode: ParagraphNode, dom: HTMLElement, config: EditorConfig): boolean {
		this.getWritable().__attr = prevNode.attr;
		this.testLog(prevNode, dom, config);
		return true;
	}

	testLog(...args) {
		console.log(args);
	}
}
