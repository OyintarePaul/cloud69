import { z } from "zod";

export const SORT_FIELDS = ["name", "modified", "size", "type"] as const;
export const SORT_DIRS = ["asc", "desc"] as const;
export const VIEW_MODES = ["list", "grid"] as const;

/** Name of the cookie that remembers the chosen view. */
export const VIEW_COOKIE = "cloud69_view";

export type SortField = (typeof SORT_FIELDS)[number];
export type SortDir = (typeof SORT_DIRS)[number];
export type ViewMode = (typeof VIEW_MODES)[number];

/**
 * Any missing or invalid value falls back to a default (no errors).
 * `view` is the exception: it stays undefined so the page can use the saved
 * cookie before falling back to "list".
 */
const browseSchema = z.object({
    view: z.enum(VIEW_MODES).optional().catch(undefined),
    sort: z.enum(SORT_FIELDS).catch("name"),
    dir: z.enum(SORT_DIRS).catch("asc"),
});

export type BrowseParams = z.infer<typeof browseSchema>;

/** Same as BrowseParams, but with the view decided (URL, then cookie, then list). */
export type ResolvedBrowseParams = Omit<BrowseParams, "view"> & {
    view: ViewMode;
};

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

/** Turns a raw string (for example from a cookie) into a view, or undefined. */
export function parseViewMode(value: string | undefined): ViewMode | undefined {
    return VIEW_MODES.find((mode) => mode === value);
}
