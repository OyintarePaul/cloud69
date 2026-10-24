import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 8;

export function FolderSkeleton() {
    return (
        <main className="space-y-4 p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Loading folder…
            </span>

            {/* breadcrumbs */}
            <Skeleton className="h-6 w-48" />

            <div className="space-y-1">
                {/* table header */}
                <Skeleton className="h-10 w-full" />

                {/* rows, 44px tall like the real list */}
                {Array.from({ length: ROWS }, (_, i) => (
                    <div key={i} className="flex h-11 items-center gap-3">
                        <Skeleton className="size-8 shrink-0" />
                        <Skeleton className="h-4 w-40 max-w-[40%]" />
                        <Skeleton className="ml-auto h-4 w-24" />
                    </div>
                ))}
            </div>
        </main>
    );
}
