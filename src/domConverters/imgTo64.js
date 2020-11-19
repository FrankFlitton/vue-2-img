import { createOffscreenCanvas } from '../utils'

// Fix for cors bug
// https://github.com/niklasvh/html2canvas/issues/1544

const imgTo64 = (target, imgList) => {
  const imgElements = document.querySelectorAll(target + ' img')
  // Replace all images with Base64 version
  imgElements.forEach((imageNode) => {
    // Replace after rendering
    if (imgList) imgList(imageNode.src)

    // Fix CORS issue
    imageNode.setAttribute('crossOrigin', 'anonymous')

    // Create canvas
    const c = createOffscreenCanvas()
    c.width = imageNode.width
    c.height = imageNode.height
    const ctx = c.getContext('2d')

    // Apply css filters
    ctx.filter = window.getComputedStyle(imageNode).filter
    ctx.drawImage(imageNode, 0, 0, c.width, c.height)

    imageNode.src = c.toDataURL('image/png')
  })
}

export default imgTo64
