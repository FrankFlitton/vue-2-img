import $ from 'jquery'
var canvg = require('canvg-browser')

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
  if (domElement.currentStyle) {
    return domElement.currentStyle[camelize(styleProp)]
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(domElement, null)
      .getPropertyValue(styleProp)
  } else {
    return domElement.style[camelize(styleProp)]
  }
}

const camelize = function (str) {
  return str.replace(/\-(\w)/g, function (str, letter) {
    return letter.toUpperCase()
  })
}

export default svgToCanvas
