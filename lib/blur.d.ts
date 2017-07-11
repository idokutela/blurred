/**
 * Blurs image data in place. The core op: the image is represented
 * as a clamped array, and is assumed to be RGB. All numbers must be
 * integers.
 *
 * @param pixels - the array representing the image
 * @param width - the width of the image
 * @param height - the height of the image
 * @param radius - the blur radius
 */
export default function blur(pixels: Uint8ClampedArray, radius: number, width: number, height?: number): Uint8ClampedArray;
