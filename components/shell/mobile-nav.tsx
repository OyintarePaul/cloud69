"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-2 border-ink md:hidden"
                        aria-label="Open menu"
                    />
                }
            >
                <Menu />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-64 border-r-2 border-ink bg-card p-0"
            >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div
                    className="h-full"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest("a"))
                            setOpen(false);
                    }}
                >
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}
