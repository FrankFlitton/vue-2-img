# Vue2Img

[![npm](https://img.shields.io/npm/v/vue-2-img.svg)](https://www.npmjs.com/package/vue-2-img) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> WIP A component to converts DOM elements and charts to JPG, PNG or PDFs.

This JS package aims to truthfully and easily convert anything that is rendered in the browser to a raster image for download. It works excellent with HighCharts and other SVG rendered graphics.

Initially conceived to be a vueJS directive, I'm publishing the first version as a generic JS package to get feedback while building a more integrated vue solution.

Any feedback is welcome!

## Installation

```bash
npm install --save vue-2-img
```

### Bundler (Webpack, Rollup)

```js
import Vue2Img from 'vue-2-img'
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
vue2img().image()

// Overide Defaults
let pdfImg = {
    target: 'body',
    captureHiddenClass: 'vti__hidden',
    captureShowClass: 'vti__show',
    captureActiveClass: 'vti__active',
    fileName: 'ImageCapture',
    fileType: 'png'
}
vue2img().image(pdfImg)

// Multipage PDF
vue2img().pdf(pdfConfig)

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
      pageUnits: 'pt'
}
vue2img().pdf(pdfConfig)
```

## TODO

- VUEJS directive/component
- Rewrite to ES6 and lodash (not jQuery)
- Tests

## License

[MIT](http://opensource.org/licenses/MIT)
