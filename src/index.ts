import type { Vue2ImgWindow } from "./types/index.js";
import vue2img from "./vue2img";
import "./vue2img.scss";

declare let window: Vue2ImgWindow;
window.vue2img = vue2img;

export default vue2img;
const version = "__VERSION__";

export { version, vue2img };
