import type { DOMPointInit, ICanvasRenderingContext2D, IPath2D } from "./types.js";

function isPointObject(point: unknown): boolean {
  return (
    point !== null &&
    typeof point === "object" &&
    ("x" in point || "y" in point) &&
    (typeof (point as DOMPointInit).x === "number" ||
      typeof (point as DOMPointInit).y === "number" ||
      typeof (point as DOMPointInit).x === "undefined" ||
      typeof (point as DOMPointInit).y === "undefined")
  );
}

interface NormalizedRadius {
  x: number;
  y: number;
}

function normalizeRadius(radius: number | DOMPointInit): NormalizedRadius {
  if (typeof radius === "number") {
    return { x: radius, y: radius };
  }
  return {
    x: typeof radius.x === "number" ? radius.x : 0,
    y: typeof radius.y === "number" ? radius.y : 0,
  };
}

export function roundRect(
  this: IPath2D | ICanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | DOMPointInit | (number | DOMPointInit)[] = 0,
): void {
  if (typeof radii === "number") {
    radii = [radii];
  } else if (isPointObject(radii)) {
    radii = [radii as DOMPointInit];
  } else if (!Array.isArray(radii)) {
    // For invalid types, silently do nothing (match browser behavior)
    return;
  }

  // check for range error
  if (Array.isArray(radii)) {
    if (radii.length === 0 || radii.length > 4) {
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${radii.length} radii provided. Between one and four radii are necessary.`,
      );
    }
    radii.forEach((v) => {
      if (isPointObject(v)) {
        const point = v as DOMPointInit;
        if (typeof point.x === "number" && point.x < 0) {
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${point.x} is negative.`,
          );
        }
        if (typeof point.y === "number" && point.y < 0) {
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${point.y} is negative.`,
          );
        }
      } else if (typeof v !== "number") {
        throw new TypeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is not a number or DOMPointInit.`,
        );
      } else if (typeof v === "number" && v < 0) {
        throw new RangeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is negative.`,
        );
      }
    });
  }
  // Normalize all radii to {x, y} format
  const normalizedRadii = radii.map(normalizeRadius);

  // Check if all radii are zero
  if (radii.length === 1 && normalizedRadii[0].x === 0 && normalizedRadii[0].y === 0) {
    this.rect(x, y, width, height);
    return;
  }

  // set the corners
  // tl = top left radius
  // tr = top right radius
  // br = bottom right radius
  // bl = bottom left radius
  const maxRadiusX = width / 2;
  const maxRadiusY = height / 2;

  const tl = { x: Math.min(maxRadiusX, normalizedRadii[0].x), y: Math.min(maxRadiusY, normalizedRadii[0].y) };
  let tr = tl;
  let br = tl;
  let bl = tl;

  if (normalizedRadii.length === 2) {
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    bl = tr;
  }
  if (normalizedRadii.length === 3) {
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    bl = tr;
    br = { x: Math.min(maxRadiusX, normalizedRadii[2].x), y: Math.min(maxRadiusY, normalizedRadii[2].y) };
  }
  if (normalizedRadii.length === 4) {
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    br = { x: Math.min(maxRadiusX, normalizedRadii[2].x), y: Math.min(maxRadiusY, normalizedRadii[2].y) };
    bl = { x: Math.min(maxRadiusX, normalizedRadii[3].x), y: Math.min(maxRadiusY, normalizedRadii[3].y) };
  }

  // let's draw the rounded rectangle
  this.moveTo(x, y + height - bl.y);

  // Top-left corner
  if (tl.x === tl.y && tl.x > 0) {
    this.arcTo(x, y, x + tl.x, y, tl.x);
  } else if (tl.x > 0 || tl.y > 0) {
    this.ellipse(x + tl.x, y + tl.y, tl.x, tl.y, 0, Math.PI, Math.PI * 1.5, false);
  } else {
    this.lineTo(x, y);
  }

  // Top edge
  this.lineTo(x + width - tr.x, y);

  // Top-right corner
  if (tr.x === tr.y && tr.x > 0) {
    this.arcTo(x + width, y, x + width, y + tr.y, tr.x);
  } else if (tr.x > 0 || tr.y > 0) {
    this.ellipse(x + width - tr.x, y + tr.y, tr.x, tr.y, 0, Math.PI * 1.5, 0, false);
  } else {
    this.lineTo(x + width, y);
  }

  // Right edge
  this.lineTo(x + width, y + height - br.y);

  // Bottom-right corner
  if (br.x === br.y && br.x > 0) {
    this.arcTo(x + width, y + height, x + width - br.x, y + height, br.x);
  } else if (br.x > 0 || br.y > 0) {
    this.ellipse(x + width - br.x, y + height - br.y, br.x, br.y, 0, 0, Math.PI * 0.5, false);
  } else {
    this.lineTo(x + width, y + height);
  }

  // Bottom edge
  this.lineTo(x + bl.x, y + height);

  // Bottom-left corner
  if (bl.x === bl.y && bl.x > 0) {
    this.arcTo(x, y + height, x, y + height - bl.y, bl.x);
  } else if (bl.x > 0 || bl.y > 0) {
    this.ellipse(x + bl.x, y + height - bl.y, bl.x, bl.y, 0, Math.PI * 0.5, Math.PI, false);
  } else {
    this.lineTo(x, y + height);
  }

  this.closePath();
  this.moveTo(x, y);
}
