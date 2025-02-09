import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import UnoCSS from 'unocss/vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

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
		wasm(),
		topLevelAwait(),
		tsconfigPaths({ loose: true }),
		UnoCSS(),
		svelte(),
		{
			name: 'prebuild-commands',
			handleHotUpdate: async () => {},
			buildStart: async () => {
				console.log('builds');
			}
		}
	],
	optimizeDeps: {
		exclude: ['@biomejs/wasm-bundler'] // Exclude Wasm from optimization
	},
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
		//cssMinify: 'esbuild',
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
