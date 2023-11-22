/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
	$createHeadingNode as createHeadingNode,
	$createQuoteNode as createQuoteNode,
	$isHeadingNode as isHeadingNode,
	$isQuoteNode as isQuoteNode,
	HeadingTagType
} from '@lexical/rich-text';
import {
	$getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
	$isParentElementRTL as isParentElementRTL,
	$patchStyleText as patchStyleText,
	$setBlocksType as setBlocksType
} from '@lexical/selection';
import { $isTableNode as isTableNode } from '@lexical/table';
import {
	$findMatchingParent as findMatchingParent,
	$getNearestBlockElementAncestorOrThrow as getNearestBlockElementAncestorOrThrow,
	$getNearestNodeOfType as getNearestNodeOfType,
	mergeRegister
} from '@lexical/utils';
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
	DEPRECATED_$isGridSelection,
	ElementFormatType,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	KEY_MODIFIER_COMMAND,
	LexicalEditor,
	NodeKey,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
	TextNode,
	LexicalCommand,
	createCommand,
	CommandListenerPriority,
	COMMAND_PRIORITY_LOW,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_ESCAPE_COMMAND,
	KEY_TAB_COMMAND
} from 'lexical';

import { useCallback, useMemo, useState, useRef, useEffect } from '../react.svelte';

import useLayoutEffect from 'shared/useLayoutEffect.svelte';

import { SvelteRender } from '@lexical/react/types';

export type MenuTextMatch = {
	leadOffset: number;
	matchingString: string;
	replaceableString: string;
};

export type MenuResolution = {
	match?: MenuTextMatch;
	getRect: () => DOMRect;
};

export const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';

export class MenuOption {
	key: string;
	ref?: HTMLElement | null;

	constructor(key: string) {
		this.key = key;
		this.ref = null;
		this.setRefElement = this.setRefElement.bind(this);
	}

	setRefElement(element: HTMLElement | null) {
		this.ref = element;
	}
}

export type MenuRenderFn<TOption extends MenuOption> = (
	anchorElementRef: HTMLElement | null,
	itemProps: {
		selectedIndex: number | null;
		selectOptionAndCleanUp: (option: TOption) => void;
		setHighlightedIndex: (index: number) => void;
		options: Array<TOption>;
	},
	matchingString: string | null
) => SvelteRender;

const scrollIntoViewIfNeeded = (target: HTMLElement) => {
	const typeaheadContainerNode = document.getElementById('typeahead-menu');
	if (!typeaheadContainerNode) return;

	const typeaheadRect = typeaheadContainerNode.getBoundingClientRect();

	if (typeaheadRect.top + typeaheadRect.height > window.innerHeight) {
		typeaheadContainerNode.scrollIntoView({
			block: 'center'
		});
	}

	if (typeaheadRect.top < 0) {
		typeaheadContainerNode.scrollIntoView({
			block: 'center'
		});
	}

	target.scrollIntoView({ block: 'nearest' });
};

/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(documentText: string, entryText: string, offset: number): number {
	let triggerOffset = offset;
	for (let i = triggerOffset; i <= entryText.length; i++) {
		if (documentText.substr(-i) === entryText.substr(0, i)) {
			triggerOffset = i;
		}
	}
	return triggerOffset;
}

/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
function splitNodeContainingQuery(match: MenuTextMatch): TextNode | null {
	const selection = getSelection();
	if (!isRangeSelection(selection) || !selection.isCollapsed()) {
		return null;
	}
	const anchor = selection.anchor;
	if (anchor.type !== 'text') {
		return null;
	}
	const anchorNode = anchor.getNode();
	if (!anchorNode.isSimpleText()) {
		return null;
	}
	const selectionOffset = anchor.offset;
	const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
	const characterOffset = match.replaceableString.length;
	const queryOffset = getFullMatchOffset(textContent, match.matchingString, characterOffset);
	const startOffset = selectionOffset - queryOffset;
	if (startOffset < 0) {
		return null;
	}
	let newNode;
	if (startOffset === 0) {
		[newNode] = anchorNode.splitText(selectionOffset);
	} else {
		[, newNode] = anchorNode.splitText(startOffset, selectionOffset);
	}

	return newNode;
}

// Got from https://stackoverflow.com/a/42543908/2013580
export function getScrollParent(
	element: HTMLElement,
	includeHidden: boolean
): HTMLElement | HTMLBodyElement {
	let style = getComputedStyle(element);
	const excludeStaticParent = style.position === 'absolute';
	const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
	if (style.position === 'fixed') {
		return document.body;
	}
	for (let parent: HTMLElement | null = element; (parent = parent.parentElement); ) {
		style = getComputedStyle(parent);
		if (excludeStaticParent && style.position === 'static') {
			continue;
		}
		if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
			return parent;
		}
	}
	return document.body;
}

function isTriggerVisibleInNearestScrollContainer(
	targetElement: HTMLElement,
	containerElement: HTMLElement
): boolean {
	const tRect = targetElement.getBoundingClientRect();
	const cRect = containerElement.getBoundingClientRect();
	return tRect.top > cRect.top && tRect.top < cRect.bottom;
}

