import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "dist"],
    coverage: {
      exclude: ["*.cjs", "src/__test__/**", "src/types.ts", "src/index.ts"],
    },
  },
});
