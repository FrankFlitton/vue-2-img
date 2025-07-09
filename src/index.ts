import { type Vue2ImgWindow } from "./types/index";
import { convertImg as image } from "./domConverters/convertImg";
import { convertPdf as pdf } from "./domConverters/convertPdf";

import "./vue2img.css";

const version = "__VERSION__";

const init = () => {
  if (globalThis.window) {
    const vue2imgWindow = window as unknown as Vue2ImgWindow;
    vue2imgWindow.vue2img = {
      image,
      pdf,
      version,
    };
  }
};

init();

export default { version, image, pdf };
