const parsePath = require('./parse-path');
const path2dPolyfill = require('./path2d-polyfill');

if (typeof window !== 'undefined') {
  path2dPolyfill(window);
}

exports.path2dPolyfill = path2dPolyfill;
exports.parsePath = parsePath;
