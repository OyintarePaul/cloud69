import { cache } from "react";
import { LIST_LIMIT } from "@/lib/data/browse";
import { createClient } from "@/lib/supabase/server";

export type FolderNode = {
    id: string;
    parent_id: string | null;
    name: string;
};

export const getAllFolders = cache(
    async (userId: string): Promise<FolderNode[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("folders")
            .select("id, parent_id, name")
            .eq("owner_id", userId)
            .is("trashed_at", null)
            .limit(LIST_LIMIT);
        if (error) throw error;
        return data;
    },
);
