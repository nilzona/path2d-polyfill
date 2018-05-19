import parsePath from './parse-path';
import path2dPolyfill from './path2d-polyfill';

if (typeof window !== 'undefined') {
  path2dPolyfill(window);
}

export {
  path2dPolyfill,
  parsePath,
};
