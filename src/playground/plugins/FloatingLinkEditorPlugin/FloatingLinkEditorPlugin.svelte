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
		SELECTION_CHANGE_COMMAND
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
	let { anchorElem = document.body, isLinkEditMode, setIsLinkEditMode } = $props<props>();
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [isLink, setIsLink] = useState(false);

	useEffect(() => {
		function updateToolbar() {
			const selection = getSelection();
			if (isRangeSelection(selection)) {
				const node = getSelectedNode(selection);
				const linkParent = findMatchingParent(node, isLinkNode);
				const autoLinkParent = findMatchingParent(node, isAutoLinkNode);
				// We don't want this menu to open for auto links.
				if (linkParent !== null && autoLinkParent === null) {
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
				COMMAND_PRIORITY_LOW
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
