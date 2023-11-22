// vite.config.ts
import { defineConfig } from "file:///E:/git_projects/lexical-svelte/node_modules/.pnpm/vite@5.0.2_@types+node@20.9.3/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///E:/git_projects/lexical-svelte/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.0.1_svelte@5.0.0-next.9_vite@5.0.2/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import tsconfigPaths from "file:///E:/git_projects/lexical-svelte/node_modules/.pnpm/vite-tsconfig-paths@4.2.1_typescript@5.3.2_vite@5.0.2/node_modules/vite-tsconfig-paths/dist/index.mjs";
import path from "path";
import UnoCSS from "file:///E:/git_projects/lexical-svelte/node_modules/.pnpm/unocss@0.57.7_postcss@8.4.31_vite@5.0.2/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "E:\\git_projects\\lexical-svelte";
var vite_config_default = defineConfig({
  base: "./",
  resolve: {
    alias: {
      shared: path.resolve(__vite_injected_original_dirname, "shared/src/"),
      "@lexical/react": path.resolve(__vite_injected_original_dirname, "src/lib/"),
      react: path.resolve(__vite_injected_original_dirname, "src/react.svelte")
    }
  },
  plugins: [tsconfigPaths(), UnoCSS({}), svelte()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxnaXRfcHJvamVjdHNcXFxcbGV4aWNhbC1zdmVsdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGdpdF9wcm9qZWN0c1xcXFxsZXhpY2FsLXN2ZWx0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZ2l0X3Byb2plY3RzL2xleGljYWwtc3ZlbHRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gXCJAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBVbm9DU1MgZnJvbSBcInVub2Nzcy92aXRlXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBcIi4vXCIsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgc2hhcmVkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNoYXJlZC9zcmMvXCIpLFxuICAgICAgXCJAbGV4aWNhbC9yZWFjdFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9saWIvXCIpLFxuICAgICAgcmVhY3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3JlYWN0LnN2ZWx0ZVwiKSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbdHNjb25maWdQYXRocygpLCBVbm9DU1Moe30pLCBzdmVsdGUoKV0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1IsU0FBUyxvQkFBb0I7QUFDL1MsU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFlBQVk7QUFKbkIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQzdDLGtCQUFrQixLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLE1BQ3BELE9BQU8sS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNqRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
