import html2canvas from 'html2canvas'
import $ from 'jquery'
import { jsPDF as JsPDF } from 'jsPDF'
import svgToCanvas from './svgToCanvas'
import imgTo64 from './imgTo64'

const vue2img = () => {
  const image = (_options) => {
    const _defaults = {
      target: 'body',
      captureHiddenClass: 'vti__hidden',
      captureShowClass: 'vti__show',
      captureActiveClass: 'vti__active',
      fileName: 'ImageCapture',
      fileType: 'png'
    }

    // Merge defaults and options, without modifying defaults
    const _settings = $.extend({}, _defaults, _options)

    // const fileName = _settings.fileName + getDate() + '.' + _settings.fileType
    const fileName = _settings.fileName + getDate() + '.' + _settings.fileType

    // For cors bugs and rendering issues
    // images are base64 encoded and replaced
    // after image rendering
    var srcList = []
    const imgList = (src) => {
      srcList.push(src)
    }

    // Functions
    const setUp = () => {
      $('body').addClass(_settings.captureActiveClass)
    }

    const cleanUp = (target) => {
      document.querySelectorAll(target + ' img').forEach((imageNode, index) => {
        imageNode = srcList[index]
      })
      $(_settings.target).find('.screenShotTempCanvas').remove()
      $(_settings.target).find('.tempHide').show().removeClass('tempHide')
      $('body').removeClass(_settings.captureActiveClass)
    }

    const printPNG = () => {
      console.log(_settings.target, $(_settings.target)[0])
      html2canvas($(_settings.target)[0], {
        async: true,
        allowTaint: true,
        useCORS: true,
        timeout: 1,
        letterRendering: true,
        background: '#ffffff',
        logging: false,
        scale: 2
      })
      .then(data => {
        console.log(data)
        pngExport(data)
      })
    }

    function pngExport (canvasObj) {
      saveAs(canvasObj.toDataURL('image/' + _settings.fileType), fileName)
    }

    const saveAs = (uri, filename) => {
      var link = document.createElement('a')
      if (typeof link.download === 'string') {
        link.href = uri
        link.download = filename

        // Firefox requires the link to be in the body
        document.body.appendChild(link)

        // simulate click
        link.click()

        // remove the link when done
        document.body.removeChild(link)
      } else {
        window.open(uri)
      }
    }

    // Start Routine
    setUp()
    svgToCanvas(_settings.target)
    imgTo64(_settings.target, imgList)
    printPNG()
    cleanUp(_settings.target)
  } // end img

  function pdf (_options) {
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
      pageUnits: 'pt'
    }

    // Merge defaults and options, without modifying defaults
    const _settings = $.extend({}, _defaults, _options)
    // var _targetObject = $(_settings.target)[0]
    const heightList = []
    const widthList = []
    const pdfPageTarget = _settings.target + ' ' + _settings.pageTarget
    let counterI = 0
    const listOfPages = $(pdfPageTarget)
    const nRendered = listOfPages.length
    const fileName = _settings.title + _settings.fileNameSuffix + '.pdf'
    let pageWidth = _settings.pageWidth
    let pageHeight = _settings.pageHeight
    let pageOrientation = 'p'
    const padding = _settings.padding

    // Page layout configuration
    if (_settings.pageHeight === null || _settings.pageWidth === null) {
      listOfPages.each(getPageSizes)
      pageHeight = pageHeight + (padding * 2)
      pageWidth = pageWidth + (padding * 2)
    }

    function getPageSizes () {
      console.log($(this).height())
      console.log($(this).width())
      pageHeight = $(this).height() > pageHeight ? $(this).height() : pageHeight
      heightList.push($(this).height())

      pageWidth = $(this).width() > pageWidth ? $(this).width() : pageWidth
      widthList.push($(this).width())
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

    // pdf.setProperties({
    //   title: _settings.title,
    //   author: _settings.author
    // })

    const setUp = () => {
      $('body').addClass(_settings.captureActiveClass)
      $('body').append('<div class="vti__progressCapture"><div class="vti__progressBar"></div></div>')
    }

    const cleanUp = () => {
      $(_settings.target).find('.screenShotTempCanvas').remove()
      $(_settings.target).find('.tempHide').show().removeClass('tempHide')
      $('body').removeClass(_settings.captureActiveClass)
    }

    const assembleImages = (key, jObject, callback) => {
      html2canvas(jObject, {
        async: false,
        allowTaint: true,
        useCORS: true,
        letterRendering: true,
        background: '#ffffff',
        scale: 2
      })
        .then(assemblePdfPages)
    }

    const assemblePdfPages = (canvasObj, maxW, maxH) => {
      maxW = (widthList[counterI] + padding)
      maxH = (heightList[counterI] + padding)

      pdf.addImage(canvasObj.toDataURL('image/jpeg'), 'JPEG', (padding / 2), (padding / 2), (maxW), (maxH))
      counterI++
      console.log(counterI / nRendered)
      $('.vti__progressBar').width(100 - ((counterI / nRendered) * 100) + '%')

      if (counterI === nRendered) {
        pdf.save(fileName)
        cleanUp()
        $('.vti__progressCapture').remove
        $('body').removeClass(_settings.captureActiveClass)
      } else {
        pdf.addPage([pageWidth, pageHeight], pageOrientation)
      }
    }

    // Start Routine
    setUp()
    svgToCanvas(_settings.target)
    imgTo64(_settings.target)
    $.each(listOfPages, assembleImages)
  }

  // Print date
  const getDate = function () {
    var objToday = new Date()
    var day = objToday.getDay()
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var curMonth = months[objToday.getMonth()]
    var curYear = objToday.getFullYear()
    var curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? '0' + objToday.getHours() : objToday.getHours())
    var curMinute = objToday.getMinutes() < 10 ? '0' + objToday.getMinutes() : objToday.getMinutes()
    var curSeconds = objToday.getSeconds() < 10 ? '0' + objToday.getSeconds() : objToday.getSeconds()
    var today = curHour + ':' + curMinute + '.' + curSeconds + '_' + day + '_' + curMonth + '_' + curYear

    return today
    // document.getElementsByTagName('h1')[0].textContent = today
  }

  return {
    image: image,
    pdf: pdf
  }
}

export default vue2img
