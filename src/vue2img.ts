import { convertImg } from "./domConverters/convertImg";
import { convertPdf } from "./domConverters/convertPdf";

const vue2img = () => {
  return {
    image: convertImg,
    pdf: convertPdf,
  };
};

export default vue2img;
