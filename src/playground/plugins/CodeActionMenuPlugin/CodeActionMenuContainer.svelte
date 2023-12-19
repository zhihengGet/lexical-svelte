<script lang="ts" context="module">
	import {
		$isCodeNode as isCodeNode,
		CodeNode,
		getLanguageFriendlyName,
		normalizeCodeLang
	} from '@lexical/code';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode } from 'lexical';
	import { useEffect, useRef, useState } from 'react';
	import * as React from 'react';
	import { CopyButton } from '.';
	import { PrettierButton } from '.';
	import { useDebounce } from './utils';
	import { canBePrettier } from './components/PrettierButton';
	import { styleString } from '../../utils/css';
	const CODE_PADDING = 8;

	interface Position {
		top: string;
		right: string;
	}

	function getMouseInfo(event: MouseEvent): {
		codeDOMNode: HTMLElement | null;
		isOutside: boolean;
	} {
		const target = event.target;

		if (target && target instanceof HTMLElement) {
			const codeDOMNode = target.closest<HTMLElement>('code.PlaygroundEditorTheme__code');
			const isOutside = !(
				codeDOMNode || target.closest<HTMLElement>('div.code-action-menu-container')
			);

			return { codeDOMNode, isOutside };
		} else {
			return { codeDOMNode: null, isOutside: true };
		}
	}
	import './index.css';
</script>

<script lang="ts">
	type Props = { anchorElem: HTMLElement };
	let { anchorElem } = $props<Props>();

	const [editor] = useLexicalComposerContext();

	const [lang, setLang] = useState('');
	const [isShown, setShown] = useState<boolean>(false);
	const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({
		right: '0',
		top: '0'
	});
	const codeSetRef = useRef<Set<string>>(new Set());
	const codeDOMNodeRef = useRef<HTMLElement | null>(null);

	function getCodeDOMNode(): HTMLElement | null {
		return codeDOMNodeRef.current;
	}

	const debouncedOnMouseMove = useDebounce(
		(event: MouseEvent) => {
			const { codeDOMNode, isOutside } = getMouseInfo(event);

			if (isOutside) {
				setShown(false);
				return;
			}

			if (!codeDOMNode) {
				return;
			}
			console.log('code node', codeDOMNode, anchorElem);
			codeDOMNodeRef.current = codeDOMNode;

			let codeNode: CodeNode | null = null;
			let _lang = '';

			editor.update(() => {
				const maybeCodeNode = getNearestNodeFromDOMNode(codeDOMNode);

				if (isCodeNode(maybeCodeNode)) {
					codeNode = maybeCodeNode;
					_lang = codeNode.getLanguage() || '';
				}
			});

			if (codeNode) {
				const { y: editorElemY, right: editorElemRight } = anchorElem.getBoundingClientRect();
				const { y, right } = codeDOMNode.getBoundingClientRect();
				setLang(_lang);
				setShown(true);
				setPosition({
					right: `${editorElemRight - right + CODE_PADDING}px`,
					top: `${y - editorElemY}px`
				});
			}
		},
		50,
		1000
	);

	useEffect(() => {
		if (!shouldListenMouseMove) {
			return;
		}

		document.addEventListener('mousemove', debouncedOnMouseMove);
		return () => {
			setShown(false);
			debouncedOnMouseMove.cancel();
			document.removeEventListener('mousemove', debouncedOnMouseMove);
		};
	}, [shouldListenMouseMove, debouncedOnMouseMove]);

	editor.registerMutationListener(CodeNode, (mutations) => {
		editor.getEditorState().read(() => {
			if (codeSetRef.current)
				for (const [key, type] of mutations) {
					switch (type) {
						case 'created':
							codeSetRef.current.add(key);
							setShouldListenMouseMove(codeSetRef.current.size > 0);
							break;

						case 'destroyed':
							codeSetRef.current.delete(key);
							setShouldListenMouseMove(codeSetRef.current.size > 0);
							break;

						default:
							break;
					}
				}
		});
	});
	const normalizedLang = $derived(normalizeCodeLang(lang()));
	const codeFriendlyName = $derived(getLanguageFriendlyName(lang()));

	let style = $derived(styleString(position()));
</script>

{#if isShown()}
	<div class="code-action-menu-container z-1" {style}>
		<div class="code-highlight-language">{codeFriendlyName}</div>
		<CopyButton {editor} {getCodeDOMNode} />
		{#if canBePrettier(normalizedLang)}
			<PrettierButton {editor} {getCodeDOMNode} lang={normalizedLang} />
		{/if}
	</div>
{/if}
