import $ from 'jquery'
import { getStyle } from '../../utils'
var canvg = require('canvg-browser')

export const svgToCanvas = (target) => {
  var svgElements = $(target).find('svg')

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
