/**
 * glassy
 * Browser utilities.
 */

/*
 * Copyright (c) 2018 Alexander Kahle
 *
 * See LICENSE.md for the license.
 */

import blur from "./blur";

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (context === null) {
    throw new Error("unable to establish canvas context");
  }

  return context;
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const newCanvas: HTMLCanvasElement = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  newCanvas.style.width = `${width}px`;
  newCanvas.style.height = `${height}px`;

  return newCanvas;
}

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
export function blurCanvas(
  canvas: HTMLCanvasElement,
  radius: number,
  x: number = 0,
  y: number = 0,
  width: number = canvas.width - x,
  height: number = canvas.height - y
): void {
  const context: CanvasRenderingContext2D = getContext(canvas);
  const data: ImageData = context.getImageData(x, y, width, height);
  const buffer: Uint8ClampedArray = data.data;
  blur(buffer, radius, width, height);
  context.putImageData(data, x, y);
}

/**
 * Blurs an image. By default does so in place, but if the asImmutable option is set to true
 * it does not modify the original. Returns the blurred image.
 * 
 * @param img    The image to blur
 * @param radius The blur radius
 * @param asImmutable true if the original image is to be copied and left unchanged.
 */
export function blurImage(
  img: HTMLImageElement,
  radius: number,
  asImmutable?: boolean
): HTMLImageElement {
  const w: number = img.naturalWidth;
  const h: number = img.naturalHeight;

  const canvas: HTMLCanvasElement = makeCanvas(w, h);
  const context: CanvasRenderingContext2D = getContext(canvas);
  context.drawImage(img, 0, 0);
  blurCanvas(canvas, radius);

  const result: HTMLImageElement = asImmutable ? new Image() : img;
  result.src = canvas.toDataURL();

  return result;
}

/**
 * Blurs an image at a given URL.
 *
 * @param url       The URL of the image to blur
 * @param radius    The blur radius
 * @param asDataURL Optional: if true, returns the result as a data URL
 * @return An image containing the result or a DataURL of that image.
 */
export function blurURL(
  url: string,
  radius: number,
  asDataURL?: boolean
): Promise<HTMLImageElement | string> {
  const source: HTMLImageElement = new Image();
  source.src = url;

  return new Promise<
    HTMLImageElement | string
    >(
    (
      resolve: (value: HTMLImageElement | string) => void,
      reject: (this: HTMLElement, reason: UIEvent | ErrorEvent) => void
    ): void => {
      source.onload = (): void => {
        blurImage(source, radius);
        if (asDataURL) {
          resolve(source.src);
        } else {
          resolve(source);
        }
      };
      source.onabort = reject;
      source.onerror = reject;
    }
    );
}
