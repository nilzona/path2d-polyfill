import type { Path2D } from "./index.js";
import type { DOMPointInit, ICanvasRenderingContext2D } from "./types.js";

/**
 * Type guard to determine if a value is a valid DOMPointInit object.
 * Checks if the value is an object with x and/or y properties that are numbers or undefined.
 *
 * @param point - The value to check
 * @returns True if the value is a valid point object, false otherwise
 *
 * @example
 * ```typescript
 * isPointObject({ x: 10, y: 20 }); // true
 * isPointObject({ x: 10 }); // true
 * isPointObject({ y: 20 }); // true
 * isPointObject({}); // false
 * isPointObject(10); // false
 * isPointObject(null); // false
 * ```
 */
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

/**
 * Normalized radius representation with separate x and y values.
 * Used internally to standardize radius values for rounded rectangle calculations.
 */
interface NormalizedRadius {
  x: number;
  y: number;
}

/**
 * Normalizes a radius value to a consistent format with separate x and y components.
 * Converts numbers to {x: number, y: number} format and handles DOMPointInit objects.
 *
 * @param radius - The radius value to normalize (number or DOMPointInit)
 * @returns Normalized radius object with x and y properties
 *
 * @example
 * ```typescript
 * normalizeRadius(10); // returns { x: 10, y: 10 }
 * normalizeRadius({ x: 5, y: 15 }); // returns { x: 5, y: 15 }
 * normalizeRadius({ x: 5 }); // returns { x: 5, y: 0 }
 * normalizeRadius({}); // returns { x: 0, y: 0 }
 * ```
 */
function normalizeRadius(radius: number | DOMPointInit): NormalizedRadius {
  if (typeof radius === "number") {
    return { x: radius, y: radius };
  }
  return {
    x: typeof radius.x === "number" ? radius.x : 0,
    y: typeof radius.y === "number" ? radius.y : 0,
  };
}

