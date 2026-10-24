import Link from "next/link";
import type { ReactNode } from "react";
import { ItemIcon } from "@/components/browser/item-icon";
import { cn } from "@/lib/utils";

type Props = {
    name: string;
    /** null = folder */
    mime: string | null;
    /** Small line under the name (size and date). */
    meta: ReactNode;
    /** Folders pass a link. Files have none yet (preview comes in Phase 6). */
    href?: string;
};

const CARD_CLASSES =
    "flex flex-col gap-3 rounded-xl border-2 border-ink bg-card p-3 outline-none transition-shadow duration-150 motion-reduce:transition-none";

export function ItemCard({ name, mime, meta, href }: Props) {
    const body = (
        <>
            <ItemIcon
                mime={mime}
                className="size-12 rounded-lg [&_svg]:size-6"
            />
            <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm font-medium" title={name}>
                    {name}
                </p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                    {meta}
                </p>
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    CARD_CLASSES,
                    "hover:shadow-hard focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
            >
                {body}
            </Link>
        );
    }

    return <div className={CARD_CLASSES}>{body}</div>;
}
