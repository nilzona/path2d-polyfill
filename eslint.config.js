// @ts-check
import qlik from "@qlik/eslint-config";

export default qlik.compose(
  // ignore these
  { ignores: ["**/dist", "**/node_modules", "**/*.min.js"] },
  // use the default react config
  ...qlik.configs.recommended,
  {
    files: ["**/__tests__/*"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
);
