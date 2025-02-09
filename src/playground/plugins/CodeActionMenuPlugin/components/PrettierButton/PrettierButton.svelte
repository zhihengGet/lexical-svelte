<script module lang="ts">
	import { $isCodeNode as isCodeNode, normalizeCodeLang } from '@lexical/code';
	import {
		$getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
		type LexicalEditor
	} from 'lexical';
	import type { Options } from 'prettier';
	import { useState } from 'react';
	import { biomeLang } from '.';
	import type { Biome } from '@biomejs/js-api';

	interface Props {
		lang: string;
		editor: LexicalEditor;
		getCodeDOMNode: () => HTMLElement | null;
		mode?: 'prettier' | 'biome';
	}
	const PRETTIER_PARSER_MODULES = {
		css: [() => import('prettier/parser-postcss')],
		html: [() => import('prettier/parser-html')],
		js: [() => import('prettier/parser-babel'), () => import('prettier/plugins/estree')],
		markdown: [() => import('prettier/parser-markdown')]
		//WARN VITE THROUGH ERROR DURING BUILD
		/* 	typescript: [ 
			() => import('prettier/parser-typescript'),
			() => import('prettier/plugins/estree')
		] */
	} as const;

	type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

	async function loadPrettierParserByLang(lang: string) {
		const dynamicImports = PRETTIER_PARSER_MODULES[lang as LanguagesType];
		const modules = await Promise.all(dynamicImports.map((dynamicImport) => dynamicImport()));
		return modules;
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
	export function canBeBiome(lang: string): boolean {
		return lang in biomeLang;
	}
	function getPrettierOptions(lang: string): Options {
		const options = PRETTIER_OPTIONS_BY_LANG[lang];
		if (!options) {
			throw new Error(`CodeActionMenuPlugin: Prettier does not support this language: ${lang}`);
		}

		return options;
	}
	// biomejs
	async function initializeBiome(): Promise<Biome> {
		const { Biome, Distribution } = await import('@biomejs/js-api'); // or "bundler"
		const biome = await Biome.create({
			distribution: Distribution.BUNDLER // or Distribution.BUNDLER
		});
		return biome;
	}
</script>

<script lang="ts">
	let { lang, editor, getCodeDOMNode, mode = 'prettier' }: Props = $props();
	const [syntaxError, setSyntaxError] = useState<string>('');
	const [tipsVisible, setTipsVisible] = useState<boolean>(false);

	async function handleClick(): Promise<void> {
		const codeDOMNode = getCodeDOMNode();
		if (!codeDOMNode) {
			return;
		}

		let content = '';
		editor.update(() => {
			const codeNode = getNearestNodeFromDOMNode(codeDOMNode);
			if (isCodeNode(codeNode)) {
				content = codeNode.getTextContent();
			}
		});
		if (content === '') {
			return;
		}

		try {
			let formattedCode = '';
			if (mode === 'prettier') {
				const format = await loadPrettierFormat();
				const options = getPrettierOptions(lang);
				const prettierParsers = await loadPrettierParserByLang(lang);
				options.plugins = prettierParsers.map((parser) => parser.default || parser);
				formattedCode = await format(content, options);
			} else {
				let biome = await initializeBiome();
				//@ts-expect-error
				let ext = biomeLang[lang] ?? 'txt';
				console.log('biome', ext);
				formattedCode = biome.formatContent(content, {
					filePath: 'test.' + ext
				}).content;
			}
			editor.update(() => {
				const codeNode = getNearestNodeFromDOMNode(codeDOMNode);
				if (isCodeNode(codeNode)) {
					const selection = codeNode.select(0);
					selection.insertText(formattedCode);
					setSyntaxError('');
					setTipsVisible(false);
				}
			});
		} catch (error: unknown) {
			console.error(error);
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
		onclick={handleClick}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		aria-label="prettier"
	>
		{#if syntaxError()}
			<i class="format prettier-error"></i>
		{:else}<i class="format prettier"></i>
		{/if}
	</button>
	{#if tipsVisible()}
		<pre class="text-red bg-gray">{syntaxError()}</pre>
	{/if}
</div>
