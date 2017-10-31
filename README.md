# `blurred`
A fast image blur, based on [Stack
Blur](http://incubator.quasimondo.com/processing/fast_blur_deluxe.php). It
works directly on buffers, so can equally be used on the front and the
back end.

Get it:

    npm install -s blurred
    
## Gist
Basic usage:

```js
import blur from 'blurred';

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
import { blurCanvas, blurImage, blurURL } from 'blurred/util';

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

## `blurred` API

### `blur(pixels: Uint8ClampedArray, radius: number, width: number, height: number): Uint8ClampedArray`
Blurs a buffer. Pixels are assumed four bytes long: three colour bytes
and an alpha channel. The alpha channel is ignored in the blur. All
number parameters must be integers, and the height is optional.

## `blurred/util` – convenience functions in the browser
Some sugar around the basic blur.

### `blurCanvas(canvas: HTMLCanvasElement, radius: number, x, y, width: number, height: number): void`
Blurs a rectangle in a canvas. The dimensions default to the size of
the canvas.

### `blurImage(img: HTMLImageElement, radius: number, asImmutable?: boolean): HTMLImageElemen`
Blurs an image. By default does so in place, but if the asImmutable
option is set to true it does not modify the original. Returns the
blurred image.

### `blurURL(url: string, radius: number, asDataURL?: boolean): Promise<HTMLImageElement|string>`
Blurs an image at a given URL. Returns a promise that resolves to the
blurred image, or a dataURL for that image, depending on whether the
`asDataURL` flag is true.

## Typescript
Everything is typed.

## Changelog

 - 1.0.1 : very small bug fix. Blur height is calculated correctly.
 - 2.0.0 : API changes: all browser utilities are now in
   `blurred/util`. `lib` no longer exists. The basic `blur` function
   should be required directly from the package. See examples.
    
   Numerous typos in the documentation
   fixed. https://github.com/idokutela/blurred/pull/1
   incorporated. The tsconfig was simplified, as was the packaging.

## Copyright
The [original
implementation](http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html)
is Copyright (c) 2010 Mario Klingemann.

All modifications are Copyright (c) 2017 Alexander Kahle.

## License
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
