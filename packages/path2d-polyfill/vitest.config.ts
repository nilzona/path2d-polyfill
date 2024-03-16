/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "dist"],
    environment: "jsdom",
    coverage: {
      exclude: ["*.cjs", "test", "src/__test__/**", "src/index.ts"],
    },
  },
});
