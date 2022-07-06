import html2canvas from "html2canvas";

export const canvasExport = async (
  domNode: HTMLElement,
  callback: (data: HTMLCanvasElement) => HTMLCanvasElement
): Promise<HTMLCanvasElement> => {
  return html2canvas(domNode, {
    allowTaint: true,
    useCORS: true,
    foreignObjectRendering: true,
    imageTimeout: 5000,
    backgroundColor: "#ffffff",
    logging: false,
    scale: 2,
  }).then((data) => {
    if (callback) return callback(data);
    return data;
  });
};
