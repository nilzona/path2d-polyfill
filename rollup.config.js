/* eslint-env node */
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const { terser } = require("rollup-plugin-terser");
const livereload = require("rollup-plugin-livereload");
const serve = require("rollup-plugin-serve");

const pkg = require("./package.json");
const production = !process.env.ROLLUP_WATCH;

const config = (isEsm) => {
  const outputFile = production ? (isEsm ? pkg.module : pkg.main) : "example/index.js";

  const umdName = "path2dPolyfill";

  const cfg = {
    input: "src/index",
    output: {
      format: isEsm ? "es" : "umd",
      file: outputFile,
      name: umdName,
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      commonjs(),
      babel({
        include: ["src/**"],
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["ie 11"],
              },
            },
          ],
        ],
      }),
      production ? (isEsm ? 0 : terser()) : 0,
      production ? 0 : serve("example"),
      production ? 0 : livereload({ watch: "example" }),
    ].filter(Boolean),
  };

  return cfg;
};

module.exports = [config(), production ? config(true) : undefined].filter(Boolean);
