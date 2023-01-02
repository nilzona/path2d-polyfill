const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const livereload = require("rollup-plugin-livereload");
const serve = require("rollup-plugin-serve");

const production = !process.env.ROLLUP_WATCH;

const config = (environment = "browser", target = "iife") => {
  let suffix = target === "iife" ? "min" : target;
  let format = target === "dev" ? "iife" : target;

  const outputFile = production ? `dist/path2d-polyfill.${suffix}.js` : "example/path2d-polyfill.dev.js";

  const input = environment === "node" ? "src/index.ts" : "src/browser.ts";

  let minify = target === "iife" && production;

  const cfg = {
    input,
    output: {
      format,
      file: outputFile,
      name: "path2dPolyfill",
    },
    plugins: [
      minify ? terser() : 0,
      typescript(),
      production ? 0 : serve("example"),
      production ? 0 : livereload({ watch: "example" }),
    ].filter(Boolean),
  };

  return cfg;
};

module.exports = production
  ? [config("node", "cjs"), config("node", "esm"), config("browser", "dev"), config("browser", "iife")]
  : config("browser", "iife");
