// uno.config.ts
import { defineConfig, presetUno } from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
	cli: {
		entry: [
			{ patterns: ['src/**/*.svelte'], outFile: 'dist/uno.css' },
			{ patterns: ['src/**/*.svelte'], outFile: './uno.css' },
			{ patterns: ['src/**/*.svelte'], outFile: './src/uno.css' }
		] // CliEntryItem | CliEntryItem[]
	},

	extractors: [extractorSvelte()],
	presets: [
		presetUno(),
		presetAnimations(),
		presetShadcn({
			color: 'red'
			// With default setting for SolidUI, you need to set the darkSelector option.
			//	darkSelector: '[data-kb-theme="dark"]'
		})
		// ...custom presets
	]
});
