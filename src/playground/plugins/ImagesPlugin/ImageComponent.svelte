<script context="module" lang="ts">
	type CommandPayload = {
		equation: string;
		inline: boolean;
	};
	const imageCache = new Set();
	//TODO cache image
	export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = lexical.createCommand(
		'RIGHT_CLICK_IMAGE_COMMAND'
	);
</script>

<script lang="ts">
	import type {
		GridSelection,
		LexicalCommand,
		LexicalEditor,
		NodeKey,
		NodeSelection,
		RangeSelection
	} from 'lexical';

	import './ImageNode.css';

	import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin.svelte';
	import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext.svelte';
	import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin.svelte';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin.svelte';
	import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin.svelte';
	import { default as LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer.svelte';
	import { default as RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin.svelte';
	import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.svelte';
	import { mergeRegister } from '@lexical/utils';
	import * as lexical from 'lexical';
	import * as React from 'react';
	import { useCallback, useEffect, useRef, useState } from 'react';

	import { createWebsocketProvider } from '../../collaboration';
	import { useSettings } from '../../context/SettingsContext.svelte';
	import EmojisPlugin from '../EmojisPlugin';
	import KeywordsPlugin from '../KeywordsPlugin';
	import { LinkPlugin } from '../LinkPlugin';
	// import MentionsPlugin from "../plugins/MentionsPlugin";
	//import TreeViewPlugin from "../../plugins/TreeViewPlugin.svelte";
	import ContentEditable from '@ui/ContentEditable.svelte';
	import ImageResizer from './ImageResizer.svelte';
	import { $isImageNode as isImageNode } from './ImageNode';
	import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
	import {
		CLICK_COMMAND,
		COMMAND_PRIORITY_LOW,
		createCommand,
		DRAGSTART_COMMAND,
		KEY_BACKSPACE_COMMAND,
		KEY_DELETE_COMMAND,
		KEY_ENTER_COMMAND,
		KEY_ESCAPE_COMMAND,
		SELECTION_CHANGE_COMMAND
	} from 'lexical';
	let {
		src,
		altText,
		nodeKey,
		width,
		height,
		maxWidth,
		resizable,
		showCaption,
		caption,
		captionsEnabled
	} = $props<{
		altText: string;
		caption: LexicalEditor;
		height: 'inherit' | number;
		maxWidth: number;
		nodeKey: NodeKey;
		resizable: boolean;
		showCaption: boolean;
		src: string;
		width: 'inherit' | number;
		captionsEnabled: boolean;
	}>();
	//TODO lazy image
	const imageRef = useRef<null | HTMLImageElement>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const { isCollabActive } = useCollaborationContext();
	const [editor] = useLexicalComposerContext();
	const [selection, setSelection] = useState<RangeSelection | NodeSelection | GridSelection | null>(
		null
	);
	const activeEditorRef = useRef<LexicalEditor | null>(null);

	const onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && lexical.$isNodeSelection(lexical.$getSelection())) {
				const event: KeyboardEvent = payload;
				event.preventDefault();
				const node = lexical.$getNodeByKey(nodeKey);
				if (isImageNode(node)) {
					node.remove();
				}
			}
			return false;
		},
		[isSelected, nodeKey]
	);

	const onEnter = useCallback(
		(event: KeyboardEvent) => {
			const latestSelection = lexical.$getSelection();
			const buttonElem = buttonRef.current;
			if (
				isSelected &&
				lexical.$isNodeSelection(latestSelection) &&
				latestSelection.getNodes().length === 1
			) {
				if (showCaption) {
					// Move focus into nested editor
					lexical.$setSelection(null);
					event.preventDefault();
					caption.focus();
					return true;
				} else if (buttonElem !== null && buttonElem !== document.activeElement) {
					event.preventDefault();
					buttonElem.focus();
					return true;
				}
			}
			return false;
		},
		[caption, isSelected, showCaption]
	);

	const onEscape = useCallback(
		(event: KeyboardEvent) => {
			if (activeEditorRef.current === caption || buttonRef.current === event.target) {
				lexical.$setSelection(null);
				editor.update(() => {
					setSelected(true);
					const parentRootElement = editor.getRootElement();
					if (parentRootElement !== null) {
						parentRootElement.focus();
					}
				});
				return true;
			}
			return false;
		},
		[caption, editor, setSelected]
	);

	const onClick = useCallback(
		(payload: MouseEvent) => {
			const event = payload;

			if (isResizing()) {
				return true;
			}
			if (event.target === imageRef.current) {
				if (event.shiftKey) {
					setSelected(!isSelected);
				} else {
					clearSelection();
					setSelected(true);
				}
				return true;
			}

			return false;
		},
		[isResizing, isSelected, setSelected, clearSelection]
	);

	const onRightClick = useCallback(
		(event: MouseEvent): void => {
			editor.getEditorState().read(() => {
				const latestSelection = lexical.$getSelection();
				const domElement = event.target as HTMLElement;
				if (
					domElement.tagName === 'IMG' &&
					lexical.$isRangeSelection(latestSelection) &&
					latestSelection.getNodes().length === 1
				) {
					editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent);
				}
			});
		},
		[editor]
	);

	useEffect(() => {
		let isMounted = true;
		const rootElement = editor.getRootElement();
		const unregister = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				if (isMounted) {
					setSelection(editorState.read(() => lexical.$getSelection()));
				}
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, activeEditor) => {
					activeEditorRef.current = activeEditor;
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand<MouseEvent>(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
			editor.registerCommand<MouseEvent>(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event) => {
					if (event.target === imageRef.current) {
						// TODO This is just a temporary workaround for FF to behave like other browsers.
						// Ideally, this handles drag & drop too (and all browsers).
						event.preventDefault();
						return true;
					}
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
			editor.registerCommand(lexical.KEY_BACKSPACE_COMMAND, onDelete, lexical.COMMAND_PRIORITY_LOW),
			editor.registerCommand(lexical.KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(lexical.KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
		);

		rootElement?.addEventListener('contextmenu', onRightClick);

		return () => {
			isMounted = false;
			unregister();
			rootElement?.removeEventListener('contextmenu', onRightClick);
		};
	}, [
		clearSelection,
		editor,
		isResizing,
		isSelected,
		nodeKey,
		onDelete,
		onEnter,
		onEscape,
		onClick,
		onRightClick,
		setSelected
	]);

	const setShowCaption = () => {
		editor.update(() => {
			const node = lexical.$getNodeByKey(nodeKey);
			if (isImageNode(node)) {
				node.setShowCaption(true);
			}
		});
	};

	const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
		// Delay hiding the resize bars for click case
		setTimeout(() => {
			setIsResizing(false);
		}, 200);

		editor.update(() => {
			const node = lexical.$getNodeByKey(nodeKey);
			if (isImageNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight);
			}
		});
	};

	const onResizeStart = () => {
		setIsResizing(true);
	};

	const { historyState } = useSharedHistoryContext();
	const {
		settings: { showNestedEditorTreeView }
	} = useSettings();

	const draggable = isSelected && lexical.$isNodeSelection(selection) && !isResizing();
	const isFocused = isSelected || isResizing();

	$effect(() => {
		AutoFocusPlugin({});
		EmojisPlugin();
		HashtagPlugin();
		KeywordsPlugin();
		HistoryPlugin({ externalHistoryState: historyState });
	});
	console.log('calling image c');
</script>

<div class="bg-red">hello world</div>

<div {draggable}>
	<img
		class={isFocused ? `focused ${lexical.$isNodeSelection(selection) ? 'draggable' : ''}` : null}
		{src}
		alt={altText}
		bind:this={imageRef.current}
		{width}
		{height}
		style={'max-width:' + maxWidth}
	/>
</div>
{#snippet Caption()}
	<ContentEditable className="ImageNode__contentEditable" />
{/snippet}
<div class="image-caption-container">
	<LexicalNestedComposer initialEditor={caption}>
		<LinkPlugin />

		<RichTextPlugin
			contentEditable={Caption}
			contentEditableProps={{ class: 'ImageNode__contentEditable' }}
			placeholderProps={{ class: 'ImageNode__placeholder' }}
			placeholder=" Enter a caption..."
		/>
	</LexicalNestedComposer>
</div>

{#if resizable && lexical.$isNodeSelection(selection) && isFocused}
	<ImageResizer
		{showCaption}
		{setShowCaption}
		{editor}
		{buttonRef}
		{imageRef}
		{maxWidth}
		{onResizeStart}
		{onResizeEnd}
		{captionsEnabled}
	/>
{/if}
