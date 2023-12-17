import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import UnoCSS from 'unocss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths({ loose: true }), UnoCSS({}), sveltekit()]
});
