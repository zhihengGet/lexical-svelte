import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	/* 	resolve: {
		alias: {
			shared: path.resolve(__dirname, './src/util/src/'),
			'@lexical/react': path.resolve(__dirname, 'src/lib/'),
			"@shared/":path.resolve(__dirname,"src/shared")
			react: path.resolve(__dirname, 'src/react.svelte'),
			'@theme': path.resolve(__dirname, './src/themes/'),
			'@ui': path.resolve(__dirname, './src/playground/ui/'),
			'@nodes': path.resolve(__dirname, './src/playground/nodes/'),
			'@plugins': path.resolve(__dirname, './src/playground/plugins/')
		}
	}, */
	plugins: [
		tsconfigPaths({ loose: true }),
		UnoCSS(),
		svelte(),
		dts(),
		{
			name: 'prebuild-commands',
			handleHotUpdate: async () => {},
			buildStart: async () => {
				console.log('builds');
			}
		}
	],
	build: {
		/* lib: {
			entry: path.resolve(__dirname, './src/index.ts'),
			//name: 'MyLib',
			formats: ['es'],
			name: 'lib',
			// the proper extensions will be added
			fileName: 'index'
		}, */
		ssr: false,
		reportCompressedSize: true,
		cssMinify: 'esbuild',
		// Reduce bloat from legacy polyfills.
		target: 'esnext',
		// Leave minification up to applications.
		minify: false,
		rollupOptions: {
			plugins: [
				/* nodeResolve() */
			]
		}
	}
});
