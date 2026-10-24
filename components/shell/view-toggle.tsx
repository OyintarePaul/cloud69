"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    parseViewMode,
    VIEW_COOKIE,
    type ViewMode,
} from "@/lib/schemas/browse";

const ITEM_CLASSES =
    "size-9 min-w-0 px-0 text-muted-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground";

export function ViewToggle({ savedView }: { savedView?: ViewMode }) {
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    // The top bar stays mounted while you move between folders, so the value
    // the server gave us goes stale. Remember the last click here instead.
    const [chosen, setChosen] = useState<ViewMode | undefined>(savedView);

    // Grid/list only makes sense on folder pages.
    if (!pathname.startsWith("/folder/")) return null;

    const current =
        parseViewMode(params.get("view") ?? undefined) ?? chosen ?? "list";

    function change(next: ViewMode) {
        setChosen(next);
        // Remember the choice for a year.
        document.cookie = `${VIEW_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        const nextParams = new URLSearchParams(params.toString());
        nextParams.set("view", next);
        router.push(`${pathname}?${nextParams.toString()}`);
    }

    return (
        <ToggleGroup
            aria-label="View mode"
            spacing={0}
            value={[current]}
            onValueChange={(value) => {
                // Clicking the active button gives an empty list; ignore it.
                const next = parseViewMode(value[0]);
                if (next) change(next);
            }}
            className="overflow-hidden rounded-lg border-2 border-ink bg-card"
        >
            <ToggleGroupItem
                value="list"
                aria-label="List view"
                className={ITEM_CLASSES}
            >
                <ListIcon className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                className={`${ITEM_CLASSES} border-l-2 border-ink`}
            >
                <LayoutGridIcon className="size-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
