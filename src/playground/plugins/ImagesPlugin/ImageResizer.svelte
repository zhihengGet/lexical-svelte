<script context="module" lang="ts">
	import type { LexicalEditor } from 'lexical';

	import type * as React from 'react';
	import { useRef } from 'react';
	import { onMount, untrack } from 'svelte';

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	const Direction = {
		east: 1 << 0,
		north: 1 << 3,
		south: 1 << 1,
		west: 1 << 2
	};

	type p = {
		editor: LexicalEditor;
		buttonRef: { current: null | HTMLButtonElement };
		imageRef: { current: null | HTMLElement };
		maxWidth?: number;
		onResizeEnd: (width: 'inherit' | number, height: 'inherit' | number) => void;
		onResizeStart: () => void;
		setShowCaption: (show: boolean) => void;
		showCaption: boolean;
		captionsEnabled: boolean;
	};
</script>

<!-- WARN: maxWidth will cause image to not being able -->
<script lang="ts">
	let {
		showCaption,
		onResizeStart,
		onResizeEnd,
		buttonRef,
		imageRef,
		maxWidth,
		editor,
		setShowCaption,
		captionsEnabled
	} = $props<p>();
	const controlWrapperRef = useRef<HTMLDivElement>(null);
	const userSelect = useRef({
		priority: '',
		value: 'default'
	});
	const positioningRef = useRef<{
		currentHeight: 'inherit' | number;
		currentWidth: 'inherit' | number;
		direction: number;
		isResizing: boolean;
		ratio: number;
		startHeight: number;
		startWidth: number;
		startX: number;
		startY: number;
	}>({
		currentHeight: 0,
		currentWidth: 0,
		direction: 0,
		isResizing: false,
		ratio: 0,
		startHeight: 0,
		startWidth: 0,
		startX: 0,
		startY: 0
	});
	const editorRootElement = editor.getRootElement();
	// Find max width, accounting for editor padding.
	const maxWidthContainer = maxWidth
		? maxWidth
		: editorRootElement !== null
		  ? editorRootElement.getBoundingClientRect().width - 20
		  : 100;
	const maxHeightContainer =
		editorRootElement !== null ? editorRootElement.getBoundingClientRect().height - 20 : 100;

	const minWidth = 100;
	const minHeight = 100;

	const setStartCursor = (direction: number) => {
		const ew = direction === Direction.east || direction === Direction.west;
		const ns = direction === Direction.north || direction === Direction.south;
		const nwse =
			(direction & Direction.north && direction & Direction.west) ||
			(direction & Direction.south && direction & Direction.east);

		const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

		if (editorRootElement !== null) {
			editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
		}
		if (document.body !== null && userSelect.current) {
			document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
			userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
			userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
			document.body.style.setProperty('-webkit-user-select', `none`, 'important');
		}
	};

	const setEndCursor = () => {
		if (editorRootElement !== null) {
			editorRootElement.style.setProperty('cursor', 'text');
		}
		if (document.body !== null) {
			document.body.style.setProperty('cursor', 'default');
			document.body.style.setProperty(
				'-webkit-user-select',
				userSelect.current.value,
				userSelect.current.priority
			);
		}
	};

	const handlePointerDown = (event: PointerEvent, direction: number) => {
		if (!editor.isEditable()) {
			return console.error('not editble editor, cant resize');
		}

		const image = imageRef.current;
		const controlWrapper = controlWrapperRef.current;

		if (image !== null && controlWrapper !== null) {
			event.preventDefault();
			const { width, height } = image.getBoundingClientRect();

			const positioning = positioningRef.current;

			if (!positioning) return console.error('positioning is empty 128');

			positioning.startWidth = width;
			positioning.startHeight = height;
			positioning.ratio = width / height;
			positioning.currentWidth = width;
			positioning.currentHeight = height;
			positioning.startX = event.clientX;
			positioning.startY = event.clientY;
			positioning.isResizing = true;
			positioning.direction = direction;

			console.log('handlePointerDown', positioning, event.clientX);
			setStartCursor(direction);
			onResizeStart();

			controlWrapper.classList.add('image-control-wrapper--resizing');
			image.style.height = `${height}px`;
			image.style.width = `${width}px`;

			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);
		}
	};
	const handlePointerMove = (event: PointerEvent) => {
		const image = imageRef.current;
		/* 	const className = image?.className;
		image?.classList.remove('w-100');
		image?.classList.remove('h-100'); */
		const positioning = positioningRef.current;
		if (!positioning) return console.error('positioning is empty');
		const isHorizontal = positioning.direction & (Direction.east | Direction.west);
		const isVertical = positioning.direction & (Direction.south | Direction.north);

		if (image !== null && positioning.isResizing) {
			// Corner cursor
			if (isHorizontal && isVertical) {
				let diff = Math.floor(positioning.startX - event.clientX);
				diff = positioning.direction & Direction.east ? -diff : diff;

				const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);

				const height = width / positioning.ratio;
				image.style.width = `${width}px`;
				image.style.height = `${height}px`;
				positioning.currentHeight = height;
				positioning.currentWidth = width;
				//console.log('updated position', image.style.width);
			} else if (isVertical) {
				let diff = Math.floor(positioning.startY - event.clientY);
				diff = positioning.direction & Direction.south ? -diff : diff;

				const height = clamp(positioning.startHeight + diff, minHeight, maxHeightContainer);

				image.style.height = `${height}px`;
				positioning.currentHeight = height;
			} else {
				let diff = Math.floor(positioning.startX - event.clientX);
				diff = positioning.direction & Direction.east ? -diff : diff;

				const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);

				image.style.width = `${width}px`;
				positioning.currentWidth = width;
			}
		}
	};
	const handlePointerUp = () => {
		const image = imageRef.current;
		const positioning = positioningRef.current;
		if (!positioning) return console.error('positioning is empty 192');
		const controlWrapper = controlWrapperRef.current;
		if (image !== null && controlWrapper !== null && positioning.isResizing) {
			const width = positioning.currentWidth;
			const height = positioning.currentHeight;
			positioning.startWidth = 0;
			positioning.startHeight = 0;
			positioning.ratio = 0;
			positioning.startX = 0;
			positioning.startY = 0;
			positioning.currentWidth = 0;
			positioning.currentHeight = 0;
			positioning.isResizing = false;

			controlWrapper.classList.remove('image-control-wrapper--resizing');

			setEndCursor();

			onResizeEnd(width, height);

			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		}
	};

	console.log('rerendered image transfomer');
</script>

<div bind:this={controlWrapperRef.current} class="absolute w-100% h-full top-0 bottom-0">
	<button
		data-id="image-caption-button"
		class="absolute top-0 bg-transparent opacity-50 hover:opacity-80"
		bind:this={buttonRef.current}
		onclick={() => {
			setShowCaption();
		}}
	>
		Add Caption
	</button>

	<div
		class="image-resizer image-resizer-n"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.north);
		}}
	/>
	<div
		class="image-resizer image-resizer-ne"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.north | Direction.east);
		}}
	/>
	<div
		class="image-resizer image-resizer-e"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.east);
		}}
	/>
	<div
		class="image-resizer image-resizer-se"
		onpointerdown={(event) => {
			console.log('se');
			handlePointerDown(event, Direction.south | Direction.east);
		}}
	/>
	<div
		class="image-resizer image-resizer-s"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.south);
		}}
	/>
	<div
		class="image-resizer image-resizer-sw"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.south | Direction.west);
		}}
	/>
	<div
		class="image-resizer image-resizer-w"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.west);
		}}
	/>
	<div
		class="image-resizer image-resizer-nw"
		onpointerdown={(event) => {
			handlePointerDown(event, Direction.north | Direction.west);
		}}
	/>
</div>
