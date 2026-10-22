import type { ReactNode } from "react";
import { SidebarContent } from "@/components/shell/sidebar-content";
import { Topbar } from "@/components/shell/topbar";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh">
            <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r-2 border-ink bg-card md:block">
                <SidebarContent />
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
