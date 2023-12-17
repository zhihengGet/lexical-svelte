// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';
import {} from 'unocss';
export default defineConfig({
	cli: {
		entry: { patterns: ['src/**/*.svelte'], outFile: 'dist/virtual:uno.css' } // CliEntryItem | CliEntryItem[]
	},
	presets: [
		presetAttributify({
			/* preset options */
		}),
		presetUno()
		// ...custom presets
	]
});
