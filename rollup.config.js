/* eslint-env-node */

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import path from 'path';
import { main } from './package.json';

const production = process.env.BUILD === 'production';
const basename = path.basename(main);
const umdName = basename.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase()).split('.js').join('');

const config = {
  input: 'src/index.js',
  cache: true,
  output: {
    file: `${main}`,
    name: umdName,
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    ...(production ? [uglify()] : []),
  ],
};

export default config;
