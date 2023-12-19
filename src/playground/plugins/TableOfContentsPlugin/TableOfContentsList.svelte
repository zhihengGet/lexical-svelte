<script lang="ts" context="module">
	import type { HeadingTagType } from '@lexical/rich-text';
	import type { NodeKey } from 'lexical';

	import { type TableOfContentsEntry } from './LexicalTableOfContents.svelte';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { useEffect, useRef, useState } from 'react';
	import * as React from 'react';

	const MARGIN_ABOVE_EDITOR = 624;
	const HEADING_WIDTH = 9;

	function indent(tagName: HeadingTagType) {
		if (tagName === 'h2') {
			return 'heading2';
		} else if (tagName === 'h3') {
			return 'heading3';
		}
	}

	function isHeadingAtTheTopOfThePage(element: HTMLElement): boolean {
		const elementYPosition = element?.getClientRects()[0].y;
		return (
			elementYPosition >= MARGIN_ABOVE_EDITOR &&
			elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
		);
	}
	function isHeadingAboveViewport(element: HTMLElement): boolean {
		const elementYPosition = element?.getClientRects()[0].y;
		return elementYPosition < MARGIN_ABOVE_EDITOR;
	}
	function isHeadingBelowTheTopOfThePage(element: HTMLElement): boolean {
		const elementYPosition = element?.getClientRects()[0].y;
		return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH;
	}
</script>

<script lang="ts">
	type props = {
		tableOfContents: Array<TableOfContentsEntry>;
	};
	let { tableOfContents } = $props<props>();
	const [selectedKey, setSelectedKey] = useState('');
	const selectedIndex = useRef(0);
	const [editor] = useLexicalComposerContext();

	function scrollToNode(key: NodeKey, currIndex: number) {
		editor.getEditorState().read(() => {
			const domElement = editor.getElementByKey(key);
			if (domElement !== null) {
				domElement.scrollIntoView();
				setSelectedKey(key);
				selectedIndex.current = currIndex;
			}
		});
	}

	useEffect(() => {
		function scrollCallback() {
			if (selectedIndex.current !== null)
				if (tableOfContents.length !== 0 && selectedIndex.current < tableOfContents.length - 1) {
					let currentHeading = editor.getElementByKey(tableOfContents[selectedIndex.current][0]);
					if (currentHeading !== null) {
						if (isHeadingBelowTheTopOfThePage(currentHeading) && selectedIndex.current !== null) {
							//On natural scroll, user is scrolling up
							while (
								currentHeading !== null &&
								isHeadingBelowTheTopOfThePage(currentHeading) &&
								selectedIndex.current > 0
							) {
								const prevHeading = editor.getElementByKey(
									tableOfContents[selectedIndex.current - 1][0]
								);
								if (
									prevHeading !== null &&
									(isHeadingAboveViewport(prevHeading) ||
										isHeadingBelowTheTopOfThePage(prevHeading))
								) {
									selectedIndex.current--;
								}
								currentHeading = prevHeading;
							}
							const prevHeadingKey = tableOfContents[selectedIndex.current][0];
							setSelectedKey(prevHeadingKey);
						} else if (isHeadingAboveViewport(currentHeading)) {
							//On natural scroll, user is scrolling down
							while (
								currentHeading !== null &&
								isHeadingAboveViewport(currentHeading) &&
								selectedIndex.current < tableOfContents.length - 1
							) {
								const nextHeading = editor.getElementByKey(
									tableOfContents[selectedIndex.current + 1][0]
								);
								if (
									nextHeading !== null &&
									(isHeadingAtTheTopOfThePage(nextHeading) || isHeadingAboveViewport(nextHeading))
								) {
									selectedIndex.current++;
								}
								currentHeading = nextHeading;
							}
							const nextHeadingKey = tableOfContents[selectedIndex.current][0];
							setSelectedKey(nextHeadingKey);
						}
					}
				} else {
					selectedIndex.current = 0;
				}
		}
		let timerId: ReturnType<typeof setTimeout>;

		function debounceFunction(func: () => void, delay: number) {
			clearTimeout(timerId);
			timerId = setTimeout(func, delay);
		}

		function onScroll(): void {
			debounceFunction(scrollCallback, 10);
		}

		document.addEventListener('scroll', onScroll);
		return () => document.removeEventListener('scroll', onScroll);
	}, [tableOfContents, editor]);
</script>
