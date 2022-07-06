import { getStyle } from "../../utils";
import { Canvg } from "canvg";

export const svgToCanvas = (target: string) => {
  const svgQ = window.document.querySelectorAll(`${target} svg`);
  const svgElements = svgQ
    ? [...window.document.querySelectorAll(`${target} svg`)]
    : [];

  // replace all svgs with a temp canvas
  svgElements.forEach(async (svgNode) => {
    let canvas = null;
    let xml = null;

    // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
    const emNodes = [...svgNode.querySelectorAll("[style*=em]")];
    emNodes.forEach((emNode) => {
      (emNode as HTMLElement).style.fontSize = getStyle(emNode, "font-size");
    });

    canvas = document.createElement("canvas");
    canvas.classList.add("screenShotTempCanvas");
    const context = canvas.getContext("2d");

    // convert SVG into a XML string
    xml = new window.XMLSerializer().serializeToString(svgNode);

    // Removing the name space as IE throws an error
    xml = xml.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, "");

    // draw the SVG onto a canvas
    if (context !== null) {
      const v = await Canvg.from(context, xml);
      v.start();
    }

    // After the targetElement itself.
    svgNode.insertAdjacentElement("afterend", canvas);

    // hide the SVG element
    svgNode.classList.add("tempHide");
    svgNode.classList.add("vti__hidden");
  });
};
