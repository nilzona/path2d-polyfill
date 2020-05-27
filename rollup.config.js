// eslint srcType
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

const config = (isEsm) => {
  const outputFile = production
    ? isEsm
      ? pkg.module
      : pkg.main
    : 'example/index.js';

  const umdName = 'path2dPolyfill';

  const cfg = {
    input: 'src/index',
    output: {
      format: isEsm ? 'es' : 'umd',
      file: outputFile,
      name: umdName,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      commonjs(),
      babel({
        include: ['src/**'],
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['ie 11'],
              },
            },
          ],
        ],
      }),
      production ? (isEsm ? 0 : terser()) : 0,
      production ? 0 : serve('example'),
      production ? 0 : livereload({ watch: 'example' }),
    ].filter(Boolean),
  };

  return cfg;
};

export default [config(), production ? config(true) : undefined].filter(
  Boolean
);
