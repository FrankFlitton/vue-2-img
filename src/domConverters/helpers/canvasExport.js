import html2canvas from 'html2canvas'

export function canvasExport (domNode, callback) {
  return html2canvas(domNode, {
    async: true,
    allowTaint: true,
    useCORS: true,
    timeout: 1,
    letterRendering: true,
    background: '#ffffff',
    logging: false,
    scale: 2
  }).then((data) => {
    if (callback) return callback(data)
    return data
  })
}
