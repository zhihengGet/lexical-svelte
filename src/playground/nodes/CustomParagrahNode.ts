import {
	ParagraphNode,
	type DOMConversionMap,
	type EditorConfig,
	type SerializedParagraphNode,
	type LexicalEditor,
	isHTMLElement
} from 'lexical';

type SerializedCustomParagraphNode = SerializedParagraphNode & {
	attr: { [s in string]: string };
	'data-chapter-id': string;
};

export class CustomParagraphNode extends ParagraphNode {
	static allowedAttributes: string[] = [
		'data-chapter-id',
		'data-id',
		'data-test',
		'data-chapter-comment-id'
	];
	attr: { [s in string]: string } = {};

	static getType() {
		return 'custom-paragraph';
	}

	static clone(node: CustomParagraphNode) {
		//console.log('export clone', node);
		const n = new CustomParagraphNode(node.__key);
		n.attr = node.attr;
		return n;
	}

	exportJSON() {
		return {
			...super.exportJSON(),
			'data-chapter-id': this['data-chapter-id'],
			attr: this.getLatest().attr,
			type: this.getType()
		};
	}
	exportDOM(editor: LexicalEditor) {
		const dom = super.exportDOM(editor);
		if (dom.element && isHTMLElement(dom.element)) this.setAttribute(dom.element);
		//console.log('export dom', dom, JSON.stringify(this.attr));
		return dom;
	}
	getLatestAttr() {
		return this.getLatest().attr;
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
			dom.setAttribute(v, this.getLatestAttr()[v]);
		});
		//console.log('setting attributes', dom);
	}
	createDOM(config) {
		const dom = super.createDOM(config);
		this.setAttribute(dom);
		return dom;
	}
	updateDOM(prevNode: ParagraphNode, dom: HTMLElement, config: EditorConfig): boolean {
		/* 	console.log('updateDom', dom);
		//	this.getWritable().attr = prevNode.attr;
		this.testLog(prevNode, dom, config); */
		//	console.trace('export updateDom', this.getLatestAttr());
		return false;
	}

	testLog(...args: any) {
		console.log('Paragraph Custom:', args);
	}
}
