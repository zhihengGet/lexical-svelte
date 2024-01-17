<script context="module" lang="ts">
	import DropDown from '@ui/Dropdown/DropDown.svelte';
	import { DropDownItem } from '@ui/index';
	import type * as lexical from 'lexical';
	import { FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical';
	import { ELEMENT_FORMAT_OPTIONS } from '.';
	import Divider from './Divider.svelte';
	export const blockTypeToBlockName = {
		bullet: 'Bulleted List',
		check: 'Check List',
		code: 'Code Block',
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		h5: 'Heading 5',
		h6: 'Heading 6',
		number: 'Numbered List',
		paragraph: 'Normal',
		quote: 'Quote'
	};

	export const rootTypeToRootName = {
		root: 'Root',
		table: 'Table'
	};
	export function dropDownActiveClass(active: boolean) {
		if (active) return 'active dropdown-item-active';
		else return '';
	}
</script>

<script lang="ts">
	let {
		editor,
		value,
		isRTL,
		disabled = false
	} = $props<{
		editor: lexical.LexicalEditor;
		value: lexical.ElementFormatType;
		isRTL: boolean;
		disabled: boolean;
	}>();
	const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];
</script>

<DropDown
	{disabled}
	buttonLabel={formatOption.name}
	buttonIconClassName={`icon ${isRTL ? formatOption.iconRTL : formatOption.icon}`}
	buttonClassName="toolbar-item spaced alignment"
	buttonAriaLabel="Formatting options for text alignment"
>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
		}}
		class="item"
	>
		<i class="icon left-align" />
		<span class="text">Left Align</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
		}}
		class="item"
	>
		<i class="icon center-align" />
		<span class="text">Center Align</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
		}}
		class="item"
	>
		<i class="icon right-align" />
		<span class="text">Right Align</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
		}}
		class="item"
	>
		<i class="icon justify-align" />
		<span class="text">Justify Align</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
		}}
		class="item"
	>
		<i
			class={`icon ${
				isRTL ? ELEMENT_FORMAT_OPTIONS.start.iconRTL : ELEMENT_FORMAT_OPTIONS.start.icon
			}`}
		/>
		<span class="text">Start Align</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
		}}
		class="item"
	>
		<i
			class={`icon ${isRTL ? ELEMENT_FORMAT_OPTIONS.end.iconRTL : ELEMENT_FORMAT_OPTIONS.end.icon}`}
		/>
		<span class="text">End Align</span>
	</DropDownItem>
	<Divider />
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
		}}
		class="item"
	>
		<i class={'icon ' + (isRTL ? 'indent' : 'outdent')} />
		<span class="text">Outdent</span>
	</DropDownItem>
	<DropDownItem
		onClick={() => {
			editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
		}}
		class="item"
	>
		<i class={'icon ' + (isRTL ? 'outdent' : 'indent')} />
		<span class="text">Indent</span>
	</DropDownItem>
</DropDown>
