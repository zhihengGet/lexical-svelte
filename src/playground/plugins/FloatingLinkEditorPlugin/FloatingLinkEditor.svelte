<script context="module" lang="ts">
	import {
		$isAutoLinkNode as isAutoLinkNode,
		$isLinkNode as isLinkNode,
		TOGGLE_LINK_COMMAND
	} from '@lexical/link';
	import {
		$getSelection as getSelection,
		$isRangeSelection as isRangeSelection,
		CLICK_COMMAND,
		COMMAND_PRIORITY_CRITICAL,
		COMMAND_PRIORITY_HIGH,
		COMMAND_PRIORITY_LOW,
		type GridSelection,
		KEY_ESCAPE_COMMAND,
		type LexicalEditor,
		type NodeSelection,
		type RangeSelection,
		SELECTION_CHANGE_COMMAND,
		type BaseSelection
	} from 'lexical';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import { $findMatchingParent as findMatchingParent, mergeRegister } from '@lexical/utils';

	import { useCallback, useEffect, useRef, useState } from 'react';

	import { getSelectedNode } from '../../utils/getSelectedNode';

	import { setFloatingElemPositionForLinkEditor } from '../../utils/setFloatingElemPositionForLinkEditor';

	import { sanitizeUrl, validateUrl } from '../../utils/url';
	import { untrack } from 'svelte';
</script>

<script lang="ts">
	import { TrashIcon } from 'lucide-svelte';

	let { editor, isLink, setIsLink, anchorElem, isLinkEditMode, setIsLinkEditMode } = $props<{
		editor: LexicalEditor;
		isLink: boolean;
		setIsLink: React.Dispatch<boolean>;
		anchorElem: HTMLElement;
		isLinkEditMode: boolean;
		setIsLinkEditMode: React.Dispatch<boolean>;
	}>();
	console.log('props', isLink);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [linkUrl, setLinkUrl] = useState('');
	const [editedLinkUrl, setEditedLinkUrl] = useState('https://');
	const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);

	const updateLinkEditor = useCallback(() => {
		const selection = getSelection();
		if (isRangeSelection(selection)) {
			const node = getSelectedNode(selection);
			const linkParent = findMatchingParent(node, isLinkNode);

			if (linkParent) {
				setLinkUrl(linkParent.getURL());
			} else if (isLinkNode(node)) {
				setLinkUrl(node.getURL());
			} else {
				setLinkUrl('');
			}
		}
		const editorElem = editorRef.current;
		const nativeSelection = window.getSelection();
		const activeElement = document.activeElement;

		if (editorElem === null) {
			return;
		}

		const rootElement = editor.getRootElement();

		if (
			selection !== null &&
			nativeSelection !== null &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode) &&
			editor.isEditable()
		) {
			const domRect: DOMRect | undefined =
				nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
			if (domRect) {
				domRect.y += 40;
				setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
			}
			setLastSelection(selection);
		} else if (!activeElement || activeElement.className !== 'link-input') {
			if (rootElement !== null) {
				setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
			}
			setLastSelection(null);
			setIsLinkEditMode(false);
			setLinkUrl('');
		}

		return true;
	}, [anchorElem, editor, setIsLinkEditMode]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				updateLinkEditor();
			});
		};

		window.addEventListener('resize', update);

		if (scrollerElem) {
			scrollerElem.addEventListener('scroll', update);
		}

		return () => {
			window.removeEventListener('resize', update);

			if (scrollerElem) {
				scrollerElem.removeEventListener('scroll', update);
			}
		};
	}, [anchorElem.parentElement, editor, updateLinkEditor]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateLinkEditor();
				});
			}),

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateLinkEditor();
					return true;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				KEY_ESCAPE_COMMAND,
				() => {
					if (isLink) {
						setIsLink(false);
						return true;
					}
					return false;
				},
				COMMAND_PRIORITY_HIGH
			)
		);
	}, [editor, updateLinkEditor, setIsLink, isLink]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			untrack(updateLinkEditor);
		});
	}, [editor, updateLinkEditor]);

	useEffect(() => {
		if (isLinkEditMode && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isLinkEditMode, isLink]);

	const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleLinkSubmission();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			setIsLinkEditMode(false);
		}
	};

	const handleLinkSubmission = () => {
		if (lastSelection() !== null) {
			if (linkUrl() !== '') {
				console.log('editedLinkUrl', editedLinkUrl());
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl()));
			}
			setEditedLinkUrl('https://');
			setIsLinkEditMode(false);
		}
	};
	/* 
	$effect(() => {
		return useClickOutside(editorRef.current, {
			enabled: true,
			handler: () => {
				//editor.focus();
				///editorRef.current?.remove();
			}
		}).destroy;
	}); */
	//debugger;
</script>

<div bind:this={editorRef.current} class="link-editor">
	{#if isLink}
		{#if isLinkEditMode}
			<input
				bind:this={inputRef.current}
				class="link-input"
				value={editedLinkUrl()}
				onkeydown={(event) => {
					monitorInputInteraction(event);
				}}
				oninput={(e) => {
					setEditedLinkUrl(e.target.value);
				}}
			/>
			<div>
				<div
					class="link-cancel"
					role="button"
					tabIndex={0}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => {
						setIsLinkEditMode(false);
					}}
				/>

				<div
					class="link-confirm"
					role="button"
					tabIndex={0}
					onmousedown={(event) => event.preventDefault()}
					onclick={handleLinkSubmission}
				/>
			</div>
		{:else}
			<div class="link-view">
				<a href={sanitizeUrl(linkUrl())} target="_blank" rel="noopener noreferrer">
					{linkUrl()}
				</a>
				<div
					class="link-edit"
					role="button"
					tabIndex={0}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => {
						setEditedLinkUrl(linkUrl());
						setIsLinkEditMode(true);
					}}
				/>
				<div
					class="link-trash"
					tabIndex={0}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => {
						editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
					}}
				/>
			</div>
		{/if}
	{/if}
</div>
