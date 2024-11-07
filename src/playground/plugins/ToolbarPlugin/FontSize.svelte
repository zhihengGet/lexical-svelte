<!-- TODO -->
<script lang="ts">
	import './fontSize.css';

	import { type LexicalEditor } from 'lexical';
	import * as React from 'react';

	import {
		MAX_ALLOWED_FONT_SIZE,
		MIN_ALLOWED_FONT_SIZE,
		useToolbarState
	} from './ToolbarContext.svelte';
	import { SHORTCUTS } from '../ShortCutPlugin/shortcuts';
	import { updateFontSize, updateFontSizeInSelection, UpdateFontSizeType } from './utils';
	let {
		selectionFontSize,
		disabled,
		editor
	}: {
		selectionFontSize: string;
		disabled: boolean;
		editor: LexicalEditor;
	} = $props();
	export function parseAllowedFontSize(input: string): string {
		const match = input.match(/^(\d+(?:\.\d+)?)px$/);
		if (match) {
			const n = Number(match[1]);
			if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
				return input;
			}
		}
		return '';
	}
	const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
	const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);

	const handleKeyPress = (e) => {
		const inputValueNumber = Number(inputValue);

		if (e.key === 'Tab') {
			return;
		}
		if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
			e.preventDefault();
			setInputValue('');
			return;
		}
		setInputChangeFlag(true);
		if (e.key === 'Enter' || e.key === 'Escape') {
			e.preventDefault();

			updateFontSizeByInputValue(inputValueNumber);
		}
	};

	const handleInputBlur = () => {
		if (inputValue() !== '' && inputChangeFlag()) {
			const inputValueNumber = Number(inputValue);
			updateFontSizeByInputValue(inputValueNumber);
		}
	};

	const updateFontSizeByInputValue = (inputValueNumber: number) => {
		let updatedFontSize = inputValueNumber;
		if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
			updatedFontSize = MAX_ALLOWED_FONT_SIZE;
		} else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
			updatedFontSize = MIN_ALLOWED_FONT_SIZE;
		}

		setInputValue(String(updatedFontSize));
		updateFontSizeInSelection(editor, String(updatedFontSize) + 'px', null);
		setInputChangeFlag(false);
	};
	const toolbarState = useToolbarState();
	$effect(() => {
		setInputValue(toolbarState().toolbarState.fontSize.slice(0, -2));
	});
</script>

<button
	type="button"
	disabled={disabled || (selectionFontSize !== '' && Number(inputValue()) <= MIN_ALLOWED_FONT_SIZE)}
	onclick={() => updateFontSize(editor, UpdateFontSizeType.decrement, inputValue())}
	class="toolbar-item font-decrement"
	aria-label="Decrease font size"
	title={`Decrease font size (${SHORTCUTS.DECREASE_FONT_SIZE})`}
>
	<i class="format minus-icon"></i>
</button>

<input
	type="number"
	title="Font size"
	value={inputValue()}
	{disabled}
	class="toolbar-item font-size-input"
	min={MIN_ALLOWED_FONT_SIZE}
	max={MAX_ALLOWED_FONT_SIZE}
	oninput={(e) => setInputValue(e.target.value)}
	onkeydown={handleKeyPress}
	onblur={handleInputBlur}
/>

<button
	type="button"
	disabled={disabled || (selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)}
	onclick={() => updateFontSize(editor, UpdateFontSizeType.increment, inputValue())}
	class="toolbar-item font-increment"
	aria-label="Increase font size"
	title={`Increase font size (${SHORTCUTS.INCREASE_FONT_SIZE})`}
>
	<i class="format add-icon"></i>
</button>
