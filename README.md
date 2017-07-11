# `fastBlur`
A fast image blur, based on [Stack Blur](http://incubator.quasimondo.com/processing/fast_blur_deluxe.php).

Get it:

    npm install -s fastBlur
    
## Gist
Basic usage:

```js
const blur = require('glassy');

let buffer;
/*
 * Do something to initialise the image buffer.
 * Suppose the image buffer has width 1024, height 768.
 */

// blur the image with blur radius 12
const width = 1024;
const height = 768;
const blurRadius = 12;
blur(buffer, blurRadius, width, height);
```

Some convenience methods are provided in the browser:
```js
const { blurCanvas, blurImage, blurURL } = require('lib/browser');

const blurRadius = 14;
// Blur an image located at a URL
blurURL('http://someurl', blurRadius)
  .then(image => {
    // do something with the image -- the argumant is an HTMLImageElement
  })
  .catch(err => {
    console.log('Error loading or blurring image.');
  });

// Blur an image located at a url, and set the document body background
// image to the result.
// For this, pass a second argument 'url'.
blurURL('http://someurl', blurRadius, 'url')
  .then(url => {
    document.body.style.backgroundImage = `url(${url})`;
  })
  .catch(err => {
    console.log('Error loading or blurring image.');
  });

// Blur an ImageElement in place
blurImage(someImageElement, blurRadius);

// Blur a region in a canvas in place.
const x = 12;
const y = 30;
const width = 46;
const height = 12;
blurCanvas(someCanvas, blurRadius, x, y, width, height);
```

## Base API
This exports a single function:

### `blur(pixels: Uint8ClampedArray, radius: number, width: number, height: number): Uint8ClampedArray`
Blurs a buffer. Assumed to be RGB. The height is optional, and if not specified is calculated from the
radius and the width. The calculation of the height involves a division, so if performance is paramount,
pass a height.

One can also obtain this from `lib/blur`.

## `glassy/browser`
This exports three functions.

### `blurCanvas(canvas: HTMLCanvasElement, radius: number, x, y, width: number, height: number): void`
Blurs a rectangle in a canvas. The dimensions default to the size of the canvas.

### `blurImage(img: HTMLImageElement, radius: number, asImmutable?: boolean): HTMLImageElemen`
Blurs an image. By default does so in place, but if the asImmutable option is set to true
it does not modify the original. Returns the blurred image.

### `blurURL(url: string, radius: number, asDataURL?: boolean): Promise<HTMLImageElement|string>`
Blurs an image at a given URL. Returns a promise that resolves to the blurred image, or a dataURL
for that image, depending on whether the `asDataURL` flag is true.

## Typescript
The modules `lib/blur` and `lib/browser` are typed.

## Copyright
The (original implementation)[http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html] is
Copyright (c) 2010 Mario Klingemann. 

All modifications are Copyright (c) 2017 Alexander Kahle.

## License
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.