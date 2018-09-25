const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');

const pkg = require('./package.json');

const config = isEsm => {
  const outputFile = isEsm ? pkg.module : pkg.main;
  const umdName = 'path2dPolyfill';

  const cfg = {
    input: 'src/index',
    output: {
      format: isEsm ? 'es' : 'umd',
      file: outputFile,
      name: umdName,
      sourcemap: true,
    },
    plugins: [
      babel({
        include: [
          'src/**',
        ],
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              browsers: ['ie 11'],
            },
          }],
        ],
      }),
      isEsm ? 0 : uglify(),
    ].filter(Boolean),
  };

  return cfg;
};

module.exports = [
  config(),
  config(true),
].filter(Boolean);
