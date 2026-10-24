import { FormattedDate } from "@/components/browser/formatted-date";
import { ItemCard } from "@/components/browser/item-card";
import { formatBytes } from "@/lib/format";
import type { FileItem, FolderItem } from "@/lib/types";

type Props = {
    folders: FolderItem[];
    files: FileItem[];
};

export function FileGrid({ folders, files }: Props) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {folders.map((folder) => (
                <ItemCard
                    key={folder.id}
                    name={folder.name}
                    mime={null}
                    href={`/folder/${folder.id}`}
                    meta={
                        <>
                            Folder · <FormattedDate value={folder.updated_at} />
                        </>
                    }
                />
            ))}

            {files.map((file) => (
                <ItemCard
                    key={file.id}
                    name={file.name}
                    mime={file.mime_type}
                    meta={
                        <>
                            {formatBytes(file.size_bytes)} ·{" "}
                            <FormattedDate value={file.updated_at} />
                        </>
                    }
                />
            ))}
        </div>
    );
}
