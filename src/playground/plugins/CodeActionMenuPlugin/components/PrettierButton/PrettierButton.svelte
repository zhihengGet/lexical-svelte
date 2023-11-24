<script context="module" lang="ts">
	import { $isCodeNode as isCodeNode } from '@lexical/code';
	import {
		$getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
		type LexicalEditor
	} from 'lexical';
	import type { Options } from 'prettier';
	import { useState } from 'react';

	interface Props {
		lang: string;
		editor: LexicalEditor;
		getCodeDOMNode: () => HTMLElement | null;
	}

	const PRETTIER_PARSER_MODULES = {
		css: () => import('prettier/parser-postcss'),
		html: () => import('prettier/parser-html'),
		js: () => import('prettier/parser-babel'),
		markdown: () => import('prettier/parser-markdown')
	} as const;

	type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

	async function loadPrettierParserByLang(lang: string) {
		const dynamicImport = PRETTIER_PARSER_MODULES[lang as LanguagesType];
		return await dynamicImport();
	}

	async function loadPrettierFormat() {
		const { format } = await import('prettier/standalone');
		return format;
	}

	const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
		css: {
			parser: 'css'
		},
		html: {
			parser: 'html'
		},
		js: {
			parser: 'babel'
		},
		markdown: {
			parser: 'markdown'
		}
	};

	const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

	export function canBePrettier(lang: string): boolean {
		return LANG_CAN_BE_PRETTIER.includes(lang);
	}

	function getPrettierOptions(lang: string): Options {
		const options = PRETTIER_OPTIONS_BY_LANG[lang];
		if (!options) {
			throw new Error(`CodeActionMenuPlugin: Prettier does not support this language: ${lang}`);
		}

		return options;
	}
</script>

<script lang="ts">
	let { lang, editor, getCodeDOMNode } = $props<Props>();
	const [syntaxError, setSyntaxError] = useState<string>('');
	const [tipsVisible, setTipsVisible] = useState<boolean>(false);

	async function handleClick(): Promise<void> {
		const codeDOMNode = getCodeDOMNode();

		try {
			const format = await loadPrettierFormat();
			const options = getPrettierOptions(lang);
			options.plugins = [await loadPrettierParserByLang(lang)];

			if (!codeDOMNode) {
				return;
			}

			editor.update(async () => {
				const codeNode = getNearestNodeFromDOMNode(codeDOMNode);

				if (isCodeNode(codeNode)) {
					const content = codeNode.getTextContent();

					let parsed = '';

					try {
						parsed = await format(content, options);
					} catch (error: unknown) {
						setError(error);
					}

					if (parsed !== '') {
						const selection = codeNode.select(0);
						selection.insertText(parsed);
						setSyntaxError('');
						setTipsVisible(false);
					}
				}
			});
		} catch (error: unknown) {
			setError(error);
		}
	}

	function setError(error: unknown) {
		if (error instanceof Error) {
			setSyntaxError(error.message);
			setTipsVisible(true);
		} else {
			console.error('Unexpected error: ', error);
		}
	}

	function handleMouseEnter() {
		if (syntaxError() !== '') {
			setTipsVisible(true);
		}
	}

	function handleMouseLeave() {
		if (syntaxError() !== '') {
			setTipsVisible(false);
		}
	}
</script>

<div class="prettier-wrapper">
	<button
		class="menu-item"
		onClick={handleClick}
		onMouseEnter={handleMouseEnter}
		onMouseLeave={handleMouseLeave}
		aria-label="prettier"
	>
		{#if syntaxError()}
			<i class="format prettier-error" />
		{:else}<i class="format prettier" />
		{/if}
	</button>
	{#if tipsVisible()}
		<pre class="code-error-tips">{syntaxError}</pre>
	{/if}
</div>