// Reposition the menu on scroll, window resize, and element resize.
export function useDynamicPositioning(
	resolution: typeof $state<MenuResolution | null>,
	targetElement: HTMLElement | null,
	onReposition: () => void,
	onVisibilityChange?: (isInView: boolean) => void
) {
	const [editor] = useLexicalComposerContext();
	$effect(() => {
		if (targetElement != null && resolution != null) {
			const rootElement = editor.getRootElement();
			const rootScrollParent =
				rootElement != null ? getScrollParent(rootElement, false) : document.body;
			let ticking = false;
			let previousIsInView = isTriggerVisibleInNearestScrollContainer(
				targetElement,
				rootScrollParent
			);
			const handleScroll = function () {
				if (!ticking) {
					window.requestAnimationFrame(function () {
						onReposition();
						ticking = false;
					});
					ticking = true;
				}
				const isInView = isTriggerVisibleInNearestScrollContainer(targetElement, rootScrollParent);
				if (isInView !== previousIsInView) {
					previousIsInView = isInView;
					if (onVisibilityChange != null) {
						onVisibilityChange(isInView);
					}
				}
			};
			const resizeObserver = new ResizeObserver(onReposition);
			window.addEventListener('resize', onReposition);
			document.addEventListener('scroll', handleScroll, {
				capture: true,
				passive: true
			});
			resizeObserver.observe(targetElement);
			return () => {
				resizeObserver.unobserve(targetElement);
				window.removeEventListener('resize', onReposition);
				document.removeEventListener('scroll', handleScroll, true);
			};
		}
	});
}

export const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND: LexicalCommand<{
	index: number;
	option: MenuOption;
}> = createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');

export function LexicalMenu<TOption extends MenuOption>({
	close,
	editor,
	anchorElementRef,
	resolution,
	options,
	menuRenderFn,
	onSelectOption,
	shouldSplitNodeWithQuery = false,
	commandPriority = COMMAND_PRIORITY_LOW
}: {
	close: () => void;
	editor: LexicalEditor;
	anchorElementRef: React.MutableRefObject<HTMLElement>;
	resolution: MenuResolution;
	options: Array<TOption>;
	shouldSplitNodeWithQuery?: boolean;
	menuRenderFn: MenuRenderFn<TOption>;
	onSelectOption: (
		option: TOption,
		textNodeContainingQuery: TextNode | null,
		closeMenu: () => void,
		matchingString: string
	) => void;
	commandPriority?: CommandListenerPriority;
}): SvelteComponent | null {
	const [selectedIndex, setHighlightedIndex] = useState<null | number>(null);

	const matchingString = resolution.match && resolution.match.matchingString;

	$effect(() => {
		setHighlightedIndex(0);
	});

	const selectOptionAndCleanUp = $derived((selectedEntry: TOption) => {
		editor.update(() => {
			const textNodeContainingQuery =
				resolution.match != null && shouldSplitNodeWithQuery
					? splitNodeContainingQuery(resolution.match)
					: null;

			onSelectOption(
				selectedEntry,
				textNodeContainingQuery,
				close,
				resolution.match ? resolution.match.matchingString : ''
			);
		});
	});

	const updateSelectedIndex = useCallback(
		(index: number) => {
			const rootElem = editor.getRootElement();
			if (rootElem !== null) {
				rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index);
				setHighlightedIndex(index);
			}
		},
		[editor]
	);

	$effect(() => {
		return () => {
			const rootElem = editor.getRootElement();
			if (rootElem !== null) {
				rootElem.removeAttribute('aria-activedescendant');
			}
		};
	});

	useLayoutEffect(() => {
		if (options === null) {
			setHighlightedIndex(null);
		} else if (selectedIndex() === null) {
			updateSelectedIndex(0);
		}
	});

	$effect(() => {
		return mergeRegister(
			editor.registerCommand(
				SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND,
				({ option }) => {
					if (option.ref && option.ref != null) {
						scrollIntoViewIfNeeded(option.ref);
						return true;
					}

					return false;
				},
				commandPriority
			)
		);
	});

	$effect(() => {
		return mergeRegister(
			editor.registerCommand<KeyboardEvent>(
				KEY_ARROW_DOWN_COMMAND,
				(payload) => {
					const event = payload;
					if (options !== null && options.length && selectedIndex() !== null) {
						const newSelectedIndex =
							selectedIndex() !== options.length - 1 ? selectedIndex() + 1 : 0;
						updateSelectedIndex(newSelectedIndex);
						const option = options[newSelectedIndex];
						if (option.ref != null && option.ref) {
							editor.dispatchCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND, {
								index: newSelectedIndex,
								option
							});
						}
						event.preventDefault();
						event.stopImmediatePropagation();
					}
					return true;
				},
				commandPriority
			),
			editor.registerCommand<KeyboardEvent>(
				KEY_ARROW_UP_COMMAND,
				(payload) => {
					const event = payload;
					let ret = selectedIndex();
					if (options !== null && options.length && ret !== null) {
						const newSelectedIndex = ret !== 0 ? ret - 1 : options.length - 1;
						updateSelectedIndex(newSelectedIndex);
						const option = options[newSelectedIndex];
						if (option.ref != null && option.ref) {
							scrollIntoViewIfNeeded(option.ref);
						}
						event.preventDefault();
						event.stopImmediatePropagation();
					}
					return true;
				},
				commandPriority
			),
			editor.registerCommand<KeyboardEvent>(
				KEY_ESCAPE_COMMAND,
				(payload) => {
					const event = payload;
					event.preventDefault();
					event.stopImmediatePropagation();
					close();
					return true;
				},
				commandPriority
			),
			editor.registerCommand<KeyboardEvent>(
				KEY_TAB_COMMAND,
				(payload) => {
					const event = payload;
					let v = selectedIndex();
					if (options === null || v === null || options[v] == null) {
						return false;
					}
					event.preventDefault();
					event.stopImmediatePropagation();
					selectOptionAndCleanUp(options[v]);
					return true;
				},
				commandPriority
			),
			editor.registerCommand(
				KEY_ENTER_COMMAND,
				(event: KeyboardEvent | null) => {
					let v = selectedIndex();
					if (options === null || v === null || options[v] == null) {
						return false;
					}
					if (event !== null) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}
					selectOptionAndCleanUp(options[v]);
					return true;
				},
				commandPriority
			)
		);
	});

	const listItemProps = useMemo(() => ({
		options,
		selectOptionAndCleanUp,
		selectedIndex: selectedIndex(),
		setHighlightedIndex
	}));

	return menuRenderFn(
		anchorElementRef.current,
		listItemProps,
		resolution.match ? resolution.match.matchingString : ''
	);
}

