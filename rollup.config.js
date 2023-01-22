const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const livereload = require("rollup-plugin-livereload");
const serve = require("rollup-plugin-serve");

const production = !process.env.ROLLUP_WATCH;

const config = (environment = "browser", target = "iife") => {
  let suffix = "";
  if (environment === "browser") {
    suffix = target === "iife" ? ".min" : `.${target}`;
  }
  let format = target === "dev" ? "iife" : target;
  let name = environment === "browser" ? "polyfill" : "node";

  let ending = "js";
  if (environment === "node") {
    ending = target === "cjs" ? "cjs" : "mjs";
  }

  const outputFile = production ? `dist/path2d-${name}${suffix}.${ending}` : `example/path2d-${name}.dev.${ending}`;

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
  ? [
      config("node", "cjs"),
      config("node", "esm"),
      config("browser", "esm"),
      config("browser", "dev"),
      config("browser", "iife"),
    ]
  : [config("browser", "iife")];
