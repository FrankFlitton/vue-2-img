import type { Base64String } from "../../types";

export const base64ToBlob = (base64: Base64String) => {
  const bytes = window.atob(base64);
  const buffer = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([buffer], { type: "image/png" });
};
