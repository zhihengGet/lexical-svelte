// vite.config.ts
import { defineConfig } from "file:///C:/git_proj/lexical-svelte/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///C:/git_proj/lexical-svelte/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.0.1_svelte@5.0.0-next.25_vite@5.0.10/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import tsconfigPaths from "file:///C:/git_proj/lexical-svelte/node_modules/.pnpm/vite-tsconfig-paths@4.2.2_typescript@5.3.3_vite@5.0.10/node_modules/vite-tsconfig-paths/dist/index.mjs";
import path from "path";
import UnoCSS from "file:///C:/git_proj/lexical-svelte/node_modules/.pnpm/unocss@0.58.0_postcss@8.4.32_vite@5.0.10/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "C:\\git_proj\\lexical-svelte";
var vite_config_default = defineConfig({
  base: "./",
  resolve: {
    alias: {
      shared: path.resolve(__vite_injected_original_dirname, "./src/util/src/"),
      "@lexical/react": path.resolve(__vite_injected_original_dirname, "src/lib/"),
      react: path.resolve(__vite_injected_original_dirname, "src/react.svelte"),
      "@theme": path.resolve(__vite_injected_original_dirname, "./src/themes/"),
      "@ui": path.resolve(__vite_injected_original_dirname, "./src/playground/ui/"),
      "@nodes": path.resolve(__vite_injected_original_dirname, "./src/playground/nodes/"),
      "@plugins": path.resolve(__vite_injected_original_dirname, "./src/playground/plugins/")
    }
  },
  plugins: [tsconfigPaths({ loose: true }), UnoCSS({}), svelte()],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "./src/App.svelte"),
      name: "MyLib",
      formats: ["es"],
      // the proper extensions will be added
      fileName: "index.svelte"
    },
    rollupOptions: {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxnaXRfcHJvalxcXFxsZXhpY2FsLXN2ZWx0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZ2l0X3Byb2pcXFxcbGV4aWNhbC1zdmVsdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2dpdF9wcm9qL2xleGljYWwtc3ZlbHRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRiYXNlOiAnLi8nLFxyXG5cdHJlc29sdmU6IHtcclxuXHRcdGFsaWFzOiB7XHJcblx0XHRcdHNoYXJlZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWwvc3JjLycpLFxyXG5cdFx0XHQnQGxleGljYWwvcmVhY3QnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2xpYi8nKSxcclxuXHRcdFx0cmVhY3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcmVhY3Quc3ZlbHRlJyksXHJcblx0XHRcdCdAdGhlbWUnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdGhlbWVzLycpLFxyXG5cdFx0XHQnQHVpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BsYXlncm91bmQvdWkvJyksXHJcblx0XHRcdCdAbm9kZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGxheWdyb3VuZC9ub2Rlcy8nKSxcclxuXHRcdFx0J0BwbHVnaW5zJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BsYXlncm91bmQvcGx1Z2lucy8nKVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cGx1Z2luczogW3RzY29uZmlnUGF0aHMoeyBsb29zZTogdHJ1ZSB9KSwgVW5vQ1NTKHt9KSwgc3ZlbHRlKCldLFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRsaWI6IHtcclxuXHRcdFx0ZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9BcHAuc3ZlbHRlJyksXHJcblx0XHRcdG5hbWU6ICdNeUxpYicsXHJcblx0XHRcdGZvcm1hdHM6IFsnZXMnXSxcclxuXHRcdFx0Ly8gdGhlIHByb3BlciBleHRlbnNpb25zIHdpbGwgYmUgYWRkZWRcclxuXHRcdFx0ZmlsZU5hbWU6ICdpbmRleC5zdmVsdGUnXHJcblx0XHR9LFxyXG5cdFx0cm9sbHVwT3B0aW9uczoge31cclxuXHR9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsb0JBQW9CO0FBQ25TLFNBQVMsY0FBYztBQUN2QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBSm5CLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLFFBQVEsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLE1BQ2pELGtCQUFrQixLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLE1BQ3BELE9BQU8sS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ2pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxNQUNqRCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxNQUNyRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxNQUMzRCxZQUFZLEtBQUssUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxJQUNoRTtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVMsQ0FBQyxjQUFjLEVBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQzlELE9BQU87QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNKLE9BQU8sS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ2pELE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUE7QUFBQSxNQUVkLFVBQVU7QUFBQSxJQUNYO0FBQUEsSUFDQSxlQUFlLENBQUM7QUFBQSxFQUNqQjtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
