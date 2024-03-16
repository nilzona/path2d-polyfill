module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parserOptions: {
    project: "tsconfig.eslint.json",
  },
  extends: ["@qlik/eslint-config", "@qlik/eslint-config/vitest"],
  rules: {
    "no-param-reassign": "off",
  },
  ignorePatterns: ["dist"],
};
