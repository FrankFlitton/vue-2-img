import type { Base64String, Vue2ImgImageSettings } from "@/types";
import { base64ToBlob, canvasExport, imgTo64, svgToCanvas } from "./helpers";
import { getDate } from "../utils";

export const convertImg = async (
  _options: Vue2ImgImageSettings
): Promise<Base64String | Blob> => {
  const _defaults: Vue2ImgImageSettings = {
    target: "body",
    captureHiddenClass: "vti__hidden",
    captureShowClass: "vti__show",
    captureActiveClass: "vti__active",
    fileName: "ImageCapture",
    fileType: "png",
    returnAction: "download",
    callback: (img) => {
      return img;
    },
  };

  // Merge defaults and options, without modifying defaults
  const _settings: Vue2ImgImageSettings = { ..._defaults, ..._options };
  const fileName = _settings.fileName + getDate() + "." + _settings.fileType;

  // For cors bugs and rendering issues
  // images are base64 encoded and replaced
  // after image rendering
  const srcList: string[] = [];
  const imgList = (src: string) => {
    srcList.push(src);
  };

  // Functions
  const setUp = () => {
    window.document
      .querySelector("body")
      ?.classList.add(_settings.captureActiveClass);
  };

  const cleanUp = () => {
    const container = document.querySelector(_settings.target);
    container?.querySelectorAll("img").forEach((imageNode, index) => {
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
  };

  function imageExport(canvasObj: HTMLCanvasElement): string {
    return canvasObj.toDataURL("image/" + _settings.fileType);
  }

  function downloadFile(uri: string) {
    const link = document.createElement("a");
    const downloadName = fileName;
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = downloadName;

      // Firefox requires the link to be in the body
      document.body.appendChild(link);

      // simulate click
      link.click();

      // remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
    return uri;
  }

  // Start Routine
  setUp();
  svgToCanvas(_settings.target);
  imgTo64(_settings.target, imgList);

  // Return image to use in desired format
  // Fire callback to handle file type

  const targetNode = window.document.querySelector(
    _settings.target
  ) as HTMLElement;
  const canvas = await canvasExport(targetNode, (c) => c);

  let outputFile: Base64String | Blob = "";
  if (_settings.returnAction === "download") {
    const export64 = imageExport(canvas);
    outputFile = _settings.callback(export64);
    downloadFile(outputFile);
  } else if (_settings.returnAction === "canvas") {
    const export64 = imageExport(canvas);
    outputFile = _settings.callback(export64);
  } else if (_settings.returnAction === "blob") {
    const export64 = imageExport(canvas);
    const callbackResult = _settings.callback(export64);
    outputFile = base64ToBlob(callbackResult);
  } else if (_settings.returnAction === "newWindow") {
    const export64 = imageExport(canvas);
    outputFile = _settings.callback(export64);
    window.open(outputFile, "_blank");
  } else if (_settings.returnAction === "base64") {
    const export64 = imageExport(canvas);
    outputFile = _settings.callback(export64);
  } else if (_settings.returnAction === "clipboard") {
    const export64 = imageExport(canvas);
    const callbackResult = _settings.callback(export64);
    outputFile = base64ToBlob(callbackResult);

    const item = new ClipboardItem({
      "image/png": outputFile,
    });
    navigator.clipboard.write([item]);
  }

  cleanUp();
  return outputFile;
};
