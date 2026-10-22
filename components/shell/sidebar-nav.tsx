"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
    { href: "/folder/root", label: "Home", icon: Home, match: "/folder" },
    { href: "/trash", label: "Trash", icon: Trash2, match: "/trash" },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav aria-label="Main" className="flex flex-col gap-1">
            {ITEMS.map(({ href, label, icon: Icon, match }) => {
                const active =
                    pathname === match || pathname.startsWith(`${match}/`);
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex h-11 items-center gap-3 rounded-lg border-2 px-3 text-sm font-medium transition-colors duration-150 ease-out",
                            active
                                ? "border-ink bg-primary text-primary-foreground"
                                : "border-transparent hover:bg-muted",
                        )}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
