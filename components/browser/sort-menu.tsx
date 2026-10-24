"use client";

import { ArrowUpDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SORT_DIRS,
    SORT_FIELDS,
    type SortDir,
    type SortField,
    type ViewMode,
} from "@/lib/schemas/browse";

const FIELD_LABELS: Record<SortField, string> = {
    name: "Name",
    modified: "Modified",
    size: "Size",
    type: "Type",
};

const DIR_LABELS: Record<SortDir, string> = {
    asc: "Ascending",
    desc: "Descending",
};

type Props = {
    view: ViewMode;
    sort: SortField;
    dir: SortDir;
};

export function SortMenu({ view, sort, dir }: Props) {
    const router = useRouter();

    function go(nextSort: SortField, nextDir: SortDir) {
        router.push(`?view=${view}&sort=${nextSort}&dir=${nextDir}`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 shrink-0 items-center gap-2 rounded-lg border-2 border-ink bg-card px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <ArrowUpDownIcon className="size-4" />
                <span>Sort: {FIELD_LABELS[sort]}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={sort}
                        onValueChange={(value) => go(value as SortField, dir)}
                    >
                        {SORT_FIELDS.map((field) => (
                            <DropdownMenuRadioItem key={field} value={field}>
                                {FIELD_LABELS[field]}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Order</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={dir}
                        onValueChange={(value) => go(sort, value as SortDir)}
                    >
                        {SORT_DIRS.map((d) => (
                            <DropdownMenuRadioItem key={d} value={d}>
                                {DIR_LABELS[d]}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
