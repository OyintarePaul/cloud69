import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/browser/breadcrumbs";
import { FileList } from "@/components/browser/file-list";
import { requireUser } from "@/lib/auth";
import { getFolderContents } from "@/lib/data/browse";
import { parseBrowseParams } from "@/lib/schemas/browse";
import { isFolderId } from "@/lib/schemas/ids";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function FolderPage({ params, searchParams }: Props) {
    return (
        <Suspense fallback={<p className="p-6">Loading…</p>}>
            <FolderContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}

async function FolderContent({ params, searchParams }: Props) {
    const { id } = await params;
    if (!isFolderId(id)) notFound(); // R18: before any query

    const user = await requireUser(`/folder/${id}`);
    const browse = parseBrowseParams(await searchParams);
    const { crumbs, folders, files, total } = await getFolderContents(
        id,
        user.id,
        browse,
    );

    return (
        <main className="space-y-4 p-6">
            <Breadcrumbs crumbs={crumbs} />
            {total === 0 ? (
                <p className="text-sm text-muted-foreground">
                    This folder is empty.
                </p>
            ) : (
                <FileList folders={folders} files={files} {...browse} />
            )}
        </main>
    );
}
