"use client";

import { ChevronRightIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { FolderNode } from "@/lib/data/folders";
import { cn } from "@/lib/utils";

type ChildrenMap = Map<string | null, FolderNode[]>;

type NodeProps = {
    node: FolderNode;
    depth: number;
    childrenOf: ChildrenMap;
    expanded: Set<string>;
    activeId: string | null;
    onToggle: (id: string) => void;
};

function TreeNode({
    node,
    depth,
    childrenOf,
    expanded,
    activeId,
    onToggle,
}: NodeProps) {
    const kids = childrenOf.get(node.id) ?? [];
    const open = expanded.has(node.id);
    const active = node.id === activeId;

    return (
        <li>
            <div
                className={cn(
                    "flex h-9 items-center gap-1 rounded-lg border-2 pr-2",
                    active
                        ? "border-ink bg-muted font-medium"
                        : "border-transparent hover:bg-muted",
                )}
                style={{ paddingLeft: Math.min(depth, 8) * 12 }}
            >
                {kids.length > 0 ? (
                    <button
                        type="button"
                        onClick={() => onToggle(node.id)}
                        aria-expanded={open}
                        aria-label={`${open ? "Collapse" : "Expand"} ${node.name}`}
                        className="flex size-6 shrink-0 items-center justify-center rounded-md outline-none hover:bg-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                        <ChevronRightIcon
                            className={cn(
                                "size-4 transition-transform duration-150 motion-reduce:transition-none",
                                open && "rotate-90",
                            )}
                        />
                    </button>
                ) : (
                    <span className="size-6 shrink-0" aria-hidden="true" />
                )}

                <Link
                    href={`/folder/${node.id}`}
                    aria-current={active ? "page" : undefined}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                    <FolderIcon className="size-4 shrink-0" />
                    <span className="truncate">{node.name}</span>
                </Link>
            </div>

            {open && kids.length > 0 && (
                <ul>
                    {kids.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            childrenOf={childrenOf}
                            expanded={expanded}
                            activeId={activeId}
                            onToggle={onToggle}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function FolderTree({ folders }: { folders: FolderNode[] }) {
    const pathname = usePathname();

    // Which folder are we in? (/folder/root means none.)
    const raw = /^\/folder\/([^/]+)/.exec(pathname)?.[1];
    const activeId = raw && raw !== "root" ? raw : null;

    // Sort the flat list into parents and children, A to Z at every level.
    const { childrenOf, parentOf } = useMemo(() => {
        const childrenOf: ChildrenMap = new Map();
        const parentOf = new Map<string, string | null>();
        for (const f of folders) {
            parentOf.set(f.id, f.parent_id);
            const list = childrenOf.get(f.parent_id);
            if (list) list.push(f);
            else childrenOf.set(f.parent_id, [f]);
        }
        const collator = new Intl.Collator("en", {
            sensitivity: "base",
            numeric: true,
        });
        for (const list of childrenOf.values()) {
            list.sort((a, b) => collator.compare(a.name, b.name));
        }
        return { childrenOf, parentOf };
    }, [folders]);

    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [seenActive, setSeenActive] = useState<string | null>(null);

    // When you move to a different folder, open all of its parents so you can
    // always see where you are. Anything you opened by hand stays open.
    if (activeId !== seenActive) {
        setSeenActive(activeId);
        if (activeId) {
            const next = new Set(expanded);
            let parent = parentOf.get(activeId) ?? null;
            while (parent) {
                next.add(parent);
                parent = parentOf.get(parent) ?? null;
            }
            setExpanded(next);
        }
    }

    function toggle(id: string) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const roots = childrenOf.get(null) ?? [];
    if (roots.length === 0) {
        return (
            <p className="px-3 text-sm text-muted-foreground">
                No folders yet.
            </p>
        );
    }

    return (
        <nav aria-label="Folders">
            <ul>
                {roots.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        depth={0}
                        childrenOf={childrenOf}
                        expanded={expanded}
                        activeId={activeId}
                        onToggle={toggle}
                    />
                ))}
            </ul>
        </nav>
    );
}
