// import "./vue2img.module.css";
import { type Vue2ImgWindow } from "./types/index";
import { convertImg as image } from "./domConverters/convertImg";
import { convertPdf as pdf } from "./domConverters/convertPdf";

const version = "__VERSION__";

declare let window: Vue2ImgWindow;
window.vue2img = { image, pdf, version };

export { version, image, pdf };
