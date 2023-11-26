module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parserOptions: {
    project: "tsconfig.eslint.json",
  },
  extends: ["@qlik/eslint-config"],
  rules: {
    "no-param-reassign": "off",
  },
  ignorePatterns: ["dist", "test/path2d-polyfill.min.js"],
};
