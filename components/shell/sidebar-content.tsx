import Link from "next/link";
import { Suspense } from "react";
import { Cloud } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarNav } from "./sidebar-nav";

export function SidebarContent() {
    return (
        <div className="flex h-full flex-col gap-6 p-4">
            <Link href="/folder/root" className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg border-2 border-ink bg-primary text-primary-foreground">
                    <Cloud className="size-5" />
                </span>
                <span className="font-display text-xl font-bold">Cloud69</span>
            </Link>

            <Suspense
                fallback={
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                }
            >
                <SidebarNav />
            </Suspense>

            {/* Placeholder: FolderTree arrives in Phase 3 */}
            <div className="flex-1 space-y-2">
                <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Folders
                </p>
                <p className="px-3 text-sm text-muted-foreground">
                    Your folders will appear here.
                </p>
            </div>

            {/* Placeholder: UsageMeter gets real data in Phase 5 */}
            <div className="space-y-2 rounded-xl border-2 border-ink bg-background p-3">
                <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium">Storage</span>
                    <span className="font-mono text-muted-foreground">
                        0 MB / 500 MB
                    </span>
                </div>
                <div
                    role="progressbar"
                    aria-label="Storage used"
                    aria-valuemin={0}
                    aria-valuemax={500}
                    aria-valuenow={0}
                    className="h-2 overflow-hidden rounded-full border border-ink bg-muted"
                >
                    <div className="h-full w-0 bg-primary" />
                </div>
            </div>
        </div>
    );
}
