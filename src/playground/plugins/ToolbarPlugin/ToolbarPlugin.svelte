<script module lang="ts">
	import {
		$createCodeNode as createCodeNode,
		$isCodeNode as isCodeNode,
		CODE_LANGUAGE_FRIENDLY_NAME_MAP,
		CODE_LANGUAGE_MAP,
		getLanguageFriendlyName
	} from '@lexical/code';
	import { $isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
	import {
		$isListNode as isListNode,
		INSERT_CHECK_LIST_COMMAND,
		INSERT_ORDERED_LIST_COMMAND,
		INSERT_UNORDERED_LIST_COMMAND,
		ListNode,
		REMOVE_LIST_COMMAND
	} from '@lexical/list';
	import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin.svelte';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { $isDecoratorBlockNode as isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
	import { INSERT_HORIZONTAL_RULE_COMMAND } from '../HorizontalPlugin/index';
	import {
		$createHeadingNode as createHeadingNode,
		$createQuoteNode as createQuoteNode,
		$isHeadingNode as isHeadingNode,
		$isQuoteNode as isQuoteNode,
		type HeadingTagType
	} from '@lexical/rich-text';
	import {
		$getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
		$isParentElementRTL as isParentElementRTL,
		$patchStyleText as patchStyleText,
		$setBlocksType as setBlocksType
	} from '@lexical/selection';
	import {
		$isTableNode as isTableNode,
		$isTableSelection as isTableSelection
	} from '@lexical/table';
	import {
		$findMatchingParent as findMatchingParent,
		$getNearestBlockElementAncestorOrThrow as getNearestBlockElementAncestorOrThrow,
		$getNearestNodeOfType as getNearestNodeOfType,
		mergeRegister,
		$isEditorIsNestedEditor as isEditorIsNestedEditor
	} from '@lexical/utils';
	import type { ElementFormatType, NodeKey } from 'lexical';
	import {
		$createParagraphNode as createParagraphNode,
		$getNodeByKey as getNodeByKey,
		$getRoot as getRoot,
		$getSelection as getSelection,
		$isElementNode as isElementNode,
		$isRangeSelection as isRangeSelection,
		$isRootOrShadowRoot as isRootOrShadowRoot,
		$isTextNode as isTextNode,
		CAN_REDO_COMMAND,
		CAN_UNDO_COMMAND,
		COMMAND_PRIORITY_CRITICAL,
		COMMAND_PRIORITY_NORMAL,
		FORMAT_ELEMENT_COMMAND,
		FORMAT_TEXT_COMMAND,
		INDENT_CONTENT_COMMAND,
		KEY_MODIFIER_COMMAND,
		type LexicalEditor,
		OUTDENT_CONTENT_COMMAND,
		REDO_COMMAND,
		SELECTION_CHANGE_COMMAND,
		UNDO_COMMAND,
		CLEAR_EDITOR_COMMAND
	} from 'lexical';

	function dropDownActiveClass(active: boolean) {
		if (active) return 'active dropdown-item-active';
		else return '';
	}
	import { useCallback, useEffect, useState } from 'react';
	import type { rootTypeToRootName } from '.';
	import { CODE_LANGUAGE_OPTIONS, blockTypeToBlockName } from '.';
	import useModal from '../../hooks/useModal.svelte';
	import { getSelectedNode } from '../../utils/getSelectedNode';
	import { sanitizeUrl } from '../../utils/url';
	import type { InsertImagePayload } from '@plugins/ImagesPlugin/InsertImageUriDialogBody.svelte';
	import { INSERT_IMAGE_COMMAND } from '@plugins/ImagesPlugin';
	import { IS_APPLE } from 'shared/environment';
	import Divider from './Divider.svelte';
	import BlockFormatDropdown from './BlockFormatDropdown.svelte';
	import ElementFormatDropdown from './ElementFormatDropdown.svelte';
</script>

<script lang="ts">
	import { DropDown, Portal, DropDownItem, DropdownColorPicker, Modal } from '@ui/index';
	import FontDropDown from './FontDropDown.svelte';
	import { untrack } from 'svelte';
	import InsertEquationDialog from '@plugins/EquationsPlugin/InsertEquationDialog.svelte';
	import { INSERT_COLLAPSIBLE_COMMAND } from '@plugins/CollapsiblePlugin/CollapsiblePlugin.svelte';
	import { $createStickyNode as createStickyNode } from '@plugins/StickyNode/StickyNode';
	//import { INSERT_EXCALIDRAW_COMMAND } from '@plugins/ExcalidrawPlugin';
	import InsertImageDialog from '@plugins/ImagesPlugin/InsertImageDialog.svelte';
	import InsertInlineImageDialog from '@plugins/InlineImagePlugin/InsertInlineImageDialog.svelte';
	import { INSERT_PAGE_BREAK } from '@plugins/PageBreakPlugin/PageBreakPlug.svelte';
	import { useSettings } from '../../appSettings';
	import type { SvelteRender } from '@lexical/react/types';
	import FontSize from './FontSize.svelte';
	import { useToolbarState } from './ToolbarContext.svelte';
	import { clearFormatting } from './utils';

	let {
		editor,
		activeEditor,
		setActiveEditor,
		setIsLinkEditMode
	}: {
		editor: LexicalEditor;
		activeEditor: LexicalEditor;
		setActiveEditor: (LexicalEditor: LexicalEditor) => void;
		setIsLinkEditMode: (a: boolean) => void;
	} = $props();
	const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
	const [modal, showModal, child, setModalChild] = useModal();
	const toolbar = useToolbarState();
	const updateToolbarState = toolbar().updateToolbarState;
	const toolbarState = $derived(toolbar().toolbarState);
	const [isEditable, setIsEditable] = useState(() => editor.isEditable());

	const updateToolbar = useCallback(() => {
		const selection = getSelection();
		if (isRangeSelection(selection)) {
			if (activeEditor !== editor && isEditorIsNestedEditor(activeEditor)) {
				const rootElement = activeEditor.getRootElement();
				updateToolbarState(
					'isImageCaption',
					!!rootElement?.parentElement?.classList.contains('image-caption-container')
				);
			} else {
				updateToolbarState('isImageCaption', false);
			}

			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && isRootOrShadowRoot(parent);
						});

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			updateToolbarState('isRTL', isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			const isLink = isLinkNode(parent) || isLinkNode(node);
			updateToolbarState('isLink', isLink);

			const tableNode = findMatchingParent(node, isTableNode);
			if (isTableNode(tableNode)) {
				updateToolbarState('rootType', 'table');
			} else {
				updateToolbarState('rootType', 'root');
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if (isListNode(element)) {
					const parentList = getNearestNodeOfType<ListNode>(anchorNode, ListNode);
					const type = parentList ? parentList.getListType() : element.getListType();

					updateToolbarState('blockType', type);
				} else {
					const type = isHeadingNode(element) ? element.getTag() : element.getType();
					if (type in blockTypeToBlockName) {
						updateToolbarState('blockType', type as keyof typeof blockTypeToBlockName);
					}
					if (isCodeNode(element)) {
						const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
						updateToolbarState(
							'codeLanguage',
							language ? CODE_LANGUAGE_MAP[language] || language : ''
						);
						return;
					}
				}
			}
			// Handle buttons
			updateToolbarState(
				'fontColor',
				getSelectionStyleValueForProperty(selection, 'color', '#000')
			);
			updateToolbarState(
				'bgColor',
				getSelectionStyleValueForProperty(selection, 'background-color', '#fff')
			);
			updateToolbarState(
				'fontFamily',
				getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
			);
			let matchingParent;
			if (isLinkNode(parent)) {
				// If node is a link, we need to fetch the parent paragraph node to set format
				matchingParent = findMatchingParent(
					node,
					(parentNode) => isElementNode(parentNode) && !parentNode.isInline()
				);
			}

			// If matchingParent is a valid node, pass it's format type
			updateToolbarState(
				'elementFormat',
				isElementNode(matchingParent)
					? matchingParent.getFormatType()
					: isElementNode(node)
						? node.getFormatType()
						: parent?.getFormatType() || 'left'
			);
		}
		if (isRangeSelection(selection) || isTableSelection(selection)) {
			// Update text format
			updateToolbarState('isBold', selection.hasFormat('bold'));
			updateToolbarState('isItalic', selection.hasFormat('italic'));
			updateToolbarState('isUnderline', selection.hasFormat('underline'));
			updateToolbarState('isStrikethrough', selection.hasFormat('strikethrough'));
			updateToolbarState('isSubscript', selection.hasFormat('subscript'));
			updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
			updateToolbarState('isCode', selection.hasFormat('code'));
			updateToolbarState(
				'fontSize',
				getSelectionStyleValueForProperty(selection, 'font-size', '15px')
			);
		}
	}, []);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				setActiveEditor(newEditor);
				updateToolbar();
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor, updateToolbar, setActiveEditor]);

	useEffect(() => {
		activeEditor.getEditorState().read(() => {
			updateToolbar();
		});
	}, [activeEditor, updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener((editable) => {
				setIsEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload) => {
					updateToolbarState('canUndo', payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload) => {
					updateToolbarState('canRedo', payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [updateToolbar, activeEditor, editor, updateToolbarState]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>, skipHistoryStack?: boolean) => {
			activeEditor.update(
				() => {
					const selection = getSelection();
					if (selection !== null) {
						patchStyleText(selection, styles);
					}
				},
				skipHistoryStack ? { tag: 'historic' } : {}
			);
		},
		[activeEditor]
	);

	const onFontColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ color: value }, skipHistoryStack);
		},
		[applyStyleText]
	);

	const onBgColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ 'background-color': value }, skipHistoryStack);
		},
		[applyStyleText]
	);

	const insertLink = useCallback(() => {
		if (!toolbarState.isLink) {
			setIsLinkEditMode(true);
			activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
		} else {
			setIsLinkEditMode(false);
			activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

	const onCodeLanguageSelect = (value: string) => {
		activeEditor.update(() => {
			let isElement = selectedElementKey();
			if (isElement !== null) {
				const node = getNodeByKey(isElement);
				if (isCodeNode(node)) {
					node.setLanguage(value);
				}
			}
		});
	};
	const insertGifOnClick = (payload: InsertImagePayload) => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
	};

	const settings = useSettings();
	let open = $state(false);
	let modalContent = $state<SvelteRender>({});
</script>

<div class="toolbar {settings().toolbarCSS}">
	<button
		class:hidden={settings().isUndoRedo == false}
		disabled={!toolbarState.canUndo || !isEditable()}
		onclick={() => {
			activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
		}}
		title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
		type="button"
		class="toolbar-item spaced"
		aria-label="Undo"
	>
		<i class="format undo"></i>
	</button>
	<button
		disabled={!toolbarState.canRedo || !isEditable()}
		onclick={() => {
			activeEditor.dispatchCommand(REDO_COMMAND, undefined);
		}}
		title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
		type="button"
		class="toolbar-item"
		aria-label="Redo"
	>
		<i class="format redo"></i>
	</button>
	<Divider />
	{#if toolbarState.blockType in blockTypeToBlockName && activeEditor === editor}
		<BlockFormatDropdown
			disabled={!isEditable()}
			blockType={toolbarState.blockType}
			rootType={toolbarState.rootType}
			editor={activeEditor}
		/>
		<Divider />
	{:else}
		<!-- Else block content goes here (if needed) -->
	{/if}
	{#if toolbarState.blockType == 'code'}
		<!-- content here -->
		<DropDown
			disabled={!isEditable()}
			buttonClassName="toolbar-item code-language"
			buttonLabel={getLanguageFriendlyName(toolbarState.codeLanguage)}
			buttonAriaLabel="Select language"
		>
			{#each CODE_LANGUAGE_OPTIONS as [value, name]}
				<!-- content here -->
				<DropDownItem
					class={`item ${dropDownActiveClass(value === toolbarState.codeLanguage)}`}
					onclick={() => onCodeLanguageSelect(value)}
				>
					<span class="text">{name}</span>
				</DropDownItem>
			{/each}
		</DropDown>
	{/if}
	{#if toolbarState.blockType !== 'code'}
		<!-- content here -->
		<FontDropDown
			disabled={!isEditable()}
			style={'font-family'}
			value={toolbarState.fontFamily}
			{editor}
		/>
		<FontSize
			selectionFontSize={toolbarState.fontSize.slice(0, -2)}
			editor={activeEditor}
			disabled={!isEditable()}
		/>
		<Divider />
		<button
			disabled={!isEditable()}
			onclick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
			}}
			class={'toolbar-item spaced ' + (toolbarState.isBold ? 'active' : '')}
			title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
			type="button"
			aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
		>
			<i class="format bold"></i>
		</button>
		<button
			disabled={!isEditable()}
			onclick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
			}}
			class={'toolbar-item spaced ' + (toolbarState.isItalic ? 'active' : '')}
			title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
			type="button"
			aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
		>
			<i class="format italic"></i>
		</button>
		<button
			disabled={!isEditable()}
			onclick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
			}}
			class={'toolbar-item spaced ' + (toolbarState.isUnderline ? 'active' : '')}
			title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
			type="button"
			aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
		>
			<i class="format underline"></i>
		</button>
		<button
			disabled={!isEditable()}
			onclick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
			}}
			class={'toolbar-item spaced ' + (toolbarState.isCode ? 'active' : '')}
			title="Insert code block"
			type="button"
			aria-label="Insert code block"
		>
			<i class="format code"></i>
		</button>
		<button
			disabled={!isEditable()}
			onclick={insertLink}
			class={'toolbar-item spaced ' + (toolbarState.isLink ? 'active' : '')}
			aria-label="Insert link"
			title="Insert link"
			type="button"
		>
			<i class="format link"></i>
		</button>
		<DropdownColorPicker
			disabled={!isEditable()}
			buttonClassName="toolbar-item color-picker"
			buttonAriaLabel="Formatting text color"
			buttonIconClassName="icon font-color"
			color={toolbarState.fontColor}
			onChange={onFontColorSelect}
			title="text color"
		/>
		<DropdownColorPicker
			disabled={!isEditable()}
			buttonClassName="toolbar-item color-picker"
			buttonAriaLabel="Formatting background color"
			buttonIconClassName="icon bg-color"
			color={toolbarState.bgColor}
			onChange={onBgColorSelect}
			title="bg color"
		/>
		<DropDown
			disabled={!isEditable()}
			buttonClassName="toolbar-item spaced"
			buttonLabel=""
			buttonAriaLabel="Formatting options for additional text styles"
			buttonIconClassName="icon dropdown-more"
		>
			<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
				}}
				class={'item ' + dropDownActiveClass(toolbarState.isStrikethrough)}
				title="Strikethrough"
				aria-label="Format text with a strikethrough"
			>
				<i class="icon strikethrough"></i>
				<span class="text">Strikethrough</span>
			</DropDownItem>
			<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
				}}
				class={'item ' + dropDownActiveClass(toolbarState.isSubscript)}
				title="Subscript"
				aria-label="Format text with a subscript"
			>
				<i class="icon subscript"></i>
				<span class="text">Subscript</span>
			</DropDownItem>
			<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
				}}
				class={'item ' + dropDownActiveClass(toolbarState.isSuperscript)}
				title="Superscript"
				aria-label="Format text with a superscript"
			>
				<i class="icon superscript"></i>
				<span class="text">Superscript</span>
			</DropDownItem>
			<DropDownItem
				onclick={() => clearFormatting(activeEditor)}
				class="item"
				title="Clear text formatting"
				aria-label="Clear all text formatting"
			>
				<i class="icon clear"></i>
				<span class="text">Clear Formatting</span>
			</DropDownItem>
		</DropDown>

		<Divider />

		<!-- insert -->
		<DropDown
			disabled={!isEditable()}
			buttonClassName="toolbar-item spaced"
			buttonLabel="Insert "
			buttonAriaLabel="Insert specialized editor node"
			buttonIconClassName="icon plus"
			chevronClass="translate-x-[2px]"
		>
			<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
				}}
				class="item"
			>
				<i class="icon horizontal-rule"></i>
				<span class="text">Horizontal Rule</span>
			</DropDownItem>
			<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
				}}
				class="item"
			>
				<i class="icon page-break"></i>
				<span class="text">Page Break</span>
			</DropDownItem>

			<DropDownItem
				enabled={settings().image}
				onclick={() => {
					/* modalContent = {
						component: InsertImageDialog,
						props: { activeEditor: activeEditor }
					}; */
					/* 	showModal('Insert Image', (onClose) => {
						return [
							{
								component: InsertImageDialog,
								props: {
									activeEditor: activeEditor,
									onClose,
									title: 'Insert Image',
									open: true
								}
							}
						];
					}); */
					setModalChild((onClose) => {
						return {
							component: InsertImageDialog,
							props: { activeEditor: activeEditor, onClose, title: 'Insert Image', open: true }
						};
					});
					open = true;
				}}
				class="item"
			>
				<i class="icon image"></i>
				<span class="text">Image</span>
			</DropDownItem>
			<!-- 	<DropDownItem
				onclick={() => {
					showModal('Insert Image', (onClose) => {
						return [
							{
								component: InsertInlineImageDialog,
								props: { activeEditor: activeEditor, onClose },
								onClose
							}
						];
					});
				}}
				class="item"
			>
				<i class="icon image" />
				<span class="text">Inline Image</span>
			</DropDownItem> -->
			<!-- 	<DropDownItem
				onclick={() =>
					insertGifonclick({
						altText: 'Cat typing on a laptop',
						src: 'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
					})}
				class="item"
			>
				<i class="icon gif" />
				<span class="text">GIF</span>
			</DropDownItem> -->
			<!-- 	<DropDownItem
				onclick={() => {
					activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
				}}
				class="item"
			>
				<i class="icon diagram-2" />
				<span class="text">Excalidraw</span>
			</DropDownItem> -->

			<DropDownItem
				enabled={settings().equation}
				onclick={() => {
					/* 	showModal('Insert Equation', (onClose) => [
						{
							component: InsertEquationDialog,
							props: {
								activeEditor: activeEditor,
								onClose
							}
						}
					]); */
					open = true;
					setModalChild((onClose) => {
						return {
							component: InsertEquationDialog,
							props: {
								activeEditor: activeEditor,
								onClose,
								title: 'Insert Latex code',
								open: true
							}
						};
					});
				}}
				class="item"
			>
				<i class="icon equation"></i>
				<span class="text">Equation</span>
			</DropDownItem>
			<!-- 	<DropDownItem
				onclick={() => {
					editor.update(() => {
						const root = getRoot();
						const stickyNode = createStickyNode(0, 0);
						root.append(stickyNode);
					});
				}}
				class="item"
			>
				<i class="icon sticky" />
				<span class="text">Sticky Note</span>
			</DropDownItem> -->
			<DropDownItem
				onclick={() => {
					editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
				}}
				class="item"
			>
				<i class="icon caret-right"></i>
				<span class="text">Collapsible container</span>
			</DropDownItem>
		</DropDown>
	{/if}
	<!-- {blockType === 'code' ? (
	
	) : (
		<>
			<FontDropDown
				disabled={!isEditable()}
				style={'font-family'}
				value={fontFamily}
				editor={editor}
			/>
			<FontDropDown disabled={!isEditable()} style={'font-size'} value={fontSize} editor={editor} />
			<Divider />
			<button
				disabled={!isEditable()}
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
				}}
				class={'toolbar-item spaced ' + (isBold ? 'active' : '')}
				title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
				type="button"
				aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
			>
				<i class="format bold" />
			</button>
			<button
				disabled={!isEditable()}
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
				}}
				class={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
				title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
				type="button"
				aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
			>
				<i class="format italic" />
			</button>
			<button
				disabled={!isEditable()}
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
				}}
				class={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
				title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
				type="button"
				aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
			>
				<i class="format underline" />
			</button>
			<button
				disabled={!isEditable()}
				onclick={() => {
					activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
				}}
				class={'toolbar-item spaced ' + (isCode ? 'active' : '')}
				title="Insert code block"
				type="button"
				aria-label="Insert code block"
			>
				<i class="format code" />
			</button>
			<button
				disabled={!isEditable()}
				onclick={insertLink}
				class={'toolbar-item spaced ' + (isLink ? 'active' : '')}
				aria-label="Insert link"
				title="Insert link"
				type="button"
			>
				<i class="format link" />
			</button>
			<DropdownColorPicker
				disabled={!isEditable()}
				buttonclass="toolbar-item color-picker"
				buttonAriaLabel="Formatting text color"
				buttonIconclass="icon font-color"
				color={fontColor}
				onChange={onFontColorSelect}
				title="text color"
			/>
			<DropdownColorPicker
				disabled={!isEditable()}
				buttonclass="toolbar-item color-picker"
				buttonAriaLabel="Formatting background color"
				buttonIconclass="icon bg-color"
				color={bgColor}
				onChange={onBgColorSelect}
				title="bg color"
			/>
			<DropDown
				disabled={!isEditable()}
				buttonclass="toolbar-item spaced"
				buttonLabel=""
				buttonAriaLabel="Formatting options for additional text styles"
				buttonIconclass="icon dropdown-more"
			>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
					}}
					class={'item ' + dropDownActiveClass(isStrikethrough)}
					title="Strikethrough"
					aria-label="Format text with a strikethrough"
				>
					<i class="icon strikethrough" />
					<span class="text">Strikethrough</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
					}}
					class={'item ' + dropDownActiveClass(isSubscript)}
					title="Subscript"
					aria-label="Format text with a subscript"
				>
					<i class="icon subscript" />
					<span class="text">Subscript</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
					}}
					class={'item ' + dropDownActiveClass(isSuperscript)}
					title="Superscript"
					aria-label="Format text with a superscript"
				>
					<i class="icon superscript" />
					<span class="text">Superscript</span>
				</DropDownItem>
				<DropDownItem
					onclick={clearFormatting}
					class="item"
					title="Clear text formatting"
					aria-label="Clear all text formatting"
				>
					<i class="icon clear" />
					<span class="text">Clear Formatting</span>
				</DropDownItem>
			</DropDown>
			<Divider />
			{rootType === 'table' && (
				<>
					<DropDown
						disabled={!isEditable()}
						buttonclass="toolbar-item spaced"
						buttonLabel="Table"
						buttonAriaLabel="Open table toolkit"
						buttonIconclass="icon table secondary"
					>
						<DropDownItem
							onclick={() => {
								/**/
							}}
							class="item"
						>
							<span class="text">TODO</span>
						</DropDownItem>
					</DropDown>
					<Divider />
				</>
			)}
			<DropDown
				disabled={!isEditable()}
				buttonclass="toolbar-item spaced"
				buttonLabel="Insert"
				buttonAriaLabel="Insert specialized editor node"
				buttonIconclass="icon plus"
			>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
					}}
					class="item"
				>
					<i class="icon horizontal-rule" />
					<span class="text">Horizontal Rule</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
					}}
					class="item"
				>
					<i class="icon page-break" />
					<span class="text">Page Break</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Image', (onClose) => (
							<InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon image" />
					<span class="text">Image</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Inline Image', (onClose) => (
							<InsertInlineImageDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon image" />
					<span class="text">Inline Image</span>
				</DropDownItem>
				<DropDownItem
					onclick={() =>
						insertGifonclick({
							altText: 'Cat typing on a laptop',
							src: catTypingGif
						})
					}
					class="item"
				>
					<i class="icon gif" />
					<span class="text">GIF</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
					}}
					class="item"
				>
					<i class="icon diagram-2" />
					<span class="text">Excalidraw</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Table', (onClose) => (
							<InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon table" />
					<span class="text">Table</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Table', (onClose) => (
							<InsertNewTableDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon table" />
					<span class="text">Table (Experimental)</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Poll', (onClose) => (
							<InsertPollDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon poll" />
					<span class="text">Poll</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						showModal('Insert Columns Layout', (onClose) => (
							<InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon columns" />
					<span class="text">Columns Layout</span>
				</DropDownItem>

				<DropDownItem
					onclick={() => {
						showModal('Insert Equation', (onClose) => (
							<InsertEquationDialog activeEditor={activeEditor} onClose={onClose} />
						));
					}}
					class="item"
				>
					<i class="icon equation" />
					<span class="text">Equation</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						editor.update(() => {
							const root = $getRoot();
							const stickyNode = $createStickyNode(0, 0);
							root.append(stickyNode);
						});
					}}
					class="item"
				>
					<i class="icon sticky" />
					<span class="text">Sticky Note</span>
				</DropDownItem>
				<DropDownItem
					onclick={() => {
						editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
					}}
					class="item"
				>
					<i class="icon caret-right" />
					<span class="text">Collapsible container</span>
				</DropDownItem>
				{EmbedConfigs.map((embedConfig) => (
					<DropDownItem
						key={embedConfig.type}
						onclick={() => {
							activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
						}}
						class="item"
					>
						{embedConfig.icon}
						<span class="text">{embedConfig.contentName}</span>
					</DropDownItem>
				))}
			</DropDown>
		</>
	)} -->
	<Divider />
	<ElementFormatDropdown
		disabled={!isEditable()}
		value={toolbarState.elementFormat}
		editor={activeEditor}
		isRTL={toolbarState.isRTL}
	/>
	<button
		disabled={!isEditable()}
		onclick={() => {
			activeEditor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
		}}
		title="Insert code block"
		type="button"
		aria-label="Insert code block"
	>
		Clear
	</button>
</div>

<Modal bind:open title="insert image">
	{@const SvelteComponent = child()?.component}
	{#if SvelteComponent}
		<SvelteComponent {...child()?.props} />
	{/if}
</Modal>

<!-- <Modal bind:open title={'insert image'}
	><svelte:component
		this={modalContent.component}
		{...modalContent.props}
		onClose={() => (open = false)}
	/>
</Modal>
 -->
