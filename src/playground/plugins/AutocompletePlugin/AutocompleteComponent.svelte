<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	// @ts-nocheck

	import { useSharedAutocompleteContext } from '../../context/SharedAutocompleteContext.svelte';
	import {
		COMMAND_PRIORITY_LOW,
		COMMAND_PRIORITY_NORMAL,
		KEY_ARROW_DOWN_COMMAND,
		KEY_ARROW_UP_COMMAND,
		KEY_ENTER_COMMAND
	} from 'lexical';
	import { SELECTED_CLASSNAME } from '.';
	import { addClassNamesToElement, removeClassNamesFromElement } from '@lexical/utils';
	import { onDestroy, onMount } from 'svelte';

	const data = useSharedAutocompleteContext();
	const userAgentData = window.navigator.userAgentData;
	const isMobile =
		userAgentData !== undefined
			? userAgentData.mobile
			: window.innerWidth <= 800 && window.innerHeight <= 600;

	let div: HTMLElement;
	const [editor] = useLexicalComposerContext();
	const a = editor.registerCommand(
		KEY_ARROW_DOWN_COMMAND,
		(e, editor) => {
			e.preventDefault();
			const node = document.getElementsByClassName(SELECTED_CLASSNAME).item(0);

			if (node) {
				node.classList.remove(SELECTED_CLASSNAME);

				const next = node.nextElementSibling || div.firstElementChild;
				data.select = next?.textContent ?? '';
				next?.classList.add(SELECTED_CLASSNAME);
				return true;
			}
			return false;
		},
		COMMAND_PRIORITY_LOW
	);
	const b = editor.registerCommand(
		KEY_ARROW_UP_COMMAND,
		(e, editor) => {
			e.preventDefault();
			const node = document.getElementsByClassName(SELECTED_CLASSNAME).item(0);

			if (node) {
				node.classList.remove(SELECTED_CLASSNAME);

				const prev = node.previousElementSibling || div.lastElementChild;
				data.select = prev?.textContent ?? '';
				prev?.classList.add(SELECTED_CLASSNAME);
				return true;
			}
			return false;
		},
		COMMAND_PRIORITY_LOW
	);
	data.select = data.suggestions[0];
	onDestroy(() => {
		a();
		b();
	});
</script>

<span class="text-[#ccc] relative" spellcheck="false">
	{data.select}
	{isMobile ? '(SWIPE \u2B95)' : '(TAB)'}

	<div
		class="absolute bottom-[-5] border-[1px] border-solid border-green left-0 z-5 w-100px max-w-120px rounded"
		bind:this={div}
	>
		{#each data.suggestions as item, key}
			<button
				onclick={(e) => {
					data.updateChoose(item);
				}}
				data-id="suggestions"
				onmousedown={(e) => e.preventDefault()}
				class="block w-full font-500 text-truncate text-purple font-600 hover:bg-amber {key == 0
					? SELECTED_CLASSNAME
					: ''}"
			>
				{item}
			</button>
		{/each}
	</div>
</span>

<style>
	.auto_selected {
		background-color: aquamarine;
	}
</style>
