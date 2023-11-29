<script context="module" lang="ts">
	import type {
		GridSelection,
		LexicalCommand,
		LexicalEditor,
		NodeKey,
		NodeSelection,
		RangeSelection
	} from 'lexical';

	import './ImageNode.css';

	import { AutoFocusPlugin } from '@plugins/AutoFocus/LexicalAutoFocusPlugin.svelte';
	import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext.svelte';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
	import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin.svelte';
	import { default as LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer.svelte';
	import { default as RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin.svelte';
	import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.svelte';
	import { mergeRegister } from '@lexical/utils';
	import {
		$getNodeByKey as getNodeByKey,
		$getSelection as getSelection,
		$isNodeSelection as isNodeSelection,
		$isRangeSelection as isRangeSelection,
		$setSelection as setSelection,
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
	import { useCallback, useEffect, useRef, useState } from 'react';

	import { useSettings } from '../../context/SettingsContext.svelte';
	import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
	import EmojisPlugin from '@plugins/EmojisPlugin';
	import KeywordsPlugin from '@plugins/KeywordsPlugin';
	import LinkPlugin from '@plugins/LinkPlugin/LinkPlugin.svelte';
	//import MentionsPlugin from '@plugins/MentionsPlugin/MentionsPlugin.svelte';
	import TreeViewPlugin from '@plugins/TreeViewPlugin/TreeViewPlugin.svelte';
	import ContentEditable from '../../ui/ContentEditable.svelte';
	import ImageResizer from './ImageResizer.svelte';
	import Placeholder from '../../ui/Placeholder.svelte';
	import { $isImageNode as isImageNode } from './ImageNode';
	import Portal from '@ui/Portal.svelte';
	export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand(
		'RIGHT_CLICK_IMAGE_COMMAND'
	);
	const imageCache = new Set();
</script>

<script lang="ts">
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
			if (isSelected() && isNodeSelection(getSelection())) {
				const event: KeyboardEvent = payload;
				event.preventDefault();
				const node = getNodeByKey(nodeKey);
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
			const latestSelection = getSelection();
			const buttonElem = buttonRef.current;
			if (
				isSelected() &&
				isNodeSelection(latestSelection) &&
				latestSelection.getNodes().length === 1
			) {
				if (showCaption) {
					// Move focus into nested editor
					setSelection(null);
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
				setSelection(null);
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
				const latestSelection = getSelection();
				const domElement = event.target as HTMLElement;
				if (
					domElement.tagName === 'IMG' &&
					isRangeSelection(latestSelection) &&
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
					setSelection(editorState.read(() => getSelection()));
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
			editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
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
			const node = getNodeByKey(nodeKey);
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
			const node = getNodeByKey(nodeKey);
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

	//const draggable = isSelected && isNodeSelection(selection) && !isResizing;
	let openImageResizer = $derived((isSelected() || isResizing()) && resizable);
	const mw = maxWidth;
</script>

<div draggable="true">
	<img
		{src}
		alt={altText}
		bind:this={imageRef.current}
		{width}
		{height}
		style={'max-width:' + maxWidth}
	/>
</div>
<!-- {#snippet Caption()}
	<ContentEditable class="w-full mx-1 h-25px leading-normal border-0 outline-none" />
{/snippet}
{#if showCaption}
	<div class="block relative p-0 m-0 overflow-hidden" style="width:{imageRef.current.style.width}">
		<LexicalNestedComposer initialEditor={caption}>
			<LinkPlugin />
			<Portal initializor={HashtagPlugin} />
			<Portal initializor={HashtagPlugin} />
			<Portal initializor={AutoFocusPlugin} />
			<Portal initializor={() => HistoryPlugin({ externalHistoryState: historyState })} />

			<RichTextPlugin
				contentEditable={Caption}
				placeholder="Enter a caption..."
				placeholderProps={{
					class:
						'select-none leading-normal inline-block absolute bottom-0 left-0 w-full pointer-events-none bg-neutral-200 border-0 outline-none overflow-hidden text-ellipsis text-coolGray pl-5 cursor-cell bg-transparent'
				}}
			/>
		</LexicalNestedComposer>
	</div>
{/if}

{#if isNodeSelection(selection()) && openImageResizer}
	<ImageResizer
		{setShowCaption}
		{editor}
		{buttonRef}
		{imageRef}
		maxWidth={10000}
		{onResizeStart}
		{onResizeEnd}
	/>
{/if}
 -->
