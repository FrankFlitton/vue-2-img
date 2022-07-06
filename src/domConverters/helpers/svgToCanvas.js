import { getStyle } from '../../utils'
import { Canvg as canvg } from 'canvg'

export const svgToCanvas = (target) => {
  var svgElements = [...window.document.querySelectorAll(`${target} svg`)]

  // replace all svgs with a temp canvas
  svgElements.forEach(async (svgNode) => {
    var canvas = null
    var xml = null

    // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
    const emNodes = [...svgNode.querySelectorAll('[style*=em]')]
    emNodes.forEach(emNode => {
      emNode.style.fontSize = getStyle(emNode, 'font-size')
    })

    canvas = document.createElement('canvas')
    canvas.className = 'screenShotTempCanvas'
    // convert SVG into a XML string
    xml = (new window.XMLSerializer()).serializeToString(this)

    // Removing the name space as IE throws an error
    xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '')

    // draw the SVG onto a canvas
    const v = await canvg(canvas, xml)
    v.start()
    svgNode.parentNode.insertAfter(svgNode, canvas)
    // hide the SVG element
    svgNode.classList.add('tempHide')
    svgNode.classList.add('vti__hidden')
  })
}
