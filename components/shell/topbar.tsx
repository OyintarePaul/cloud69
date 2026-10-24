import { Search } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileNav } from "./mobile-nav";
import { SidebarContent } from "./sidebar-content";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { ViewToggleSlot } from "./view-toggle-slot";

export function Topbar() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b-2 border-ink bg-background px-4">
            <MobileNav>
                <SidebarContent />
            </MobileNav>

            {/* Placeholder: SearchCommand arrives in Phase 6 */}
            <button
                type="button"
                disabled
                className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-lg border-2 border-ink bg-card px-3 text-sm text-muted-foreground"
            >
                <Search className="size-4" />
                <span className="flex-1 text-left">Search files</span>
                <kbd className="hidden font-mono text-xs sm:inline">⌘K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-2">
                <Suspense
                    fallback={<Skeleton className="h-9 w-[70px] rounded-lg" />}
                >
                    <ViewToggleSlot />
                </Suspense>
                <ThemeToggle />
                <Suspense
                    fallback={<Skeleton className="size-9 rounded-full" />}
                >
                    <UserMenu />
                </Suspense>
            </div>
        </header>
    );
}
