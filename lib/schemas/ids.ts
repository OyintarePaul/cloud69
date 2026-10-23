import { z } from "zod";

export const uuidSchema = z.uuid();

/** "root" or a UUID (R18). */
export const folderIdSchema = z.union([z.literal("root"), z.uuid()]);

export function isFolderId(value: string): boolean {
    return folderIdSchema.safeParse(value).success;
}

/** URL segment -> database parent id ("root" is a null parent). */
export function parentIdFromFolderId(id: string): string | null {
    return id === "root" ? null : id;
}
