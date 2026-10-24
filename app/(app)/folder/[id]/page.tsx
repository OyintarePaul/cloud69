import { FolderOpenIcon } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/browser/breadcrumbs";
import { EmptyState } from "@/components/browser/empty-state";
import { FileGrid } from "@/components/browser/file-grid";
import { FileList } from "@/components/browser/file-list";
import { FolderSkeleton } from "@/components/browser/folder-skeleton";
import { SortMenu } from "@/components/browser/sort-menu";
import { TruncationNotice } from "@/components/browser/truncation-notice";
import { requireUser } from "@/lib/auth";
import { getFolderContents, LIST_LIMIT } from "@/lib/data/browse";
import {
    parseBrowseParams,
    parseViewMode,
    type ResolvedBrowseParams,
    VIEW_COOKIE,
} from "@/lib/schemas/browse";
import { isFolderId } from "@/lib/schemas/ids";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function FolderPage({ params, searchParams }: Props) {
    return (
        <Suspense fallback={<FolderSkeleton />}>
            <FolderContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}

async function FolderContent({ params, searchParams }: Props) {
    const { id } = await params;
    if (!isFolderId(id)) notFound(); // R18: before any query

    const user = await requireUser(`/folder/${id}`);
    const parsed = parseBrowseParams(await searchParams);

    // View order: the URL wins, then the saved cookie, then "list".
    const store = await cookies();
    const savedView = parseViewMode(store.get(VIEW_COOKIE)?.value);
    const browse: ResolvedBrowseParams = {
        ...parsed,
        view: parsed.view ?? savedView ?? "list",
    };

    const { crumbs, folders, files, total, truncated } =
        await getFolderContents(id, user.id, browse);

    return (
        <main className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <Breadcrumbs crumbs={crumbs} />
                </div>
                {browse.view === "grid" && total > 0 && (
                    <SortMenu
                        view={browse.view}
                        sort={browse.sort}
                        dir={browse.dir}
                    />
                )}
            </div>

            {truncated && <TruncationNotice limit={LIST_LIMIT} total={total} />}

            {total === 0 ? (
                <EmptyState
                    icon={FolderOpenIcon}
                    title="This folder is empty"
                    description="Files and folders you add will show up here."
                />
            ) : browse.view === "grid" ? (
                <FileGrid folders={folders} files={files} />
            ) : (
                <FileList folders={folders} files={files} {...browse} />
            )}
        </main>
    );
}