export function useMenuAnchorRef(
	resolution: MenuResolution | null,
	setResolution: (r: MenuResolution | null) => void,
	className?: string
): React.MutableRefObject<HTMLElement> {
	const [editor] = useLexicalComposerContext();
	const anchorElementRef = useRef<HTMLElement>(document.createElement('div'));
	const positionMenu = useCallback(() => {
		anchorElementRef.current.style.top = anchorElementRef.current.style.bottom;
		const rootElement = editor.getRootElement();
		const containerDiv = anchorElementRef.current;

		const menuEle = containerDiv.firstChild as HTMLElement;
		if (rootElement !== null && resolution !== null) {
			const { left, top, width, height } = resolution.getRect();
			const anchorHeight = anchorElementRef.current.offsetHeight; // use to position under anchor
			containerDiv.style.top = `${top + window.pageYOffset + anchorHeight + 3}px`;
			containerDiv.style.left = `${left + window.pageXOffset}px`;
			containerDiv.style.height = `${height}px`;
			containerDiv.style.width = `${width}px`;
			if (menuEle !== null) {
				menuEle.style.top = `${top}`;
				const menuRect = menuEle.getBoundingClientRect();
				const menuHeight = menuRect.height;
				const menuWidth = menuRect.width;

				const rootElementRect = rootElement.getBoundingClientRect();

				if (left + menuWidth > rootElementRect.right) {
					containerDiv.style.left = `${rootElementRect.right - menuWidth + window.pageXOffset}px`;
				}
				if (
					(top + menuHeight > window.innerHeight || top + menuHeight > rootElementRect.bottom) &&
					top - rootElementRect.top > menuHeight
				) {
					containerDiv.style.top = `${top - menuHeight + window.pageYOffset - height}px`;
				}
			}

			if (!containerDiv.isConnected) {
				if (className != null) {
					containerDiv.className = className;
				}
				containerDiv.setAttribute('aria-label', 'Typeahead menu');
				containerDiv.setAttribute('id', 'typeahead-menu');
				containerDiv.setAttribute('role', 'listbox');
				containerDiv.style.display = 'block';
				containerDiv.style.position = 'absolute';
				document.body.append(containerDiv);
			}
			anchorElementRef.current = containerDiv;
			rootElement.setAttribute('aria-controls', 'typeahead-menu');
		}
	}, [editor, resolution, className]);

	useEffect(() => {
		const rootElement = editor.getRootElement();
		if (resolution !== null) {
			positionMenu();
			return () => {
				if (rootElement !== null) {
					rootElement.removeAttribute('aria-controls');
				}

				const containerDiv = anchorElementRef.current;
				if (containerDiv !== null && containerDiv.isConnected) {
					containerDiv.remove();
				}
			};
		}
	}, [editor, positionMenu, resolution]);

	const onVisibilityChange = useCallback(
		(isInView: boolean) => {
			if (resolution !== null) {
				if (!isInView) {
					setResolution(null);
				}
			}
		},
		[resolution, setResolution]
	);

	useDynamicPositioning(resolution, anchorElementRef.current, positionMenu, onVisibilityChange);

	return anchorElementRef;
}

export type TriggerFn = (text: string, editor: LexicalEditor) => MenuTextMatch | null;
