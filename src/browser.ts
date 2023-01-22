import { polyfillPath2D } from "./path2d";
import { polyfillRoundRect } from "./round-rect";
import { type WindowLike } from "./types";

polyfillPath2D(window as WindowLike);
polyfillRoundRect(window);
