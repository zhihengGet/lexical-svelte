<script context="module" lang="ts">
	import type { TableOfContentsEntry } from '@lexical/react/LexicalTableOfContents';
	import type { HeadingTagType } from '@lexical/rich-text';
	import type { NodeKey } from 'lexical';

	import './index.css';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
	import LexicalTableOfContents from '@lexical/react/LexicalTableOfContents';
	import { useEffect, useRef, useState } from 'react';
	import * as React from 'react';
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
			if (tableOfContents.length !== 0 && selectedIndex.current < tableOfContents.length - 1) {
				let currentHeading = editor.getElementByKey(tableOfContents[selectedIndex.current][0]);
				if (currentHeading !== null) {
					if (isHeadingBelowTheTopOfThePage(currentHeading)) {
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
								(isHeadingAboveViewport(prevHeading) || isHeadingBelowTheTopOfThePage(prevHeading))
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

<div class="table-of-contents">
	<ul class="headings">
		{#each tableOfContents as [key, text, tag], index}
			{#if index == 0}
				<div class="normal-heading-wrapper">
					<div
						class="first-heading"
						onClick={() => scrollToNode(key, index)}
						role="button"
						tabIndex={0}
					>
						{('' + text).length > 20 ? text.substring(0, 20) + '...' : text}
					</div>
					<br />
				</div>
			{/if}
		{:else}
			<div
				class={`normal-heading-wrapper ${selectedKey === key ? 'selected-heading-wrapper' : ''}`}
			>
				<div
					onClick={() => scrollToNode(key, index)}
					role="button"
					class={indent(tag)}
					tabIndex={0}
				>
					<li
						class={`normal-heading ${selectedKey === key ? 'selected-heading' : ''}
                  `}
					>
						{('' + text).length > 27 ? text.substring(0, 27) + '...' : text}
					</li>
				</div>
			</div>
		{/each}
	</ul>
</div>
