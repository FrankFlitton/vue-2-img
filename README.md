# Vue2Img

[![npm](https://img.shields.io/npm/v/vue-2-img.svg)](https://www.npmjs.com/package/vue-2-img) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> An easy way to convert HTML sections and charts to JPG, PNG or PDF files for download or base64 encoding.

This JS package aims to truthfully and easily convert anything that is rendered in the browser to a raster image for download or base64 encoding somewhere else in your app. It works excellent with chart libraries like HighCharts and other SVG rendered graphics.

Vue2Img wraps [html2canvas](https://www.npmjs.com/package/html2canvas) and [jsPDF](https://www.npmjs.com/package/jspdf) packages with logic to make common tasks easier so you can focus on your app. Initially conceived to be a VueJS directive, it's made available as a generic JS package that should integrate with any web page.

Feedback is welcome!

# Features
- Take client side screencaps of your web app
- Bundle many screenshots up as a PDF
- Processes SVGs and icon font files
- Snap a screenshot of a single DOM element or the whole page
- Automatically download an image or PDF file
- Easy install for VueJS (or any other JS Framework)
- Runs 100% in the web browser

## New as of v0.0.5
- Copy a single image or PDF to the clipboard (via navigator API)
- Plays nice with CORS out of the box
- CSS filter support on `<img>` elements
- Return a base64 image, blob, or canvas element
- Open the PDF or image file in a new window
- Pass in a callback or use promises to use the image data in your app
- Returns promises for easy async workflows

## Installation

```bash
npm install --save vue-2-img
```

### Bundler (Webpack, Rollup)

```js
import * as vue2Img from 'vue-2-img'
import 'vue-2-img/dist/vue-2-img.css'

OR

import { image, pdf } from 'vue-2-img'
import 'vue-2-img/dist/vue-2-img.css'
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="vue-2-img/dist/vue-2-img.js"></script>
<script src="vue-2-img/dist/vue-2-img.css"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-2-img/dist/vue-2-img.css"></link>
<script src="https://unpkg.com/vue-2-img"></script>
```

## Usage

```js
// Single Image
vue2img.image()

// Overide Defaults
let pdfImg = {
    target: 'body',
    captureHiddenClass: 'vti__hidden',
    captureShowClass: 'vti__show',
    captureActiveClass: 'vti__active',
    fileName: 'ImageCapture',
    fileType: 'png',
    returnAction: 'download', // blob, base64, canvas, clipboard, newWindow
    callback: (img) => { return img } // modifies what image is returned
}

// Multipage PDF
vue2img.pdf(pdfConfig)

// Overide Defaults
let pdfConfig = {
      target: 'body',
      pageTarget: '.pageTarget',
      captureHiddenClass: 'vti__hidden',
      captureShowClass: 'vti__show',
      captureActiveClass: 'vti__active',
      title: 'pdfCapture',
      author: 'html-image-capture-service',
      maxItems: 50,
      fileNameSuffix: getDate(),
      pageWrapper: '.row',
      padding: 5,
      devStyle: false,
      pageHeight: null, // 612 for letter
      pageWidth: null, // 792 for letter
      pageUnits: 'pt',
      returnAction: 'download' // blob, base64, clipboard, newWindow
}
vue2img.pdf(pdfConfig)
```

## License

[MIT](http://opensource.org/licenses/MIT)
