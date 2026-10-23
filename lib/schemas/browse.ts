import { z } from "zod";

export const SORT_FIELDS = ["name", "modified", "size", "type"] as const;
export const SORT_DIRS = ["asc", "desc"] as const;
export const VIEW_MODES = ["list", "grid"] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortDir = (typeof SORT_DIRS)[number];
export type ViewMode = (typeof VIEW_MODES)[number];

/** Any missing or invalid value falls back to the default (no errors). */
const browseSchema = z.object({
    view: z.enum(VIEW_MODES).catch("list"),
    sort: z.enum(SORT_FIELDS).catch("name"),
    dir: z.enum(SORT_DIRS).catch("asc"),
});

export type BrowseParams = z.infer<typeof browseSchema>;

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

export function parseBrowseParams(raw: RawParams): BrowseParams {
    return browseSchema.parse({
        view: first(raw.view),
        sort: first(raw.sort),
        dir: first(raw.dir),
    });
}
