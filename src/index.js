import parsePath from './parse-path';
import path2dPolyfill from './path2d-polyfill';

if (window) {
  path2dPolyfill(window);
}

export {
  path2dPolyfill,
  parsePath,
};
