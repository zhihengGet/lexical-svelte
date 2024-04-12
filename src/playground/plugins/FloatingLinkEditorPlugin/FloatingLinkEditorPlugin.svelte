<script context="module" lang="ts">
</script>

<script lang="ts">
	import './index.css';

	import { TOGGLE_LINK_COMMAND, $isLinkNode as isLinkNode } from '@lexical/link';
	import { $findMatchingParent as findMatchingParent, mergeRegister } from '@lexical/utils';
	import {
		$getSelection as getSelection,
		$isRangeSelection as isRangeSelection,
		CLICK_COMMAND,
		COMMAND_PRIORITY_CRITICAL,
		COMMAND_PRIORITY_HIGH,
		COMMAND_PRIORITY_LOW,
		SELECTION_CHANGE_COMMAND,
		$isLineBreakNode as isLineBreakNode
	} from 'lexical';
	import { useCallback, useEffect, useRef, useState } from 'react';

	import { getSelectedNode } from '../../utils/getSelectedNode';
	import { setFloatingElemPositionForLinkEditor } from '../../utils/setFloatingElemPositionForLinkEditor';
	import { sanitizeUrl } from '../../utils/url';
	import Portal from '@ui/Portal.svelte';
	import FloatingLinkEditor from './FloatingLinkEditor.svelte';
	import { $isAutoLinkNode as isAutoLinkNode } from '@lexical/link';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	type props = {
		anchorElem?: HTMLElement;
		isLinkEditMode: boolean;
		setIsLinkEditMode: React.Dispatch<boolean>;
	};
	let { anchorElem = document.body, isLinkEditMode, setIsLinkEditMode }: props = $props();
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [isLink, setIsLink] = useState(false);

	useEffect(() => {
		function updateToolbar() {
			const selection = getSelection();
			if (isRangeSelection(selection)) {
				const focusNode = getSelectedNode(selection);
				const focusLinkNode = findMatchingParent(focusNode, isLinkNode);
				const focusAutoLinkNode = findMatchingParent(focusNode, isAutoLinkNode);
				if (!(focusLinkNode || focusAutoLinkNode)) {
					setIsLink(false);
					return;
				}
				const badNode = selection
					.getNodes()
					.filter((node) => !isLineBreakNode(node))
					.find((node) => {
						const linkNode = findMatchingParent(node, isLinkNode);
						const autoLinkNode = findMatchingParent(node, isAutoLinkNode);
						return (
							(focusLinkNode && !focusLinkNode.is(linkNode)) ||
							(linkNode && !linkNode.is(focusLinkNode)) ||
							(focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
							(autoLinkNode && !autoLinkNode.is(focusAutoLinkNode))
						);
					});
				if (!badNode) {
					setIsLink(true);
				} else {
					setIsLink(false);
				}
			}
		}
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, newEditor) => {
					updateToolbar();
					setActiveEditor(newEditor);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			editor.registerCommand(
				CLICK_COMMAND,
				(payload) => {
					const selection = getSelection();
					if (isRangeSelection(selection)) {
						const node = getSelectedNode(selection);
						const linkNode = findMatchingParent(node, isLinkNode);
						if (isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
							window.open(linkNode.getURL(), '_blank');
							return true;
						}
					}
					return false;
				},
				COMMAND_PRIORITY_LOW
			)
		);
	}, [editor]);
</script>

<Portal
	target={anchorElem}
	portal={true}
	component={FloatingLinkEditor}
	props={{
		editor: activeEditor(),
		isLink: isLink(),
		anchorElem: anchorElem,
		setIsLink: setIsLink,
		isLinkEditMode: isLinkEditMode,
		setIsLinkEditMode: setIsLinkEditMode
	}}
/>
