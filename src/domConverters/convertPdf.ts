import { jsPDF as JsPDF, type jsPDFOptions } from "jspdf";
import { canvasExport, svgToCanvas, imgTo64 } from "./helpers";
import { getDate } from "../utils";
import type { Base64String, Vue2ImgPdfSettings } from "../types";

export const convertPdf = async (
  _options: Vue2ImgPdfSettings
): Promise<Base64String | Blob> => {
  const _defaults: Vue2ImgPdfSettings = {
    target: "body",
    pageTarget: ".pageTarget",
    captureHiddenClass: "vti__hidden",
    captureShowClass: "vti__show",
    captureActiveClass: "vti__active",
    title: "pdfCapture",
    author: "html-image-capture-service",
    maxItems: 50,
    fileNameSuffix: getDate(),
    pageWrapper: ".row",
    padding: 5,
    devStyle: false,
    pageHeight: null,
    pageWidth: null,
    pageUnits: "pt",
    returnAction: "download",
  };

  // Merge defaults and options, without modifying defaults
  const _settings = { ..._defaults, ..._options };
  const heightList: number[] = [];
  const widthList: number[] = [];
  const pdfPageTarget = _settings.target + " " + _settings.pageTarget;
  let counterI = 0;
  const listOfPages = [...window.document.querySelectorAll(pdfPageTarget)];
  const nRendered = listOfPages.length;
  const fileName = _settings.title + _settings.fileNameSuffix + ".pdf";
  let pageWidth = _settings.pageWidth;
  let pageHeight = _settings.pageHeight;
  let pageOrientation: "p" | "portrait" | "l" | "landscape" = "p";
  const padding = _settings.padding;

  // For cors bugs and rendering issues
  // images are base64 encoded and replaced
  // after image rendering
  const srcList: string[] = [];
  const imgList = (src: string) => {
    srcList.push(src);
  };

  // Page layout configuration
  if (_settings.pageHeight === null || _settings.pageWidth === null) {
    for (let i = 0; i < listOfPages.length; i++) {
      const element = listOfPages[i];
      getPageSizes(element as HTMLElement);
    }
    pageHeight = (pageHeight || 0) + padding * 2;
    pageWidth = (pageWidth || 0) + padding * 2;
  }

  function getPageSizes(domNode: HTMLElement) {
    const height = domNode.offsetHeight || domNode.clientHeight;
    pageHeight = height > (pageHeight || 0) ? height : pageHeight;
    heightList.push(height);

    const width = domNode.offsetWidth || domNode.clientWidth;
    pageWidth = width > (pageWidth || 0) ? width : pageWidth;
    widthList.push(width);
  }

  if ((pageHeight || 0) < (pageWidth || 0)) {
    pageOrientation = "l";
  }

  const pdfConfig: Partial<jsPDFOptions> = {
    orientation: pageOrientation === "l" ? "landscape" : "portrait",
    unit: _settings.pageUnits,
    format: !pageWidth || !pageHeight ? "letter" : [pageWidth, pageHeight],
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  };

  const pdf = new JsPDF(pdfConfig);

  pdf.compatAPI();

  pdf.setDocumentProperties({
    title: _settings.title,
    author: _settings.author,
  });

  const setUp = () => {
    const bodyNode = window.document.querySelector("body");
    bodyNode?.classList.add(_settings.captureActiveClass);
    const div = document.createElement("div");
    div.innerHTML =
      '<div class="vti__progressCapture"><div class="vti__progressBar"></div></div>';
    bodyNode?.appendChild(div);
  };

  const cleanUp = () => {
    const container = document.querySelector(_settings.target);
    container?.querySelectorAll("img")?.forEach((imageNode, index) => {
      imageNode.src = srcList[index];
    });
    const childrenCanvases = container
      ? [...container.querySelectorAll(".screenShotTempCanvas")]
      : [];
    childrenCanvases.forEach((node) => node.remove());

    const childrenImg = container
      ? [...container.querySelectorAll(".tempHide")]
      : [];
    childrenImg.forEach((node) => {
      node.classList.remove("tempHide");
      node.classList.remove("vti__hidden");
    });

    window.document
      .querySelector("body")
      ?.classList?.remove(_settings.captureActiveClass);
    window.document.querySelector(".vti__progressCapture")?.remove();
    window.document
      .querySelector("body")
      ?.classList?.remove(_settings.captureActiveClass);
  };

  function assemblePdfPages(canvasObj: HTMLCanvasElement) {
    const maxW = widthList[counterI] + padding;
    const maxH = heightList[counterI] + padding;

    pdf.addImage(
      canvasObj.toDataURL("image/jpeg"),
      "JPEG",
      padding / 2,
      padding / 2,
      maxW,
      maxH
    );
    counterI++;
    const progressBar = window.document.querySelector(
      ".vti__progressBar"
    ) as HTMLElement;
    if (progressBar)
      progressBar.style.width = 100 - (counterI / nRendered) * 100 + "%";

    if (counterI < nRendered) {
      pdf.addPage([pageWidth || 0, pageHeight || 0], pageOrientation);
    } else {
      cleanUp();
    }
    return canvasObj;
  }

  // Start Routine
  setUp();
  svgToCanvas(_settings.target);
  imgTo64(_settings.target, imgList);

  console.log(listOfPages.length);

  for (let index = 0; index < listOfPages.length; index++) {
    const page = listOfPages[index];
    await canvasExport(page as HTMLElement, assemblePdfPages);
    console.log("await");
  }

  cleanUp();

  if (_settings.returnAction === "download") {
    pdf.save(fileName);
    return pdf.output("datauristring");
  } else if (_settings.returnAction === "base64") {
    return pdf.output("datauristring");
  } else if (_settings.returnAction === "newwindow") {
    pdf.output("dataurlnewwindow");
    return pdf.output("datauristring");
  } else if (_settings.returnAction === "blob") {
    return pdf.output("blob");
  } else if (_settings.returnAction === "clipboard") {
    const blobObj = pdf.output("blob");
    // eslint-disable-next-line no-undef
    const item = new ClipboardItem({ "image/png": blobObj });
    navigator.clipboard.write([item]);
    return pdf.output("dataurlstring");
  }

  return pdf.output("dataurlstring");
};
