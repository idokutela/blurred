/**
 * Blurs a rectangle in a canvas.
 *
 * @param canvas The canvas to apply the operation to
 * @param radius The blur radius
 * @param x      The x position of the top left corner of the blur region
 * @param y      The y position of the top left corner of the blur region
 * @param width  The width of the blur region
 * @param height The height of the blur region
 */
export declare function blurCanvas(canvas: HTMLCanvasElement, radius: number, x?: number, y?: number, width?: number, height?: number): void;
/**
 * Blurs an image. By default does so in place, but if the asImmutable option is set to true
 * it does not modify the original. Returns the blurred image.
 *
 * @param img    The image to blur
 * @param radius The blur radius
 * @param asImmutable true if the original image is to be copied and left unchanged.
 */
export declare function blurImage(img: HTMLImageElement, radius: number, asImmutable?: boolean): HTMLImageElement;
/**
 * Blurs an image at a given URL.
 *
 * @param url       The URL of the image to blur
 * @param radius    The blur radius
 * @param asDataURL Optional: if true, returns the result as a data URL
 * @return An image containing the result or a DataURL of that image.
 */
export declare function blurURL(url: string, radius: number, asDataURL?: boolean): Promise<HTMLImageElement | string>;
