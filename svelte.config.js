import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess({ script: true }),
	kit: {
		alias: {
			$lib: './src/lib',
			shared: './src/util/src',
			'@shared': './src/shared',
			'@lexical/react': './src/lib',
			react: './src/react.svelte',
			'@theme': './src/themes',
			'@ui': './src/playground/ui',
			'@nodes': './src/playground/nodes',
			'@plugins': './src/playground/plugins'
		}
	}
};
