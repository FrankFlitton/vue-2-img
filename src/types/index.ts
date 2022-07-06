export interface Vue2ImgWindow extends Window {
  vue2img: () => {
    image: (options: Vue2ImgImageSettings) => Promise<Base64String | Blob>;
    pdf: (options: Vue2ImgPdfSettings) => Promise<Base64String | Blob>;
  };
}

export type Base64String = string;

export interface Vue2ImgImageSettings {
  target: string;
  captureHiddenClass: string;
  captureShowClass: string;
  captureActiveClass: string;
  fileName: string;
  fileType: "png" | string;
  returnAction:
    | "download"
    | "blob"
    | "base64"
    | "canvas"
    | "clipboard"
    | "newWindow";
  callback: (img: Base64String) => Base64String;
}

export interface Vue2ImgPdfSettings {
  target: string;
  pageTarget: string;
  captureHiddenClass: string;
  captureShowClass: string;
  captureActiveClass: string;
  title: string;
  author: string;
  maxItems: number;
  fileNameSuffix: string;
  pageWrapper: string;
  padding: number;
  devStyle: boolean;
  pageHeight: number | null;
  pageWidth: number | null;
  pageUnits: "pt" | "mm" | "cm" | "in" | "px" | "em" | "ex" | "pc";
  returnAction: "download" | "blob" | "base64" | "clipboard" | "newwindow";
}
