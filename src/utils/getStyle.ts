import { camelize } from "./camelize.js";

export const getStyle = (domElement: HTMLElement, styleProp: string) => {
  if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView
      .getComputedStyle(domElement, null)
      .getPropertyValue(styleProp);
  } else {
    return domElement.style.getPropertyValue(camelize(styleProp));
  }
};
