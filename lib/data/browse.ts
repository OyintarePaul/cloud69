import { notFound } from "next/navigation";
import type { BrowseParams } from "@/lib/schemas/browse";
import { parentIdFromFolderId } from "@/lib/schemas/ids";
import { createClient } from "@/lib/supabase/server";
import type { Crumb, FileItem, FolderItem } from "@/lib/types";

/** Matches the project's Max Rows setting (R15). */
export const LIST_LIMIT = 5000;

export type FolderContents = {
    crumbs: Crumb[];
    folders: FolderItem[];
    files: FileItem[];
    total: number;
    truncated: boolean;
};

const FILE_ORDER = {
    name: "name",
    modified: "updated_at",
    size: "size_bytes",
    type: "mime_type",
} as const;

export async function getFolderContents(
    folderId: string,
    userId: string,
    { sort, dir }: Pick<BrowseParams, "sort" | "dir">,
): Promise<FolderContents> {
    const supabase = await createClient();
    const parentId = parentIdFromFolderId(folderId);
    const asc = dir === "asc";

    // Live folders in this folder. Folders have no size or type, so for
    // those sorts they stay sorted by name.
    let folderQuery = supabase
        .from("folders")
        .select("id, name, updated_at", { count: "exact" })
        .eq("owner_id", userId)
        .is("trashed_at", null);
    folderQuery = parentId
        ? folderQuery.eq("parent_id", parentId)
        : folderQuery.is("parent_id", null);
    folderQuery =
        sort === "modified"
            ? folderQuery.order("updated_at", { ascending: asc }).order("name")
            : folderQuery.order("name", {
                  ascending: sort === "name" ? asc : true,
              });
    folderQuery = folderQuery.order("id").limit(LIST_LIMIT);

    // Live, finished files in this folder (R14).
    let fileQuery = supabase
        .from("files")
        .select("id, name, size_bytes, mime_type, updated_at", {
            count: "exact",
        })
        .eq("owner_id", userId)
        .is("trashed_at", null)
        .eq("status", "ready");
    fileQuery = parentId
        ? fileQuery.eq("folder_id", parentId)
        : fileQuery.is("folder_id", null);
    fileQuery = fileQuery.order(FILE_ORDER[sort], { ascending: asc });
    if (sort !== "name") fileQuery = fileQuery.order("name");
    fileQuery = fileQuery.order("id").limit(LIST_LIMIT);

    // The breadcrumb call doubles as the "does this folder exist" check.
    const [foldersRes, filesRes, crumbsRes] = await Promise.all([
        folderQuery,
        fileQuery,
        parentId
            ? supabase.rpc("get_breadcrumbs", { p_folder_id: parentId })
            : null,
    ]);

    if (crumbsRes?.error) {
        if (crumbsRes.error.message === "NOT_FOUND") notFound();
        throw crumbsRes.error;
    }
    if (foldersRes.error) throw foldersRes.error;
    if (filesRes.error) throw filesRes.error;

    const folders = foldersRes.data;
    const files = filesRes.data;
    const foldersTotal = foldersRes.count ?? folders.length;
    const filesTotal = filesRes.count ?? files.length;

    return {
        crumbs: crumbsRes?.data ?? [],
        folders,
        files,
        total: foldersTotal + filesTotal,
        truncated: foldersTotal > folders.length || filesTotal > files.length,
    };
}
