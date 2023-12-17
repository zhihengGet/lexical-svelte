import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess({ enableSourcemap: true }),
	kit: {
		alias: {
			shared: path.resolve(__dirname, './src/util/src/'),
			'@lexical/react': path.resolve(__dirname, 'src/lib/'),
			react: path.resolve(__dirname, 'src/react.svelte'),
			'@theme': path.resolve(__dirname, './src/themes/'),
			'@ui': path.resolve(__dirname, './src/playground/ui/'),
			'@nodes': path.resolve(__dirname, './src/playground/nodes/'),
			'@plugins': path.resolve(__dirname, './src/playground/plugins/')
		}
	}
};
