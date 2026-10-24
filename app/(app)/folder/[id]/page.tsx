import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/browser/breadcrumbs";
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
    const { crumbs, folders, files, total, truncated } =
        await getFolderContents(id, user.id, browse);

    return (
        <main className="space-y-4 p-6 font-mono text-sm">
            <Breadcrumbs crumbs={crumbs} />
            <p>
                {total} items · sort: {browse.sort} {browse.dir} · view:{" "}
                {browse.view}
                {truncated ? " · truncated" : ""}
            </p>
            <ul>
                {folders.map((f) => (
                    <li key={f.id}>[folder] {f.name}</li>
                ))}
                {files.map((f) => (
                    <li key={f.id}>
                        [file] {f.name} ({f.size_bytes} bytes)
                    </li>
                ))}
            </ul>
        </main>
    );
}
