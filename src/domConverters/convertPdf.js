import { jsPDF as JsPDF } from 'jsPDF'
import { canvasExport, svgToCanvas, imgTo64 } from './helpers'
import { getDate } from '../utils'

export const convertPdf = async (_options) => {
  const _defaults = {
    target: 'body',
    pageTarget: '.pageTarget',
    captureHiddenClass: 'vti__hidden',
    captureShowClass: 'vti__show',
    captureActiveClass: 'vti__active',
    title: 'pdfCapture',
    author: 'html-image-capture-service',
    maxItems: 50,
    fileNameSuffix: getDate(),
    pageWrapper: '.row',
    padding: 5,
    devStyle: false,
    pageHeight: null,
    pageWidth: null,
    pageUnits: 'pt',
    returnAction: 'download'
  }

  // Merge defaults and options, without modifying defaults
  const _settings = { ..._defaults, ..._options }
  // var _targetObject = $(_settings.target)[0]
  const heightList = []
  const widthList = []
  const pdfPageTarget = _settings.target + ' ' + _settings.pageTarget
  let counterI = 0
  const listOfPages = [...window.document.querySelectorAll(pdfPageTarget)]
  const nRendered = listOfPages.length
  const fileName = _settings.title + _settings.fileNameSuffix + '.pdf'
  let pageWidth = _settings.pageWidth
  let pageHeight = _settings.pageHeight
  let pageOrientation = 'p'
  const padding = _settings.padding
  _settings.returnAction = '' + _settings.returnAction.toLowerCase().trim()

  // For cors bugs and rendering issues
  // images are base64 encoded and replaced
  // after image rendering
  var srcList = []
  const imgList = (src) => {
    srcList.push(src)
  }

  // Page layout configuration
  if (_settings.pageHeight === null || _settings.pageWidth === null) {
    listOfPages.each(getPageSizes)
    pageHeight = pageHeight + (padding * 2)
    pageWidth = pageWidth + (padding * 2)
  }

  function getPageSizes (domNode) {
    const height = domNode.offsetHeight || domNode.clientHeight
    pageHeight = height > pageHeight ? height : pageHeight
    heightList.push(height)

    const width = domNode.offsetWidth || domNode.clientWidth
    pageWidth = width > pageWidth ? width : pageWidth
    widthList.push(width)
  }

  if (pageHeight < pageWidth) {
    pageOrientation = 'l'
  }

  const pdfConfig = {
    orientation: pageOrientation,
    unit: _settings.pageUnits,
    format: [pageWidth, pageHeight],
    putOnlyUsedFonts: true,
    floatPrecision: 16
  }

  const pdf = new JsPDF(pdfConfig).compatAPI()

  pdf.setDocumentProperties({
    title: _settings.title,
    author: _settings.author
  })

  const setUp = () => {
    const bodyNode = window.document.querySelector('body')
    bodyNode.classList.add(_settings.captureActiveClass)
    bodyNode.appendChild('<div class="vti__progressCapture"><div class="vti__progressBar"></div></div>')
  }

  const cleanUp = () => {
    const container = document.querySelector(_settings.target)
    container.querySelectorAll('img').forEach((imageNode, index) => {
      imageNode.src = srcList[index]
    })
    const childrenCanvases = [...container.querySelectorAll('.screenShotTempCanvas')]
    childrenCanvases.forEach(node => node.remove())

    const childrenImg = [...container.querySelectorAll('.tempHide')]
    childrenImg.forEach(node => {
      node.classList.remove('tempHide')
      node.classList.remove('vti__hidden')
    })

    window.document.querySelector('body').classList.remove(_settings.captureActiveClass)
    window.document.querySelector('.vti__progressCapture').remove()
    window.document.querySelector('body').classList.remove(_settings.captureActiveClass)
  }

  function assemblePdfPages (canvasObj) {
    const maxW = (widthList[counterI] + padding)
    const maxH = (heightList[counterI] + padding)

    pdf.addImage(canvasObj.toDataURL('image/jpeg'), 'JPEG', (padding / 2), (padding / 2), (maxW), (maxH))
    counterI++
    window.document.querySelector('.vti__progressBar').style.width(100 - ((counterI / nRendered) * 100) + '%')

    if (counterI < nRendered) {
      pdf.addPage([pageWidth, pageHeight], pageOrientation)
    } else {
      cleanUp()
    }
  }

  // Start Routine
  setUp()
  svgToCanvas(_settings.target)
  imgTo64(_settings.target, imgList)

  console.log(listOfPages.length)

  for (let index = 0; index < listOfPages.length; index++) {
    const page = listOfPages[index]
    await canvasExport(page, assemblePdfPages)
    console.log('await')
  }

  cleanUp()

  if (_settings.returnAction === 'download') {
    pdf.save(fileName)
    return pdf.output('datauristring')
  } else if (_settings.returnAction === 'base64') {
    return pdf.output('datauristring')
  } else if (_settings.returnAction === 'newwindow') {
    return pdf.output('dataurlnewwindow')
  } else if (_settings.returnAction === 'blob') {
    return pdf.output('blob')
  } else if (_settings.returnAction === 'clipboard') {
    const blobObj = pdf.output('blob')
    // eslint-disable-next-line no-undef
    const item = new ClipboardItem({ 'image/png': blobObj })
    navigator.clipboard.write([item])
    return blobObj
  }

  return pdf.output('dataurlstring')
}
