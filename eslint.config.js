// @ts-check
import qlik, { esmTS } from "@qlik/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    // ignore these
    ignores: ["**/dist", "**/coverage", "**/.turbo", "**/node_modules", "**/*.min.js"],
  },
  ...qlik.configs.recommended,
  {
    files: ["**/packages/path2d/**/*.{js,ts}"],
    extends: [esmTS],
  },
  {
    rules: {
      "no-param-reassign": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
);
