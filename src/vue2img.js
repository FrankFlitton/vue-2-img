import { convertImg } from './domConverters/convertImg'
import { convertPDF } from './domConverters/convertImg'

const vue2img = () => {
  return {
    image: convertImg,
    pdf: convertPDF
  }
}

export default vue2img
