// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';

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
		presetAttributify({
			/* preset options */
		}),
		presetUno()
		// ...custom presets
	]
});