/**
 * Adds a rounded rectangle to the current path or canvas context.
 *
 * This function implements the roundRect method that can be used on both Path2D objects
 * and CanvasRenderingContext2D contexts. It supports flexible radius specifications
 * including uniform radii, separate horizontal/vertical radii, and individual corner radii.
 *
 * Radius specification:
 * - Single number: Same radius for all corners
 * - Single DOMPointInit: x for horizontal radius, y for vertical radius (all corners)
 * - Array with 1 element: Same as single value
 * - Array with 2 elements: [horizontal, vertical] radii for all corners
 * - Array with 3 elements: [top-left, top-right/bottom-left, bottom-right]
 * - Array with 4 elements: [top-left, top-right, bottom-right, bottom-left]
 *
 * @param this - The Path2D or CanvasRenderingContext2D object to draw on
 * @param x - The x-coordinate of the rectangle's top-left corner
 * @param y - The y-coordinate of the rectangle's top-left corner
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param radii - The corner radii specification (default: 0)
 *
 * @throws {RangeError} When an invalid number of radii are provided (must be 1-4)
 * @throws {RangeError} When any radius value is negative
 * @throws {TypeError} When a radius value is not a number or DOMPointInit
 *
 * @example
 * ```typescript
 * // On a canvas context
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 *
 * // Simple rounded rectangle with uniform radius
 * ctx.roundRect(10, 10, 100, 50, 10);
 *
 * // Different horizontal and vertical radii
 * ctx.roundRect(10, 70, 100, 50, { x: 20, y: 10 });
 *
 * // Individual corner radii
 * ctx.roundRect(10, 130, 100, 50, [5, 10, 15, 20]);
 *
 * // On a Path2D object
 * const path = new Path2D();
 * path.roundRect(10, 10, 100, 50, [10, 20]);
 * ctx.fill(path);
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */
export function roundRect(
  this: Path2D | ICanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | DOMPointInit | (number | DOMPointInit)[] = 0,
): void {
  // Normalize radii input to array format for consistent processing
  if (typeof radii === "number") {
    radii = [radii];
  } else if (isPointObject(radii)) {
    radii = [radii as DOMPointInit];
  } else if (!Array.isArray(radii)) {
    // For invalid types, silently do nothing (matches browser behavior)
    return;
  }

  // Validate radii array length and values
  if (Array.isArray(radii)) {
    // Must have between 1 and 4 radii values
    if (radii.length === 0 || radii.length > 4) {
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${radii.length} radii provided. Between one and four radii are necessary.`,
      );
    }

    // Validate each radius value
    radii.forEach((v) => {
      if (isPointObject(v)) {
        const point = v as DOMPointInit;
        // Check for negative x radius
        if (typeof point.x === "number" && point.x < 0) {
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${point.x} is negative.`,
          );
        }
        // Check for negative y radius
        if (typeof point.y === "number" && point.y < 0) {
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${point.y} is negative.`,
          );
        }
      } else if (typeof v !== "number") {
        // Invalid type
        throw new TypeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is not a number or DOMPointInit.`,
        );
      } else if (typeof v === "number" && v < 0) {
        // Negative number
        throw new RangeError(
          `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is negative.`,
        );
      }
    });
  }
  // Normalize all radii to {x, y} format for consistent processing
  const normalizedRadii = radii.map(normalizeRadius);

  // Optimization: if all radii are zero, just draw a regular rectangle
  if (radii.length === 1 && normalizedRadii[0].x === 0 && normalizedRadii[0].y === 0) {
    this.rect(x, y, width, height);
    return;
  }

  // Calculate corner radii based on the number of radii provided
  // tl = top-left, tr = top-right, br = bottom-right, bl = bottom-left
  const maxRadiusX = width / 2; // Maximum horizontal radius (half the width)
  const maxRadiusY = height / 2; // Maximum vertical radius (half the height)

  // Start with top-left radius, clamped to maximum allowed values
  const tl = {
    x: Math.min(maxRadiusX, normalizedRadii[0].x),
    y: Math.min(maxRadiusY, normalizedRadii[0].y),
  };

  // Initially set all corners to the same radius
  let tr = tl;
  let br = tl;
  let bl = tl;

  // Apply different radius patterns based on array length
  if (normalizedRadii.length === 2) {
    // Two radii: [horizontal, vertical] - top-right and bottom-left get the second radius
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    bl = tr;
  }
  if (normalizedRadii.length === 3) {
    // Three radii: [top-left, top-right/bottom-left, bottom-right]
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    bl = tr;
    br = { x: Math.min(maxRadiusX, normalizedRadii[2].x), y: Math.min(maxRadiusY, normalizedRadii[2].y) };
  }
  if (normalizedRadii.length === 4) {
    // Four radii: [top-left, top-right, bottom-right, bottom-left]
    tr = { x: Math.min(maxRadiusX, normalizedRadii[1].x), y: Math.min(maxRadiusY, normalizedRadii[1].y) };
    br = { x: Math.min(maxRadiusX, normalizedRadii[2].x), y: Math.min(maxRadiusY, normalizedRadii[2].y) };
    bl = { x: Math.min(maxRadiusX, normalizedRadii[3].x), y: Math.min(maxRadiusY, normalizedRadii[3].y) };
  }

  // Draw the rounded rectangle by connecting corners with appropriate curves
  // Start at the bottom-left corner, moving clockwise
  this.moveTo(x, y + height - bl.y);

  // Top-left corner
  // For circular corners (x === y), use arcTo for better performance
  // For elliptical corners (x !== y), use ellipse for proper shape
  if (tl.x === tl.y && tl.x > 0) {
    this.arcTo(x, y, x + tl.x, y, tl.x);
  } else if (tl.x > 0 || tl.y > 0) {
    // Draw quarter ellipse from 180° to 270° (Math.PI to Math.PI * 1.5)
    this.ellipse(x + tl.x, y + tl.y, tl.x, tl.y, 0, Math.PI, Math.PI * 1.5, false);
  } else {
    // No rounding, draw straight line to corner
    this.lineTo(x, y);
  }

  // Top edge - straight line from end of top-left corner to start of top-right corner
  this.lineTo(x + width - tr.x, y);

  // Top-right corner
  if (tr.x === tr.y && tr.x > 0) {
    this.arcTo(x + width, y, x + width, y + tr.y, tr.x);
  } else if (tr.x > 0 || tr.y > 0) {
    // Draw quarter ellipse from 270° to 0° (Math.PI * 1.5 to 0)
    this.ellipse(x + width - tr.x, y + tr.y, tr.x, tr.y, 0, Math.PI * 1.5, 0, false);
  } else {
    this.lineTo(x + width, y);
  }

  // Right edge - straight line from end of top-right corner to start of bottom-right corner
  this.lineTo(x + width, y + height - br.y);

  // Bottom-right corner
  if (br.x === br.y && br.x > 0) {
    this.arcTo(x + width, y + height, x + width - br.x, y + height, br.x);
  } else if (br.x > 0 || br.y > 0) {
    // Draw quarter ellipse from 0° to 90° (0 to Math.PI * 0.5)
    this.ellipse(x + width - br.x, y + height - br.y, br.x, br.y, 0, 0, Math.PI * 0.5, false);
  } else {
    this.lineTo(x + width, y + height);
  }

  // Bottom edge - straight line from end of bottom-right corner to start of bottom-left corner
  this.lineTo(x + bl.x, y + height);

  // Bottom-left corner
  if (bl.x === bl.y && bl.x > 0) {
    this.arcTo(x, y + height, x, y + height - bl.y, bl.x);
  } else if (bl.x > 0 || bl.y > 0) {
    // Draw quarter ellipse from 90° to 180° (Math.PI * 0.5 to Math.PI)
    this.ellipse(x + bl.x, y + height - bl.y, bl.x, bl.y, 0, Math.PI * 0.5, Math.PI, false);
  } else {
    this.lineTo(x, y + height);
  }

  // Close the path to complete the rounded rectangle
  this.closePath();
  // Move back to the starting point (top-left corner) for consistency
  this.moveTo(x, y);
}
