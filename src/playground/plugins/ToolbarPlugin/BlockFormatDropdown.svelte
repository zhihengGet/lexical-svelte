<script context="module" lang="ts">
	import * as lexical from 'lexical';
	import DropDown from '@ui/Dropdown/DropDown.svelte';
	import * as Selection from '@lexical/selection';
	import type { HeadingTagType } from '@lexical/rich-text';
	import * as RichText from '@lexical/rich-text';
	import * as Code from '@lexical/code';
	import {
		INSERT_CHECK_LIST_COMMAND,
		INSERT_ORDERED_LIST_COMMAND,
		INSERT_UNORDERED_LIST_COMMAND,
		REMOVE_LIST_COMMAND
	} from '@lexical/list';
	import { DropDownItem } from '@ui/index';
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
		blockType,
		rootType,
		disabled = false
	} = $props<{
		blockType: keyof typeof blockTypeToBlockName;
		rootType: keyof typeof rootTypeToRootName;
		editor: lexical.LexicalEditor;
		disabled?: boolean;
	}>();

	const formatParagraph = () => {
		editor.update(() => {
			const selection = lexical.$getSelection();
			if (lexical.$isRangeSelection(selection) || lexical.DEPRECATED_$isGridSelection(selection)) {
				Selection.$setBlocksType(selection, () => lexical.$createParagraphNode());
			}
		});
	};

	const formatHeading = (headingSize: HeadingTagType) => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = lexical.$getSelection();
				if (
					lexical.$isRangeSelection(selection) ||
					lexical.DEPRECATED_$isGridSelection(selection)
				) {
					Selection.$setBlocksType(selection, () => RichText.$createHeadingNode(headingSize));
				}
			});
		}
	};

	const formatBulletList = () => {
		if (blockType !== 'bullet') {
			console.log('format list', blockType);
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatCheckList = () => {
		if (blockType !== 'check') {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== 'number') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatQuote = () => {
		if (blockType !== 'quote') {
			editor.update(() => {
				const selection = lexical.$getSelection();
				if (
					lexical.$isRangeSelection(selection) ||
					lexical.DEPRECATED_$isGridSelection(selection)
				) {
					Selection.$setBlocksType(selection, () => RichText.$createQuoteNode());
				}
			});
		}
	};

	const formatCode = () => {
		if (blockType !== 'code') {
			editor.update(() => {
				let selection = lexical.$getSelection();

				if (
					lexical.$isRangeSelection(selection) ||
					lexical.DEPRECATED_$isGridSelection(selection)
				) {
					if (selection.isCollapsed()) {
						Selection.$setBlocksType(selection, () => Code.$createCodeNode());
					} else {
						const textContent = selection.getTextContent();
						const codeNode = Code.$createCodeNode();
						selection.insertNodes([codeNode]);
						selection = lexical.$getSelection();
						if (lexical.$isRangeSelection(selection)) selection.insertRawText(textContent);
					}
				}
			});
		}
	};
</script>

<DropDown
	{disabled}
	buttonClassName="toolbar-item block-controls"
	buttonIconClassName={'icon block-type ' + blockType}
	buttonLabel={blockTypeToBlockName[blockType]}
	buttonAriaLabel="Formatting options for text style"
>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'paragraph')}
		onClick={formatParagraph}
	>
		<i class="icon paragraph" />
		<span class="text">Normal</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'h1')}
		onClick={() => formatHeading('h1')}
	>
		<i class="icon h1" />
		<span class="text">Heading 1</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'h2')}
		onClick={() => formatHeading('h2')}
	>
		<i class="icon h2" />
		<span class="text">Heading 2</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'h3')}
		onClick={() => formatHeading('h3')}
	>
		<i class="icon h3" />
		<span class="text">Heading 3</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'bullet')}
		onClick={formatBulletList}
	>
		<i class="icon bullet-list" />
		<span class="text">Bullet List</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'number')}
		onClick={formatNumberedList}
	>
		<i class="icon numbered-list" />
		<span class="text">Numbered List</span>
	</DropDownItem>
	<DropDownItem
		class={'item ' + dropDownActiveClass(blockType === 'check')}
		onClick={formatCheckList}
	>
		<i class="icon check-list" />
		<span class="text">Check List</span>
	</DropDownItem>
	<DropDownItem class={'item ' + dropDownActiveClass(blockType === 'quote')} onClick={formatQuote}>
		<i class="icon quote" />
		<span class="text">Quote</span>
	</DropDownItem>
	<DropDownItem class={'item ' + dropDownActiveClass(blockType === 'code')} onClick={formatCode}>
		<i class="icon code" />
		<span class="text">Code Block</span>
	</DropDownItem>
</DropDown>
