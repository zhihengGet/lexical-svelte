<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import { useSharedAutocompleteContext } from '../../context/SharedAutocompleteContext.svelte';
	import {
		$setSelection as setSelection,
		COMMAND_PRIORITY_LOW,
		COMMAND_PRIORITY_NORMAL,
		KEY_ARROW_DOWN_COMMAND,
		KEY_ARROW_UP_COMMAND,
		KEY_ENTER_COMMAND,
		$getSelection as getSelection
	} from 'lexical';
	import { ClickAutoComplete, SELECTED_CLASSNAME } from '.';
	import {
		addClassNamesToElement,
		mergeRegister,
		removeClassNamesFromElement
	} from '@lexical/utils';
	import { flushSync, onDestroy, onMount } from 'svelte';
	import { useClickOutside } from '../../utils/isClickOutside';

	let { ...props } = $props<{ visibility: 'hidden' | 'visible' }>();
	console.log('auto node', JSON.stringify(props));
	const data = useSharedAutocompleteContext();
	const userAgentData = window.navigator.userAgentData;
	const isMobile =
		userAgentData !== undefined
			? userAgentData.mobile
			: window.innerWidth <= 800 && window.innerHeight <= 600;
	function checkInView(container: HTMLElement, element: HTMLElement, partial: boolean) {
		//Get container properties
		let cTop = container.scrollTop;
		let cBottom = cTop + container.clientHeight;

		//Get element properties
		let eTop = element.offsetTop;
		let eBottom = eTop + element.clientHeight;

		//Check if in view
		let isTotal = eTop >= cTop && eBottom <= cBottom;
		let isPartial =
			partial && ((eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom));

		//Return outcome
		return isTotal || isPartial;
	}
	let div = $state<HTMLElement>();
	const [editor] = useLexicalComposerContext();
	const a = editor.registerCommand(
		KEY_ARROW_DOWN_COMMAND,
		(e, editor) => {
			e.preventDefault();
			const node = document.getElementsByClassName(SELECTED_CLASSNAME).item(0);
			if (node && props.visibility != 'hidden' && div) {
				node.classList.remove(SELECTED_CLASSNAME);

				const next = node.nextElementSibling || div.firstElementChild;
				data.select = next?.textContent ?? '';
				next?.classList.add(SELECTED_CLASSNAME);
				next?.scrollIntoView();
				//checkInView(div, next, false) ? '' : next?.scrollIntoView();
				//next?.focus();
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
			if (node && props.visibility != 'hidden' && div) {
				node.classList.remove(SELECTED_CLASSNAME);

				const prev = node.previousElementSibling || div.lastElementChild;
				data.select = prev?.textContent ?? '';
				prev?.classList.add(SELECTED_CLASSNAME);
				prev?.scrollIntoView();
				//prev?.focus();
				return true;
			}
			return false;
		},
		COMMAND_PRIORITY_LOW
	);
	$effect(() => {
		if (data.suggestions && div) {
			div.scrollTop = 0;
		}
	});
	//data.select = data.suggestions[0];
	onDestroy(() => {
		a();
		b();
		data.select = '';
	});
	let el = $state();

	/* $effect(() => {
		useClickOutside(el, {
			enabled: true,
			handler: (e) => {
				e.preventDefault();
				console.log('click outside');
				editor.update(() => {
					//setSelection(getSelection());
					editor.focus();
				});
			}
		});
	}); */
</script>

<span
	class="text-[#ccc] absolute inline-block z-500 {data.select ? ' w-fit ' : 'w-0px'}"
	spellcheck="false"
	data-id="autocomplete-{props.nodeKey}"
	bind:this={el}
	class:hidden={data.suggestions.length == 0}
	autofocus={false}
	style="top:{props.top}px;left:{props.left}px;visibility:{props.visibility};"
>
	{#if data.select}
		{data.select}
		(TAB)
	{/if}
	<div
		class="max-h-30 overflow-auto bottom-[-5] border-[1px] border-solid border-green left-0 z-5000 w-100px max-w-120px rounded"
		bind:this={div}
	>
		{#each data.suggestions as item, key}
			<button
				onpointerup={(e) => {
					data.updateChoose(item);
					flushSync(() => {
						editor.dispatchCommand(ClickAutoComplete, { item });
					});
				}}
				onclick={(e) => {
					data.updateChoose(item);
					flushSync(() => {
						editor.dispatchCommand(ClickAutoComplete, { item });
					});
				}}
				data-id="suggestions"
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
		background-color: yellow;
		text-decoration: underline;
	}
</style>
