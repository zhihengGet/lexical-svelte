import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import UnoCSS from 'unocss/vite';

import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			shared: path.resolve(__dirname, './src/util/src/'),
			'@lexical/react': path.resolve(__dirname, 'src/lib/'),
			react: path.resolve(__dirname, 'src/react.svelte'),
			'@theme': path.resolve(__dirname, './src/themes/'),
			'@ui': path.resolve(__dirname, './src/playground/ui/'),
			'@nodes': path.resolve(__dirname, './src/playground/nodes/'),
			'@plugins': path.resolve(__dirname, './src/playground/plugins/')
		}
	},
	plugins: [tsconfigPaths({ loose: true }), UnoCSS({}), svelte(), dts()],
	build: {
		lib: {
			entry: path.resolve(__dirname, './src/index.ts'),
			name: 'MyLib',
			formats: ['es'],
			// the proper extensions will be added
			fileName: 'index'
		},
		// Reduce bloat from legacy polyfills.
		target: 'es2020',
		// Leave minification up to applications.
		minify: false,
		rollupOptions: {}
	}
});
