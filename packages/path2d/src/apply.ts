import { Path2D, buildPath } from "./path2d.js";
import { roundRect } from "./round-rect.js";
import type { CanvasFillRule, ICanvasRenderingContext2D, IPath2D, IPrototype, PartialBy } from "./types.js";

type FillFn = (fillRule?: CanvasFillRule) => void;
type StrokeFn = () => void;
type IsPointInPathFn = (x: number, y: number, fillRule?: CanvasFillRule) => boolean;

/**
 * Adds Path2D capabilities to CanvasRenderingContext2D stroke, fill and isPointInPath
 * @param global - window like object containing a CanvasRenderingContext2D constructor
 */
export function applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D?: IPrototype<ICanvasRenderingContext2D>) {
  if (!CanvasRenderingContext2D) return;

  /* eslint-disable @typescript-eslint/unbound-method */
  // setting unbound functions here. Make sure this is set in function call later
  const cFill: FillFn = CanvasRenderingContext2D.prototype.fill;
  const cStroke: StrokeFn = CanvasRenderingContext2D.prototype.stroke;
  const cIsPointInPath: IsPointInPathFn = CanvasRenderingContext2D.prototype.isPointInPath;
  /* eslint-enable @typescript-eslint/unbound-method */

  CanvasRenderingContext2D.prototype.fill = function fill(...args: unknown[]) {
    if (args[0] instanceof Path2D) {
      const path = args[0];
      const fillRule = (args[1] as CanvasFillRule) || "nonzero";
      buildPath(this, path.commands);
      return cFill.apply(this, [fillRule]);
    }
    const fillRule = (args[0] as CanvasFillRule) || "nonzero";
    return cFill.apply(this, [fillRule]);
  };

  CanvasRenderingContext2D.prototype.stroke = function stroke(path?: Path2D) {
    if (path) {
      buildPath(this, path.commands);
    }
    cStroke.apply(this);
  };

  CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath(...args: unknown[]) {
    if (args[0] instanceof Path2D) {
      // first argument is a Path2D object
      const path = args[0];
      const x = args[1] as number;
      const y = args[2] as number;
      const fillRule = (args[3] as CanvasFillRule) || "nonzero";
      buildPath(this, path.commands);
      return cIsPointInPath.apply(this, [x, y, fillRule]);
    }
    return cIsPointInPath.apply(this, args as [x: number, y: number, fillRule: CanvasFillRule]);
  };
}

/**
 * Polyfills roundRect on CanvasRenderingContext2D
 * @param CanvasRenderingContext2D - CanvasRenderingContext2D constructor object
 */
export function applyRoundRectToCanvasRenderingContext2D(
  CanvasRenderingContext2D?: IPrototype<PartialBy<ICanvasRenderingContext2D, "roundRect">>,
) {
  // polyfill unsupported roundRect for e.g. firefox https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect#browser_compatibility
  if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = roundRect;
  }
}

/**
 * Polyfills roundRect on Path2D
 * @param Path2D - Path2D constructor object
 */
export function applyRoundRectToPath2D(P2D?: IPrototype<PartialBy<IPath2D, "roundRect">>) {
  // polyfill unsupported roundRect for e.g. firefox https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect#browser_compatibility
  if (P2D && !P2D.prototype.roundRect) {
    P2D.prototype.roundRect = roundRect;
  }
}
