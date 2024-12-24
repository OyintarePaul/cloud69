import ImageIcon from "@/assets/icons/image-icon.png";
import PDFIcon from "@/assets/icons/pdf.png";

const fileExtensionIcons = new Map<string[], string>([
  [["jpg", "png", "jpeg", "jfif"], ImageIcon],
  [["pdf"], PDFIcon],
]);

export const getIconSrc = (fileExtension: string) => {
  for (const [key, value] of fileExtensionIcons) {
    if (key.includes(fileExtension)) {
      return value;
    }
  }
};
