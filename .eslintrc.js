module.exports = {
  root: true,
  overrides: [
    {
      files: ["src/*.ts", "test/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
      ],
    },
    {
      files: ["test/*.ts"],
      env: {
        mocha: true,
      },
      rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.js"],
      env: {
        commonjs: true,
        es6: true,
        node: true,
      },
      extends: ["eslint:recommended", "prettier"],
    },
    {
      files: ["browser.js", "example/**/*.js"],
      env: {
        browser: true,
      },
    },
  ],
  ignorePatterns: ["dist", "coverage", "example/path2d-polyfill.dev.js"],
};
