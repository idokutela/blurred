"use strict";
/**
 * Blurs a buffer. See README.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Adapted from http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
  Modifications Copyright (c) 2017 Alexander Kahle
  Original implementation Copyright (c) 2010 Mario Klingemann

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
*/
var mulTable = [
    512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
    454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
    482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
    437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
    497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
    320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
    446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
    329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
    505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
    399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
    324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
    268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
    451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
    385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
    332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
    289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
];
var shgTable = [
    9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
    17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
];
function makeIBlurStack() {
    return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        next: null
    };
}
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
function blur(pixels, radius, width, height) {
    if (height === void 0) { height = pixels.length / (3 * width); }
    var isNotValid = isNaN(radius) || radius < 1;
    if (isNotValid) {
        throw new Error('Invalid radius');
    }
    width |= 0;
    height |= 0;
    radius |= 0;
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = makeIBlurStack();
    var stack = stackStart;
    var stackEnd = null;
    for (var i = 1; i < div; i++) {
        stack = stack.next = makeIBlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    var yi = 0;
    var yw = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];
    for (var y = 0; y < height; y++) {
        var rInSum = 0;
        var gInSum = 0;
        var bInSum = 0;
        var rSum = 0;
        var gSum = 0;
        var bSum = 0;
        var pr = pixels[yi];
        var pg = pixels[yi + 1];
        var pb = pixels[yi + 2];
        var rOutSum = radiusPlus1 * pr;
        var gOutSum = radiusPlus1 * pg;
        var bOutSum = radiusPlus1 * pb;
        rSum += sumFactor * pr;
        gSum += sumFactor * pg;
        bSum += sumFactor * pb;
        stack = stackStart;
        for (var i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        for (var i = 1; i < radiusPlus1; i++) {
            var p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            var rbs = radiusPlus1 - i;
            pr = pixels[p];
            pg = pixels[p + 1];
            pb = pixels[p + 2];
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            rSum += stack.r * rbs;
            gSum += stack.g * rbs;
            bSum += stack.b * rbs;
            rInSum += pr;
            gInSum += pg;
            bInSum += pb;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (var x = 0; x < width; x++) {
            pixels[yi] = (rSum * mulSum) >> shgSum;
            pixels[yi + 1] = (gSum * mulSum) >> shgSum;
            pixels[yi + 2] = (bSum * mulSum) >> shgSum;
            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;
            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;
            var p = x + radius + 1;
            p = (yw + (p < widthMinus1 ? p : widthMinus1)) << 2;
            stackIn.r = pixels[p];
            stackIn.g = pixels[p + 1];
            stackIn.b = pixels[p + 2];
            rInSum += stackIn.r;
            gInSum += stackIn.g;
            bInSum += stackIn.b;
            rSum += rInSum;
            gSum += gInSum;
            bSum += bInSum;
            stackIn = stackIn.next;
            pr = stackOut.r;
            pg = stackOut.g;
            pb = stackOut.b;
            rOutSum += pr;
            gOutSum += pg;
            bOutSum += pb;
            rInSum -= pr;
            gInSum -= pg;
            bInSum -= pb;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (var x = 0; x < width; x++) {
        var rInSum = 0;
        var gInSum = 0;
        var bInSum = 0;
        var rSum = 0;
        var gSum = 0;
        var bSum = 0;
        yi = x << 2;
        var pr = pixels[yi];
        var pg = pixels[yi + 1];
        var pb = pixels[yi + 2];
        var rOutSum = radiusPlus1 * pr;
        var gOutSum = radiusPlus1 * pg;
        var bOutSum = radiusPlus1 * pb;
        rSum += sumFactor * pr;
        gSum += sumFactor * pg;
        bSum += sumFactor * pb;
        stack = stackStart;
        for (var i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        var yp = width;
        for (var i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;
            var rbs = radiusPlus1 - i;
            pr = pixels[yi];
            pg = pixels[yi + 1];
            pb = pixels[yi + 2];
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            rSum += pr * rbs;
            gSum += pg * rbs;
            bSum += pb * rbs;
            rInSum += pr;
            gInSum += pg;
            bInSum += pb;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (var y = 0; y < height; y++) {
            var p = yi << 2;
            pixels[p] = (rSum * mulSum) >> shgSum;
            pixels[p + 1] = (gSum * mulSum) >> shgSum;
            pixels[p + 2] = (bSum * mulSum) >> shgSum;
            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;
            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;
            p = y + radiusPlus1;
            p = (x + ((p < heightMinus1 ? p : heightMinus1) * width)) << 2;
            stackIn.r = pixels[p];
            stackIn.g = pixels[p + 1];
            stackIn.b = pixels[p + 2];
            rInSum += stackIn.r;
            gInSum += stackIn.g;
            bInSum += stackIn.b;
            rSum += rInSum;
            gSum += gInSum;
            bSum += bInSum;
            stackIn = stackIn.next;
            pr = stackOut.r;
            pg = stackOut.g;
            pb = stackOut.b;
            rOutSum += pr;
            gOutSum += pg;
            bOutSum += pb;
            rInSum -= pr;
            gInSum -= pg;
            bInSum -= pb;
            stackOut = stackOut.next;
            yi += width;
        }
    }
    return pixels;
}
exports.default = blur;
