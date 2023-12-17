import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			shared: path.resolve(__dirname, 'shared/src/'),
			'@lexical/react': path.resolve(__dirname, 'src/lib/'),
			react: path.resolve(__dirname, 'src/react.svelte'),
			'@theme': path.resolve(__dirname, './src/themes/'),
			'@ui': path.resolve(__dirname, './src/playground/ui/'),
			'@nodes': path.resolve(__dirname, './src/playground/nodes/'),
			'@plugins': path.resolve(__dirname, './src/playground/plugins/')
		}
	},
	plugins: [tsconfigPaths({ loose: true }), UnoCSS({}), svelte()],
	build: {
		lib: {
			entry: path.resolve(__dirname, './src/App.svelte'),
			name: 'MyLib',
			// the proper extensions will be added
			fileName: 'index.svelte'
		}
	}
});
