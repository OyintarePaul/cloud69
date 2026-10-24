import {
    FileAudioIcon,
    FileIcon,
    FileImageIcon,
    FileTextIcon,
    FileVideoIcon,
    type LucideIcon,
} from "lucide-react";

export type FileKind = { label: string; Icon: LucideIcon };

export function getFileKind(mime: string): FileKind {
    if (mime.startsWith("image/"))
        return { label: "Image", Icon: FileImageIcon };
    if (mime === "application/pdf") return { label: "PDF", Icon: FileTextIcon };
    if (mime.startsWith("video/"))
        return { label: "Video", Icon: FileVideoIcon };
    if (mime.startsWith("audio/"))
        return { label: "Audio", Icon: FileAudioIcon };
    if (mime.startsWith("text/")) return { label: "Text", Icon: FileTextIcon };
    return { label: "File", Icon: FileIcon };
}
