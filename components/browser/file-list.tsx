import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { FormattedDate } from "@/components/browser/formatted-date";
import { ItemIcon } from "@/components/browser/item-icon";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getFileKind } from "@/lib/file-types";
import { formatBytes } from "@/lib/format";
import type { BrowseParams, SortField } from "@/lib/schemas/browse";
import type { FileItem, FolderItem } from "@/lib/types";

type Props = {
    folders: FolderItem[];
    files: FileItem[];
} & BrowseParams;

const COLUMNS: { field: SortField; label: string; className?: string }[] = [
    { field: "name", label: "Name" },
    { field: "modified", label: "Modified" },
    { field: "size", label: "Size", className: "text-right" },
    { field: "type", label: "Type" },
];

export function FileList({ folders, files, view, sort, dir }: Props) {
    // Clicking the active column flips the direction. A new column starts
    // ascending, except "modified", which starts newest first.
    function sortHref(field: SortField) {
        const nextDir =
            field === sort
                ? dir === "asc"
                    ? "desc"
                    : "asc"
                : field === "modified"
                  ? "desc"
                  : "asc";
        return `?view=${view}&sort=${field}&dir=${nextDir}`;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    {COLUMNS.map(({ field, label, className }) => {
                        const active = field === sort;
                        return (
                            <TableHead
                                key={field}
                                className={className}
                                aria-sort={
                                    active
                                        ? dir === "asc"
                                            ? "ascending"
                                            : "descending"
                                        : undefined
                                }
                            >
                                <Link
                                    href={sortHref(field)}
                                    className="inline-flex items-center gap-1 hover:underline"
                                >
                                    {label}
                                    {active &&
                                        (dir === "asc" ? (
                                            <ArrowUpIcon className="size-3.5" />
                                        ) : (
                                            <ArrowDownIcon className="size-3.5" />
                                        ))}
                                </Link>
                            </TableHead>
                        );
                    })}
                </TableRow>
            </TableHeader>

            <TableBody>
                {folders.map((folder) => (
                    <TableRow key={folder.id} className="h-11">
                        <TableCell>
                            <Link
                                href={`/folder/${folder.id}`}
                                className="flex items-center gap-3 font-medium hover:underline"
                            >
                                <ItemIcon mime={null} />
                                <span className="truncate">{folder.name}</span>
                            </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                            <FormattedDate value={folder.updated_at} />
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            —
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            Folder
                        </TableCell>
                    </TableRow>
                ))}

                {files.map((file) => (
                    <TableRow key={file.id} className="h-11">
                        <TableCell>
                            <div className="flex items-center gap-3 font-medium">
                                <ItemIcon mime={file.mime_type} />
                                <span className="truncate">{file.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                            <FormattedDate value={file.updated_at} />
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {formatBytes(file.size_bytes)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {getFileKind(file.mime_type).label}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
