<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import {
		$insertNodeToNearestRoot as insertNodeToNearestRoot,
		mergeRegister
	} from '@lexical/utils';
	import {
		$getSelection as getSelection,
		$isRangeSelection as isRangeSelection,
		COMMAND_PRIORITY_EDITOR,
		createCommand,
		type LexicalCommand,
		$getRoot as getRoot
	} from 'lexical';
	import * as lexical from 'lexical';
	import * as utils from '@lexical/utils';
	import * as node from './paragraphComment';
	import { useSettings } from '../../appSettings';

	const [editor] = useLexicalComposerContext();
	if (!editor.hasNodes([node.ParagraphCmmtNode])) {
		throw new Error('ParagraphCmmtNodePlugin: ParagraphCmmtNode is not registered on editor');
	}
	const settings = useSettings();
	$effect(() => {
		return mergeRegister(
			editor.registerCommand(
				node.START_COMMENT_NODE,
				() => {
					const root = getRoot();
					const paragraphs: lexical.ParagraphNode[] = [];

					// Traverse the EditorState and collect all paragraph nodes
					root.getChildren().forEach((node) => {
						if (lexical.$isParagraphNode(node)) {
							paragraphs.push(node);
						}
					});

					// Insert custom node at the beginning of each paragraph
					paragraphs.forEach((paragraph) => {
						if (paragraph.getLastChild() instanceof node.ParagraphCmmtNode) {
							return;
						}
						const html = editor.getElementByKey(paragraph.getKey());
						console.log(node);
						const customNode = node.$createParagraphCommentNode({
							id: html?.getAttribute('data-chapter-id'),
							clickFn: settings().paragraphCommentClickFn
						}); // Example: inserting a rocket emoji

						paragraph.append(customNode);
					});
					return true;
				},
				COMMAND_PRIORITY_EDITOR
			)
		);
	});
	/* $effect(() => {
		setTimeout(() => {
			editor.dispatchCommand(node.START_COMMENT_NODE, null);
		}, 500);
	}); */
</script>
