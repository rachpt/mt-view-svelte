import { join } from "path";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import { svelte } from "@sveltejs/vite-plugin-svelte";

import config from "./userscript.config.js";

// https://vitejs.dev/config/
export default defineConfig({
  build: { minify: true },
  plugins: [
    svelte(),
    monkey({
      entry: "src/main.js",
      userscript: config,
    }),
  ],
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
});
