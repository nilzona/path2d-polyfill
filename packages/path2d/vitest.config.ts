import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "dist", "coverage", ".turbo"],
    coverage: {
      exclude: ["dist", "src/__test__/**", "src/types.ts", "src/index.ts", "vitest.config.ts"],
    },
  },
});
