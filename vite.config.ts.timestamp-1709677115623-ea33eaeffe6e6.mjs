// vite.config.ts
import { defineConfig } from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite@5.0.12_@types+node@20.11.8/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.0.2_svelte@5.0.0-next.66_vite@5.0.12/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import tsconfigPaths from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_typescript@5.3.3_vite@5.0.12/node_modules/vite-tsconfig-paths/dist/index.mjs";
import UnoCSS from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/unocss@0.58.4_postcss@8.4.35_vite@5.0.12/node_modules/unocss/dist/vite.mjs";
import dts from "file:///C:/Users/nicej/Documents/git_proj/lexical-svelte/node_modules/.pnpm/vite-plugin-dts@3.7.2_@types+node@20.11.8_typescript@5.3.3_vite@5.0.12/node_modules/vite-plugin-dts/dist/index.mjs";
import { exec } from "child_process";
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
  plugins: [
    tsconfigPaths({ loose: true }),
    UnoCSS({}),
    svelte(),
    dts(),
    {
      name: "prebuild-commands",
      handleHotUpdate: async () => {
        exec("pnpm package");
      },
      buildStart: async () => {
        console.log("builds");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuaWNlalxcXFxEb2N1bWVudHNcXFxcZ2l0X3Byb2pcXFxcbGV4aWNhbC1zdmVsdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5pY2VqXFxcXERvY3VtZW50c1xcXFxnaXRfcHJvalxcXFxsZXhpY2FsLXN2ZWx0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbmljZWovRG9jdW1lbnRzL2dpdF9wcm9qL2xleGljYWwtc3ZlbHRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5cclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0YmFzZTogJy4vJyxcclxuXHQvKiBcdHJlc29sdmU6IHtcclxuXHRcdGFsaWFzOiB7XHJcblx0XHRcdHNoYXJlZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWwvc3JjLycpLFxyXG5cdFx0XHQnQGxleGljYWwvcmVhY3QnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2xpYi8nKSxcclxuXHRcdFx0XCJAc2hhcmVkL1wiOnBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsXCJzcmMvc2hhcmVkXCIpXHJcblx0XHRcdHJlYWN0OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3JlYWN0LnN2ZWx0ZScpLFxyXG5cdFx0XHQnQHRoZW1lJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3RoZW1lcy8nKSxcclxuXHRcdFx0J0B1aSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wbGF5Z3JvdW5kL3VpLycpLFxyXG5cdFx0XHQnQG5vZGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BsYXlncm91bmQvbm9kZXMvJyksXHJcblx0XHRcdCdAcGx1Z2lucyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wbGF5Z3JvdW5kL3BsdWdpbnMvJylcclxuXHRcdH1cclxuXHR9LCAqL1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHRzY29uZmlnUGF0aHMoeyBsb29zZTogdHJ1ZSB9KSxcclxuXHRcdFVub0NTUyh7fSksXHJcblx0XHRzdmVsdGUoKSxcclxuXHRcdGR0cygpLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOiAncHJlYnVpbGQtY29tbWFuZHMnLFxyXG5cdFx0XHRoYW5kbGVIb3RVcGRhdGU6IGFzeW5jICgpID0+IHtcclxuXHRcdFx0XHRleGVjKCdwbnBtIHBhY2thZ2UnKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YnVpbGRTdGFydDogYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdidWlsZHMnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdF0sXHJcblx0YnVpbGQ6IHtcclxuXHRcdC8qIGxpYjoge1xyXG5cdFx0XHRlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2luZGV4LnRzJyksXHJcblx0XHRcdC8vbmFtZTogJ015TGliJyxcclxuXHRcdFx0Zm9ybWF0czogWydlcyddLFxyXG5cdFx0XHRuYW1lOiAnbGliJyxcclxuXHRcdFx0Ly8gdGhlIHByb3BlciBleHRlbnNpb25zIHdpbGwgYmUgYWRkZWRcclxuXHRcdFx0ZmlsZU5hbWU6ICdpbmRleCdcclxuXHRcdH0sICovXHJcblx0XHRzc3I6IGZhbHNlLFxyXG5cdFx0cmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXHJcblx0XHRjc3NNaW5pZnk6ICdlc2J1aWxkJyxcclxuXHRcdC8vIFJlZHVjZSBibG9hdCBmcm9tIGxlZ2FjeSBwb2x5ZmlsbHMuXHJcblx0XHR0YXJnZXQ6ICdlc25leHQnLFxyXG5cdFx0Ly8gTGVhdmUgbWluaWZpY2F0aW9uIHVwIHRvIGFwcGxpY2F0aW9ucy5cclxuXHRcdG1pbmlmeTogZmFsc2UsXHJcblx0XHRyb2xsdXBPcHRpb25zOiB7fVxyXG5cdH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFUsU0FBUyxvQkFBb0I7QUFDM1csU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBRTFCLE9BQU8sWUFBWTtBQUVuQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxZQUFZO0FBRXJCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWFOLFNBQVM7QUFBQSxJQUNSLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUFBLElBQzdCLE9BQU8sQ0FBQyxDQUFDO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSjtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04saUJBQWlCLFlBQVk7QUFDNUIsYUFBSyxjQUFjO0FBQUEsTUFDcEI7QUFBQSxNQUNBLFlBQVksWUFBWTtBQUN2QixnQkFBUSxJQUFJLFFBQVE7QUFBQSxNQUNyQjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU04sS0FBSztBQUFBLElBQ0wsc0JBQXNCO0FBQUEsSUFDdEIsV0FBVztBQUFBO0FBQUEsSUFFWCxRQUFRO0FBQUE7QUFBQSxJQUVSLFFBQVE7QUFBQSxJQUNSLGVBQWUsQ0FBQztBQUFBLEVBQ2pCO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
