/**
 * Blurs image data in place. The core op: the image is represented
 * as a clamped array. Pixels are assumed to consume four bytes: three
 * byte-long colours, and one alpha byte. The alpha channel is ignored in the blur.
 *
 * All number parameters must be integers.
 *
 * @param pixels - the array representing the image
 * @param radius - the blur radius
 * @param width - the width of the image
 * @param height - the height of the image: optional
 */
export default function blur(pixels: Uint8ClampedArray, radius: number, width: number, height?: number): Uint8ClampedArray;
