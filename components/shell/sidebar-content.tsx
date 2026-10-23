import { Cloud } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarNav } from "./sidebar-nav";
import { UsageMeter } from "./usage-meter";

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

            {/* Placeholder values: real data arrives in Phase 5 */}
            <UsageMeter usedBytes={0} quotaBytes={500 * 1024 * 1024} />
        </div>
    );
}
