<script lang="ts">
	import { debounce } from 'lodash-es';
	import { useEffect, useMemo, useRef, useState } from 'react';
	import { onMount, type Snippet } from 'svelte';

	interface Position {
		x: number;
		y: number;
	}

	interface MoveWrapperProps {
		class?: string;
		style?: string;
		onChange: (position: Position) => void;
		children: Snippet;
	}
	let { onChange, ...props } = $props<MoveWrapperProps>();

	let divRef = useRef<HTMLDivElement | null>(null);
	function clamp(value: number, max: number, min: number) {
		return value > max ? max : value < min ? min : value;
	}
	const move = (e: MouseEvent): void => {
		if (divRef.current) {
			const { current: div } = divRef;
			const { width, height, left, top } = div.getBoundingClientRect();

			const x = clamp(e.clientX - left, width, 0);
			const y = clamp(e.clientY - top, height, 0);

			onChange({ x, y });
		}
	};
	const onMouseDown = (e: React.MouseEvent): void => {
		if (e.button !== 0) return;

		move(e);

		const onMouseMove = (_e: MouseEvent): void => {
			move(_e);
		};

		const onMouseUp = (_e: MouseEvent): void => {
			document.removeEventListener('mousemove', onMouseMove, false);
			document.removeEventListener('mouseup', onMouseUp, false);

			move(_e);
		};

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mouseup', onMouseUp, false);
	};
</script>

<div bind:this={divRef.current} {...props} onmousedown={onMouseDown}>
	<slot />
</div>
