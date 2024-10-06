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
	import { onDestroy, onMount } from 'svelte';
	import { CustomParagraphNode } from '@nodes/CustomParagrahNode';
	const [editor] = useLexicalComposerContext();
	if (!editor.hasNodes([node.ParagraphCmmtNode])) {
		throw new Error('ParagraphCmmtNodePlugin: ParagraphCmmtNode is not registered on editor');
	}
	console.log('paragraph comment initialized');
	const settings = useSettings();
	const clean = mergeRegister(
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
				console.log('start adding comment component');
				// Insert custom node at the beginning of each paragraph
				paragraphs.forEach((paragraph) => {
					if (paragraph.getLastChild() instanceof CustomParagraphNode) {
						return;
					}
					const html = editor.getElementByKey(paragraph.getKey());
					console.log(html);
					let id = html?.getAttribute('data-chapter-comment-id');
					if (!id || paragraph.getTextContentSize() <= 1) {
						console.warn('not comment id ', id, paragraph.getTextContentSize());
						return;
					}
					const customNode = node.$createParagraphCommentNode({
						id: id,
						clickFn: settings().paragraphCommentClickFn,
						component: settings().paragraphCommentComponent
					}); // Example: inserting a rocket emoji
					if (id)
						editor.update(
							() => {
								paragraph.append(customNode);
								console.log('add child', customNode);
							},
							{
								skipTransforms: true,
								onUpdate: () => {
									let el = editor.getElementByKey(customNode.getKey());
									let c = () => {
										const temp = editor.read(() => {
											console.log(el);
											return paragraph.getTextContent();
										});
										console.log('comment click', id, temp);
										/* 	editor.update(() => {
											paragraph.getAllTextNodes().forEach((v) => {
												v.setStyle('border-width:2px;border-color:green;');
											});
										}); */

										settings().paragraphCommentClickFn({
											id: id,
											paragraphNode: paragraph,
											commentNode: customNode,
											paragraphContent: temp
										});
									};
									settings().paragraphCommentCloseFn = () => ({
										id: id,
										paragraphContent: editor.read(() => {
											console.log(el);
											return paragraph.getTextContent();
										}),
										paragraphNode: paragraph
									});
									if (!el) {
										console.error('failed to get comment element in editor');
									} else el!.onclick = c;
								},
								tag: 'insert_comment'
							}
						);
				});
				return true;
			},
			lexical.COMMAND_PRIORITY_NORMAL
		),
		() => console.log('destroyed paragraph')
	);

	onDestroy(() => {
		console.log('ready to register comment listen', node.START_COMMENT_NODE);
		return clean;
	});
	$effect(() => {
		return;
		if (settings().dev || settings().autoInsertComment) {
			console.log('dev mode auto render paragraph comment node', settings().dev);
			setTimeout(() => {
				editor.dispatchCommand(node.START_COMMENT_NODE, null);
			}, 500);
		}
	});
</script>
