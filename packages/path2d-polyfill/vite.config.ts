import babel from "@rollup/plugin-babel";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "PATH2D_POLYFILL",
      // the proper extensions will be added
      fileName: () => "path2d-polyfill.min.js",
      formats: ["iife"],
    },
    rollupOptions: {
      plugins: [
        babel({
          presets: ["@babel/preset-env"],
        }),
      ],
    },
  },
});
