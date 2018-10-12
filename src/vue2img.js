import html2canvas from 'html2canvas'
import $ from 'jquery'
import jsPDF from 'jsPDF'
var canvg = require('canvg-browser')

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

    // Functions
    const setUp = () => {
      $('body').addClass(_settings.captureActiveClass)
    }

    const cleanUp = () => {
      $(_settings.target).find('.screenShotTempCanvas').remove()
      $(_settings.target).find('.tempHide').show().removeClass('tempHide')
      $('body').removeClass(_settings.captureActiveClass)
    }

    const svgToCanvas = (target) => {
      var svgElements = $(target).find('svg')
      console.log(target, svgElements)
      // replace all svgs with a temp canvas
      svgElements.each(function () {
        var canvas = null
        var xml = null

        // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
        $.each($(this).find('[style*=em]'), function (index, domElement) {
          $(this).css('font-size', getStyle(domElement, 'font-size'))
        })

        canvas = document.createElement('canvas')
        canvas.className = 'screenShotTempCanvas'
        // convert SVG into a XML string
        xml = (new window.XMLSerializer()).serializeToString(this)

        // Removing the name space as IE throws an error
        xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '')

        // draw the SVG onto a canvas
        canvg(canvas, xml)
        $(canvas).insertAfter(this)
        // hide the SVG element
        $(this).attr('class', 'tempHide')
        $(this).hide()
      })
    }

    const getStyle = function (domElement, styleProp) {
      var camelize = function (str) {
        return str.replace(/\-(\w)/g, function (str, letter) {
          return letter.toUpperCase()
        })
      }

      if (domElement.currentStyle) {
        return domElement.currentStyle[camelize(styleProp)]
      } else if (document.defaultView && document.defaultView.getComputedStyle) {
        return document.defaultView.getComputedStyle(domElement, null)
          .getPropertyValue(styleProp)
      } else {
        return domElement.style[camelize(styleProp)]
      }
    }

    const printPNG = () => {
      console.log(_settings.target, $(_settings.target)[0])
      html2canvas($(_settings.target)[0], {
        async: true,
        allowTaint: true,
        taintTest: false,
        timeout: 1,
        letterRendering: true,
        background: '#ffffff',
        logging: false
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
    printPNG()
    cleanUp()
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
    const JSPDF = jsPDF

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

    const pdf = new JSPDF(pageOrientation, _settings.pageUnits, [pageWidth, pageHeight])
    pdf.setProperties({
      title: _settings.title,
      author: _settings.author
    })

    const setUp = () => {
      $('body').addClass(_settings.captureActiveClass)
      $('body').append('<div class="vti__progressCapture"><div class="vti__progressBar"></div></div>')
    }

    const svgToCanvas = (target) => {
      var svgElements = $(target).find('svg')

      // replace all svgs with a temp canvas
      svgElements.each(function () {
        var canvas, xml

        // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
        $.each($(this).find('[style*=em]'), function (index, domElement) {
          $(this).css('font-size', getStyle(domElement, 'font-size'))
        })

        canvas = document.createElement('canvas')
        canvas.className = 'screenShotTempCanvas'
        // convert SVG into a XML string
        xml = (new window.XMLSerializer()).serializeToString(this)

        // Removing the name space as IE throws an error
        xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '')

        // draw the SVG onto a canvas
        canvg(canvas, xml)
        $(canvas).insertAfter(this)
        // hide the SVG element
        $(this).attr('class', 'tempHide')
        $(this).hide()
      })
    }

    const getStyle = (domElement, styleProp) => {
      var camelize = function (str) {
        return str.replace(/\-(\w)/g, function (str, letter) {
          return letter.toUpperCase()
        })
      }

      if (domElement.currentStyle) {
        return domElement.currentStyle[camelize(styleProp)]
      } else if (document.defaultView && document.defaultView.getComputedStyle) {
        return document.defaultView.getComputedStyle(domElement, null)
          .getPropertyValue(styleProp)
      } else {
        return domElement.style[camelize(styleProp)]
      }
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
        taintTest: false,
        letterRendering: true,
        background: '#ffffff'
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
        pdf.addPage()
      }
    }

    // Start Routine
    setUp()
    svgToCanvas(_settings.target)
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
