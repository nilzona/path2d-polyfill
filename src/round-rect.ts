import { type WindowLike } from "./types";

function roundRect(
  this: Path2D | CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[] = 0
): void {
  if (typeof radii === "number") {
    // eslint-disable-next-line no-param-reassign
    radii = [radii];
  }
  // check for range error
  if (Array.isArray(radii)) {
    if (radii.length === 0 || radii.length > 4) {
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${radii.length} radii provided. Between one and four radii are necessary.`
      );
    }
    radii.forEach((v) => {
      if (v < 0) {
        throw new RangeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is negative.`
        );
      }
    });
  } else {
    return;
  }
  if (radii.length === 1 && radii[0] === 0) {
    return this.rect(x, y, width, height);
  }

  // set the corners
  // tl = top left radius
  // tr = top right radius
  // br = bottom right radius
  // bl = bottom left radius
  const minRadius = Math.min(width, height) / 2;
  let tr, br, bl;
  const tl = (tr = br = bl = Math.min(minRadius, radii[0]));
  if (radii.length === 2) {
    tr = bl = Math.min(minRadius, radii[1]);
  }
  if (radii.length === 3) {
    tr = bl = Math.min(minRadius, radii[1]);
    br = Math.min(minRadius, radii[2]);
  }
  if (radii.length === 4) {
    tr = Math.min(minRadius, radii[1]);
    br = Math.min(minRadius, radii[2]);
    bl = Math.min(minRadius, radii[3]);
  }

  // begin with closing current path
  // this.closePath();
  // let's draw the rounded rectangle
  this.moveTo(x, y + height - bl);
  this.arcTo(x, y, x + tl, y, tl);
  this.arcTo(x + width, y, x + width, y + tr, tr);
  this.arcTo(x + width, y + height, x + width - br, y + height, br);
  this.arcTo(x, y + height, x, y + height - bl, bl);
  // and move to rects control point for further path drawing
  this.moveTo(x, y);
}

/**
 * Polyfills roundRect on CanvasRenderingContext2D and Path2D
 * @param {WindowLike} window - window like object containing both CanvasRenderingContext2D and Path2D constructor
 */
export function polyfillRoundRect(window: undefined | WindowLike) {
  if (!window || !window.CanvasRenderingContext2D) return;
  const { CanvasRenderingContext2D, Path2D } = window;
  // polyfill unsupported roundRect for e.g. firefox https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect#browser_compatibility
  if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = roundRect;
  }

  if (Path2D && !Path2D.prototype.roundRect) {
    Path2D.prototype.roundRect = roundRect;
  }
}
