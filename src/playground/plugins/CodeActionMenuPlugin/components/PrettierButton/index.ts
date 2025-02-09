import { type LexicalEditor } from 'lexical';
import { type Options } from 'prettier';

export interface Props {
	lang: string;
	editor: LexicalEditor;
	getCodeDOMNode: () => HTMLElement | null;
}

export const PRETTIER_PARSER_MODULES = {
	css: () => import('prettier'),
	html: () => import('prettier'),
	js: () => import('prettier'),
	markdown: () => import('prettier')
} as const;

type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

export async function loadPrettierParserByLang(lang: string) {
	const dynamicImport = PRETTIER_PARSER_MODULES[lang as LanguagesType];
	return await dynamicImport();
}

export async function loadPrettierFormat() {
	const { format } = await import('prettier/standalone');
	return format;
}

export const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
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
export const biomeLang = {
	css: 'css',
	html: 'html',
	js: 'js',
	//markdown: 'md',
	jsx: 'jsx',
	tsx: 'tsx',
	yaml: 'yaml',
	graphql: 'graphql',
	svelte: 'svelte',
	vue: 'vue',
	astro: 'astro',
	jsonc: 'jsonc',
	json: 'json',
	typescript: 'ts'
};
const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

export function canBePrettier(lang: string): boolean {
	return LANG_CAN_BE_PRETTIER.includes(lang);
}
