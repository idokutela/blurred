"use strict";
/**
 * glassy
 * Browser utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2018 Alexander Kahle
 *
 * See LICENSE.md for the license.
 */
var blur_1 = require("./blur");
function getContext(canvas) {
    var context = canvas.getContext("2d");
    if (context === null) {
        throw new Error("unable to establish canvas context");
    }
    return context;
}
function makeCanvas(width, height) {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = width;
    newCanvas.height = height;
    newCanvas.style.width = width + "px";
    newCanvas.style.height = height + "px";
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
function blurCanvas(canvas, radius, x, y, width, height) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (width === void 0) { width = canvas.width - x; }
    if (height === void 0) { height = canvas.height - y; }
    var context = getContext(canvas);
    var data = context.getImageData(x, y, width, height);
    var buffer = data.data;
    blur_1.default(buffer, radius, width, height);
    context.putImageData(data, x, y);
}
exports.blurCanvas = blurCanvas;
/**
 * Blurs an image. By default does so in place, but if the asImmutable option is set to true
 * it does not modify the original. Returns the blurred image.
 *
 * @param img    The image to blur
 * @param radius The blur radius
 * @param asImmutable true if the original image is to be copied and left unchanged.
 */
function blurImage(img, radius, asImmutable) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var canvas = makeCanvas(w, h);
    var context = getContext(canvas);
    context.drawImage(img, 0, 0);
    blurCanvas(canvas, radius);
    var result = asImmutable ? new Image() : img;
    result.src = canvas.toDataURL();
    return result;
}
exports.blurImage = blurImage;
/**
 * Blurs an image at a given URL.
 *
 * @param url       The URL of the image to blur
 * @param radius    The blur radius
 * @param asDataURL Optional: if true, returns the result as a data URL
 * @return An image containing the result or a DataURL of that image.
 */
function blurURL(url, radius, asDataURL) {
    var source = new Image();
    source.src = url;
    return new Promise(function (resolve, reject) {
        source.onload = function () {
            blurImage(source, radius);
            if (asDataURL) {
                resolve(source.src);
            }
            else {
                resolve(source);
            }
        };
        source.onabort = reject;
        source.onerror = reject;
    });
}
exports.blurURL = blurURL;
