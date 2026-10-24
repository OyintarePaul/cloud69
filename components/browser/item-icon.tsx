import { FolderIcon } from "lucide-react";
import { getFileKind } from "@/lib/file-types";
import { cn } from "@/lib/utils";

export function ItemIcon({
    mime,
    className,
}: {
    /** null = folder */
    mime: string | null;
    className?: string;
}) {
    const Icon = mime === null ? FolderIcon : getFileKind(mime).Icon;
    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md border border-foreground bg-muted",
                className,
            )}
        >
            <Icon className="size-4" />
        </span>
    );
}
