import { type ICanvasRenderingContext2D, type IPath2D } from "./types.js";

export function roundRect(
  this: IPath2D | ICanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[] = 0,
): void {
  if (typeof radii === "number") {
    radii = [radii];
  }
  // check for range error
  if (Array.isArray(radii)) {
    if (radii.length === 0 || radii.length > 4) {
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${radii.length} radii provided. Between one and four radii are necessary.`,
      );
    }
    radii.forEach((v) => {
      if (v < 0) {
        throw new RangeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is negative.`,
        );
      }
    });
  } else {
    return;
  }
  if (radii.length === 1 && radii[0] === 0) {
    this.rect(x, y, width, height);
    return;
  }

  // set the corners
  // tl = top left radius
  // tr = top right radius
  // br = bottom right radius
  // bl = bottom left radius
  const minRadius = Math.min(width, height) / 2;
  const tl = Math.min(minRadius, radii[0]);
  let tr = tl;
  let br = tl;
  let bl = tl;
  if (radii.length === 2) {
    tr = Math.min(minRadius, radii[1]);
    bl = tr;
  }
  if (radii.length === 3) {
    tr = Math.min(minRadius, radii[1]);
    bl = tr;
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
