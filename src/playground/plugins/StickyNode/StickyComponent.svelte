<script context="module" lang="ts">
	import type { LexicalEditor, NodeKey } from 'lexical';

	import './StickyNode.css';

	import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext.svelte';
	import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin.svelte';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin.svelte';
	import { default as LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer.svelte';
	import { default as PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin.svelte';
	import { $getNodeByKey as getNodeByKey } from 'lexical';
	import { useEffect, useRef } from 'react';
	import useLayoutEffect from 'shared/useLayoutEffect.svelte';
	import * as lexical from 'lexical';
	import { createWebsocketProvider } from '../../collaboration';
	import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
	import StickyEditorTheme from '../../../themes/StickyEditorTheme';
	import ContentEditable from '../../ui/ContentEditable.svelte';
	import Placeholder from '@ui/Placeholder.svelte';
	import { $isStickyNode as isStickyNode } from './StickyNode';
	import Portal from '@ui/Portal.svelte';

	type Positioning = {
		isDragging: boolean;
		offsetX: number;
		offsetY: number;
		rootElementRect: null | ClientRect;
		x: number;
		y: number;
	};

	function positionSticky(stickyElem: HTMLElement, positioning: Positioning): void {
		const style = stickyElem.style;
		const rootElementRect = positioning.rootElementRect;
		const rectLeft = rootElementRect !== null ? rootElementRect.left : 0;
		const rectTop = rootElementRect !== null ? rootElementRect.top : 0;
		style.top = rectTop + positioning.y + 'px';
		style.left = rectLeft + positioning.x + 'px';
	}

	type prop = {
		caption: LexicalEditor;
		color: 'pink' | 'yellow';
		nodeKey: NodeKey;
		x: number;
		y: number;
	};
</script>

<script lang="ts">
	let { caption, color, nodeKey, x, y } = $props<prop>();
	const [editor] = useLexicalComposerContext();
	const stickyContainerRef = useRef<null | HTMLDivElement>(null);
	const positioningRef = useRef<Positioning>({
		isDragging: false,
		offsetX: 0,
		offsetY: 0,
		rootElementRect: null,
		x: 0,
		y: 0
	});
	const { isCollabActive } = useCollaborationContext();

	useEffect(() => {
		const position = positioningRef.current;
		position.x = x;
		position.y = y;

		const stickyContainer = stickyContainerRef.current;
		if (stickyContainer !== null) {
			positionSticky(stickyContainer, position);
		}
	}, [x, y]);

	useLayoutEffect(() => {
		const position = positioningRef.current;
		const resizeObserver = new ResizeObserver((entries) => {
			for (let i = 0; i < entries.length; i++) {
				const entry = entries[i];
				const { target } = entry;
				position.rootElementRect = target.getBoundingClientRect();
				const stickyContainer = stickyContainerRef.current;
				if (stickyContainer !== null) {
					positionSticky(stickyContainer, position);
				}
			}
		});

		const removeRootListener = editor.registerRootListener((nextRootElem, prevRootElem) => {
			if (prevRootElem !== null) {
				resizeObserver.unobserve(prevRootElem);
			}
			if (nextRootElem !== null) {
				resizeObserver.observe(nextRootElem);
			}
		});

		const handleWindowResize = () => {
			const rootElement = editor.getRootElement();
			const stickyContainer = stickyContainerRef.current;
			if (rootElement !== null && stickyContainer !== null) {
				position.rootElementRect = rootElement.getBoundingClientRect();
				positionSticky(stickyContainer, position);
			}
		};

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
			removeRootListener();
		};
	}, [editor]);

	useEffect(() => {
		const stickyContainer = stickyContainerRef.current;
		if (stickyContainer !== null) {
			// Delay adding transition so we don't trigger the
			// transition on load of the sticky.
			setTimeout(() => {
				stickyContainer.style.setProperty('transition', 'top 0.3s ease 0s, left 0.3s ease 0s');
			}, 500);
		}
	}, []);

	const handlePointerMove = (event: PointerEvent) => {
		const stickyContainer = stickyContainerRef.current;
		const positioning = positioningRef.current;
		const rootElementRect = positioning.rootElementRect;
		if (stickyContainer !== null && positioning.isDragging && rootElementRect !== null) {
			positioning.x = event.pageX - positioning.offsetX - rootElementRect.left;
			positioning.y = event.pageY - positioning.offsetY - rootElementRect.top;
			positionSticky(stickyContainer, positioning);
		}
	};

	const handlePointerUp = (event: PointerEvent) => {
		const stickyContainer = stickyContainerRef.current;
		const positioning = positioningRef.current;
		if (stickyContainer !== null) {
			positioning.isDragging = false;
			stickyContainer.classList.remove('dragging');
			editor.update(() => {
				const node = getNodeByKey(nodeKey);
				if (isStickyNode(node)) {
					node.setPosition(positioning.x, positioning.y);
				}
			});
		}
		document.removeEventListener('pointermove', handlePointerMove);
		document.removeEventListener('pointerup', handlePointerUp);
	};

	const handleDelete = () => {
		editor.update(() => {
			const node = getNodeByKey(nodeKey);
			if (isStickyNode(node)) {
				node.remove();
			}
		});
	};

	const handleColorChange = () => {
		editor.update(() => {
			const node = getNodeByKey(nodeKey);
			if (isStickyNode(node)) {
				node.toggleColor();
			}
		});
	};

	const { historyState } = useSharedHistoryContext();
</script>

<div bind:this={stickyContainerRef.current} class="sticky-note-container">
	<div
		class={`sticky-note ${color}`}
		onPointerDown={(event) => {
			const stickyContainer = stickyContainerRef.current;
			if (
				stickyContainer == null ||
				event.button === 2 ||
				event.target !== stickyContainer.firstChild
			) {
				// Right click or click on editor should not work
				return;
			}
			const stickContainer = stickyContainer;
			const positioning = positioningRef.current;
			if (stickContainer !== null) {
				const { top, left } = stickContainer.getBoundingClientRect();
				positioning.offsetX = event.clientX - left;
				positioning.offsetY = event.clientY - top;
				positioning.isDragging = true;
				stickContainer.classList.add('dragging');
				document.addEventListener('pointermove', handlePointerMove);
				document.addEventListener('pointerup', handlePointerUp);
				event.preventDefault();
			}
		}}
	>
		<button onClick={handleDelete} class="delete" aria-label="Delete sticky note" title="Delete">
			X
		</button>
		<button
			onClick={handleColorChange}
			class="color"
			aria-label="Change sticky note color"
			title="Color"
		>
			<i class="bucket" />
		</button>
		<LexicalNestedComposer initialEditor={caption} initialTheme={StickyEditorTheme}>
			{#if isCollabActive}
				<Portal
					{...CollaborationPlugin({
						id: caption.getKey(),
						providerFactory: createWebsocketProvider,
						shouldBootstrap: true
					})}
				/>
			{:else}
				<Portal
					component={HistoryPlugin({
						externalHistoryState: historyState
					})}
				/>
			{/if}

			<PlainTextPlugin
				contentEditable={ContentEditable}
				contentEditableProps={{ class: 'StickyNode__contentEditable' }}
				placeholder={' Whats up?'}
				placeholderProps="StickyNode__placeholder"
			/>
		</LexicalNestedComposer>
	</div>
</div>
