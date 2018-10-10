# Vue2Img

[![npm](https://img.shields.io/npm/v/vue-2-img.svg)](https://www.npmjs.com/package/vue-2-img) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> WIP A component to converts DOM elements and charts to JPG, PNG or PDFs.

Initially concieved as a vue directive, rewriting for commonJS.

## Installation

```bash
npm install --save vue-2-img
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import Vue2Img from 'vue-2-img'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-2-img/dist/vue-2-img.css'

Vue.use(Vue2Img)
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-2-img/dist/vue-2-img.css"></link>
<script src="vue-2-img/dist/vue-2-img.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-2-img/dist/vue-2-img.css"></link>
<script src="https://unpkg.com/vue-2-img"></script>
```

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
