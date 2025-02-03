import ImageIcon from "@/assets/icons/image-icon.png";
import PDFIcon from "@/assets/icons/pdf-icon.png";
import AudioIcon from "@/assets/icons/music-icon.png";
import MSWordIcon from "@/assets/icons/ms-word-icon.png";
import VideoIcon from "@/assets/icons/video-icon.png";
import ZipIcon from "@/assets/icons/zip-icon.png";
import { image, msword, pdf, audio, video, archive } from "./mime-types";

const mimeTypeIcons = new Map<string[], string>([
  [image, ImageIcon],
  [pdf, PDFIcon],
  [msword, MSWordIcon],
  [audio, AudioIcon],
  [video, VideoIcon],
  [archive, ZipIcon],
]);

export const getIconSrc = (mimeType: string) => {
  for (const [key, value] of mimeTypeIcons) {
    if (key.includes(mimeType)) {
      return value;
    }
  }
};
