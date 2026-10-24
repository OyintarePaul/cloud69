import { getCurrentUser } from "@/lib/auth";
import { getAllFolders } from "@/lib/data/folders";
import { FolderTree } from "./folder-tree";

export async function FolderTreeSlot() {
    const user = await getCurrentUser();
    if (!user) return null;
    const folders = await getAllFolders(user.id);
    return <FolderTree folders={folders} />;
}
