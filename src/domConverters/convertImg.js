import $ from 'jquery'
import { canvasExport, imgTo64, svgToCanvas } from './helpers'
import {
  getDate
} from '../utils'

export const convertImg = async (_options) => {
  const _defaults = {
    target: 'body',
    captureHiddenClass: 'vti__hidden',
    captureShowClass: 'vti__show',
    captureActiveClass: 'vti__active',
    fileName: 'ImageCapture',
    fileType: 'png',
    returnAction: 'download',
    callback: (img) => {
      return img
    }
  }

  // Merge defaults and options, without modifying defaults
  const _settings = $.extend({}, _defaults, _options)
  const fileName = _settings.fileName + getDate() + '.' + _settings.fileType
  _settings.returnAction = '' + _settings.returnAction.toLowerCase().trim()

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
    const container = document.querySelector(target)
    container.querySelectorAll('img').forEach((imageNode, index) => {
      imageNode = srcList[index]
    })
    $(_settings.target).find('.screenShotTempCanvas').remove()
    $(_settings.target).find('.tempHide').show().removeClass('tempHide')
    $('body').removeClass(_settings.captureActiveClass)
  }

  function imageExport (canvasObj) {
    return canvasObj.toDataURL('image/' + _settings.fileType)
  }

  function downloadFile (uri) {
    var link = document.createElement('a')
    const downloadName = fileName
    if (typeof link.download === 'string') {
      link.href = uri
      link.download = downloadName

      // Firefox requires the link to be in the body
      document.body.appendChild(link)

      // simulate click
      link.click()

      // remove the link when done
      document.body.removeChild(link)
    } else {
      window.open(uri)
    }
    return uri
  }

  // Start Routine
  setUp()
  svgToCanvas(_settings.target)
  imgTo64(_settings.target, imgList)

  // Return image to use in desired format
  // Fire callback to handle file type

  const canvas = await canvasExport($(_settings.target)[0])

  let outputFile = null
  if (_settings.returnAction === 'download') {
    outputFile = imageExport(canvas)
    _settings.callback(outputFile)
    downloadFile(outputFile)
  } else if (_settings.returnAction === 'canvas') {
    outputFile = imageExport(canvas)
    _settings.callback(outputFile)
  } else if (_settings.returnAction === 'blob') {
    canvas.toBlob((blob) => {
      outputFile = blob
    }, 'image/' + _settings.fileType)
    _settings.callback(outputFile)
  } else if (_settings.returnAction === 'newwindow') {
    outputFile = imageExport(canvas)
    var nW = global.open(outputFile)
    if (nW || typeof safari === 'undefined') outputFile = nW
  } else if (_settings.returnAction === 'base64') {
    outputFile = imageExport(canvas)
  } else if (_settings.returnAction === 'clipboard') {
    canvas.toBlob((blob) => {
      outputFile = blob
      // eslint-disable-next-line no-undef
      const item = new ClipboardItem({
        'image/png': outputFile
      })
      navigator.clipboard.write([item])
    }, 'image/' + _settings.fileType)
  }
  _settings.callback(outputFile)

  cleanUp(_settings.target)
  return outputFile
}
