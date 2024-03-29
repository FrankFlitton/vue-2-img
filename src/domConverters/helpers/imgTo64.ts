import { createOffscreenCanvas } from "../../utils";

// Fix for cors bug
// https://github.com/niklasvh/html2canvas/issues/1544

export const imgTo64 = (target: string, imgList: (img: string) => void) => {
  const container = document.querySelector(target);
  const imgQ = container?.querySelectorAll("img");
  const imgElements = imgQ ? [...imgQ] : [];
  const devicePixelRatio = window.devicePixelRatio;

  // Replace all images with Base64 version
  imgElements.forEach((imageNode) => {
    // Replace after rendering
    if (imgList) imgList(imageNode.src);

    // Fix CORS issue
    imageNode.setAttribute("crossOrigin", "anonymous");

    // Create canvas
    const canvas = createOffscreenCanvas();
    const context = canvas.getContext("2d");

    // Look good on retina, use device size
    canvas.width = imageNode.width * devicePixelRatio;
    canvas.height = imageNode.height * devicePixelRatio;

    // Apply css filters
    if (context) {
      context.filter = window.getComputedStyle(imageNode).filter;
      context.drawImage(imageNode, 0, 0, canvas.width, canvas.height);
    }

    // Reset size
    canvas.style.width = imageNode.width + "px";
    canvas.style.height = imageNode.height + "px";

    imageNode.src = canvas.toDataURL("image/png");
  });
};
