import {
  Path2D,
  applyPath2DToCanvasRenderingContext,
  applyRoundRectToCanvasRenderingContext2D,
  applyRoundRectToPath2D,
} from "path2d";

export function polyfillPath2D() {
  if (window) {
    if (window.CanvasRenderingContext2D && !window.Path2D) {
      // @ts-expect-error polyfilling
      window.Path2D = Path2D;
      applyPath2DToCanvasRenderingContext(window.CanvasRenderingContext2D);
    }
    applyRoundRectToPath2D(window.Path2D);
    applyRoundRectToCanvasRenderingContext2D(window.CanvasRenderingContext2D);
  }
}
