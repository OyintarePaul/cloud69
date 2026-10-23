import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];

export type FolderItem = Pick<
    Tables["folders"]["Row"],
    "id" | "name" | "updated_at"
>;

export type FileItem = Pick<
    Tables["files"]["Row"],
    "id" | "name" | "size_bytes" | "mime_type" | "updated_at"
>;

export type Crumb =
    Database["public"]["Functions"]["get_breadcrumbs"]["Returns"][number];
