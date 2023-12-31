import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const package_path = {
	'@nodes/': 'src/playground/nodes/',
	'@plugins/': 'src/playground/plugins/',
	'shared/': 'src/utils/',
	'@shared/': 'src/shared/',
	'@lexical/react/': 'src/lib/',
	'@theme/': 'src/themes/',
	'@ui/': 'src/playground/ui/',
	react: 'src/react.svelte'
};
export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: package_path || {
			'@nodes/*': 'src/playground/nodes/*',
			'@plugins/*': 'src/playground/plugins/*',
			'shared/*': 'src/utils/*',
			'@shared/*': 'src/shared/*',
			'@lexical/react/*': 'src/lib/*',
			'@theme/*': 'src/themes/*',
			'@ui/*': 'src/playground/ui/*',
			react: 'src/react.svelte'
		},
		typescript: {
			config: (config) => {
				return {
					compilerOptions: {
						...config.compilerOptions,
						baseUrl: '.',
						paths: {
							...config.compilerOptions.paths
						}
					},
					include: [...config.include, '**/*.test.ts']
				};
			}
		}
	}
};
