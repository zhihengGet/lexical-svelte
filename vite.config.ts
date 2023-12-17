import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [UnoCSS(), sveltekit()],

	build: {
		lib: {
			entry: 'src/App.svelte',
			name: 'MyLib',
			// the proper extensions will be added
			fileName: 'index.svelte'
		}
	}
});
