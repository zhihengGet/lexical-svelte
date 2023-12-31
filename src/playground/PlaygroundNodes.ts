/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ParagraphNode, type Klass, type LexicalNode } from 'lexical';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ImageNode } from '@plugins/ImagesPlugin/ImageNode';
import { KeywordNode } from '@plugins/KeywordsPlugin/KeywordNode';
import { HorizontalRuleNode } from '@plugins/HorizontalPlugin/LexicalHorizontalRuleNode';
import { PageBreakNode } from '@plugins/PageBreakPlugin/PageBreakNode';
import { CollapsibleContainerNode } from '@plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from '@plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleTitleNode } from '@plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { EquationNode } from '@plugins/EquationsPlugin/EquationNode';
import { AutocompleteNode } from '@plugins/AutocompletePlugin';
//import { EmojiNode } from '@plugins/EmojisPlugin/EmojiNode';

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	CodeNode,
	TableNode,
	TableCellNode,
	TableRowNode,
	HashtagNode,
	CodeHighlightNode,
	AutoLinkNode,
	LinkNode,
	OverflowNode,
	ImageNode,
	MarkNode,
	KeywordNode,
	ParagraphNode,
	HorizontalRuleNode,
	PageBreakNode,
	// collapsible
	CollapsibleContainerNode,
	CollapsibleContentNode,
	CollapsibleTitleNode,
	//EmojiNode
	AutocompleteNode,
	EquationNode
];
export const SimpleNodes: Array<Klass<LexicalNode>> = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	CodeNode,
	//TableNode,
	//TableCellNode,
	//TableRowNode,
	HashtagNode,
	CodeHighlightNode,
	AutoLinkNode,
	LinkNode,
	OverflowNode,
	//ImageNode,
	MarkNode,
	KeywordNode,
	ParagraphNode,
	HorizontalRuleNode,
	//PageBreakNode,
	// collapsible
	CollapsibleContainerNode,
	CollapsibleContentNode,
	CollapsibleTitleNode,
	//EmojiNode

	EquationNode
];
export default PlaygroundNodes;

export { PlaygroundNodes as EditorNodes };
