const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const liveServer = require('rollup-plugin-live-server');

const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

const config = isEsm => {
  
  const outputFile = production ? (isEsm ? pkg.module : pkg.main) : 'example/index.js';

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
        include: [
          'src/**',
        ],
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['ie 11'],
            },
          }],
        ],
      }),
      production ? (isEsm ? 0 : uglify()) : 0,
      production ? 0 : liveServer({
        root: 'example',
        wait: 500,
      }),
    ].filter(Boolean),
  };

  return cfg;
};

module.exports = [
  config(),
  production ? config(true) : undefined,
].filter(Boolean);
