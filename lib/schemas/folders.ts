import { z } from "zod";
import { folderIdSchema, uuidSchema } from "./ids";
import { nameSchema } from "./names";

export const createFolderSchema = z.object({
    parentId: folderIdSchema,
    name: nameSchema,
});
export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const renameItemSchema = z.object({
    kind: z.enum(["file", "folder"]),
    id: uuidSchema,
    name: nameSchema,
});
export type RenameItemInput = z.infer<typeof renameItemSchema>;
