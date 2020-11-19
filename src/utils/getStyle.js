import { camelize } from './camelize.js'

export function getStyle (domElement, styleProp) {
  if (domElement.currentStyle) {
    return domElement.currentStyle[camelize(styleProp)]
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(domElement, null)
      .getPropertyValue(styleProp)
  } else {
    return domElement.style[camelize(styleProp)]
  }
}
