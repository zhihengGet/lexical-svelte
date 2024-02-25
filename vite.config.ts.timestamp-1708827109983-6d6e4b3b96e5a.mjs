// vite.config.ts
import { defineConfig } from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite@5.0.12_@types+node@20.11.8/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.0.2_svelte@5.0.0-next.66_vite@5.0.12/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import tsconfigPaths from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_typescript@5.3.3_vite@5.0.12/node_modules/vite-tsconfig-paths/dist/index.mjs";
import UnoCSS from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/unocss@0.58.4_postcss@8.4.35_vite@5.0.12/node_modules/unocss/dist/vite.mjs";
import dts from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite-plugin-dts@3.7.2_@types+node@20.11.8_typescript@5.3.3_vite@5.0.12/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "./",
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
  plugins: [tsconfigPaths({ loose: true }), UnoCSS({}), svelte(), dts()],
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
    cssMinify: "esbuild",
    // Reduce bloat from legacy polyfills.
    target: "esnext",
    // Leave minification up to applications.
    minify: false,
    rollupOptions: {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuaWNlalxcXFxEb2N1bWVudHNcXFxcZ2l0X3Byb2pcXFxcbGV4aWNhbC1zdmVsdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5pY2VqXFxcXERvY3VtZW50c1xcXFxnaXRfcHJvalxcXFxsZXhpY2FsLXN2ZWx0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbmljZWovRG9jdW1lbnRzL2dpdF9wcm9qL2xleGljYWwtc3ZlbHRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5cclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdGJhc2U6ICcuLycsXHJcblx0LyogXHRyZXNvbHZlOiB7XHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHRzaGFyZWQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlsL3NyYy8nKSxcclxuXHRcdFx0J0BsZXhpY2FsL3JlYWN0JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9saWIvJyksXHJcblx0XHRcdFwiQHNoYXJlZC9cIjpwYXRoLnJlc29sdmUoX19kaXJuYW1lLFwic3JjL3NoYXJlZFwiKVxyXG5cdFx0XHRyZWFjdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9yZWFjdC5zdmVsdGUnKSxcclxuXHRcdFx0J0B0aGVtZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy90aGVtZXMvJyksXHJcblx0XHRcdCdAdWknOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGxheWdyb3VuZC91aS8nKSxcclxuXHRcdFx0J0Bub2Rlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wbGF5Z3JvdW5kL25vZGVzLycpLFxyXG5cdFx0XHQnQHBsdWdpbnMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGxheWdyb3VuZC9wbHVnaW5zLycpXHJcblx0XHR9XHJcblx0fSwgKi9cclxuXHRwbHVnaW5zOiBbdHNjb25maWdQYXRocyh7IGxvb3NlOiB0cnVlIH0pLCBVbm9DU1Moe30pLCBzdmVsdGUoKSwgZHRzKCldLFxyXG5cdGJ1aWxkOiB7XHJcblx0XHQvKiBsaWI6IHtcclxuXHRcdFx0ZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9pbmRleC50cycpLFxyXG5cdFx0XHQvL25hbWU6ICdNeUxpYicsXHJcblx0XHRcdGZvcm1hdHM6IFsnZXMnXSxcclxuXHRcdFx0bmFtZTogJ2xpYicsXHJcblx0XHRcdC8vIHRoZSBwcm9wZXIgZXh0ZW5zaW9ucyB3aWxsIGJlIGFkZGVkXHJcblx0XHRcdGZpbGVOYW1lOiAnaW5kZXgnXHJcblx0XHR9LCAqL1xyXG5cdFx0c3NyOiBmYWxzZSxcclxuXHRcdHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlLFxyXG5cdFx0Y3NzTWluaWZ5OiAnZXNidWlsZCcsXHJcblx0XHQvLyBSZWR1Y2UgYmxvYXQgZnJvbSBsZWdhY3kgcG9seWZpbGxzLlxyXG5cdFx0dGFyZ2V0OiAnZXNuZXh0JyxcclxuXHRcdC8vIExlYXZlIG1pbmlmaWNhdGlvbiB1cCB0byBhcHBsaWNhdGlvbnMuXHJcblx0XHRtaW5pZnk6IGZhbHNlLFxyXG5cdFx0cm9sbHVwT3B0aW9uczoge31cclxuXHR9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThVLFNBQVMsb0JBQW9CO0FBQzNXLFNBQVMsY0FBYztBQUN2QixPQUFPLG1CQUFtQjtBQUUxQixPQUFPLFlBQVk7QUFFbkIsT0FBTyxTQUFTO0FBRWhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWFOLFNBQVMsQ0FBQyxjQUFjLEVBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFBQSxFQUNyRSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU04sS0FBSztBQUFBLElBQ0wsc0JBQXNCO0FBQUEsSUFDdEIsV0FBVztBQUFBO0FBQUEsSUFFWCxRQUFRO0FBQUE7QUFBQSxJQUVSLFFBQVE7QUFBQSxJQUNSLGVBQWUsQ0FBQztBQUFBLEVBQ2pCO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
