import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "shared/src/"),
      "@lexical/react": path.resolve(__dirname, "src/lib/"),
      react: path.resolve(__dirname, "src/react.svelte"),
    },
  },
  plugins: [svelte()],
});
