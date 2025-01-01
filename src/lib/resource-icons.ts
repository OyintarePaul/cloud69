import ImageIcon from "@/assets/icons/image-icon.png";
import PDFIcon from "@/assets/icons/pdf.png";
import MSWordIcon from "@/assets/icons/msword.png";
import { image, msword, pdf } from "./mime-types";

const mimeTypeIcons = new Map<string[], string>([
  [image, ImageIcon],
  [pdf, PDFIcon],
  [msword, MSWordIcon],
]);

export const getIconSrc = (mimeType: string) => {
  for (const [key, value] of mimeTypeIcons) {
    if (key.includes(mimeType)) {
      return value;
    }
  }
};
