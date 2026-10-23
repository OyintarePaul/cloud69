"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Info, LoaderCircle, LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
}

export function UserMenuDropdown({
    name,
    email,
    avatarUrl,
}: {
    name: string;
    email: string;
    avatarUrl: string | null;
}) {
    const [pending, startTransition] = useTransition();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Account menu"
                    />
                }
            >
                <Avatar className="size-9 border-2 border-ink">
                    {avatarUrl && (
                        <AvatarImage
                            src={avatarUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                        />
                    )}
                    <AvatarFallback className="bg-muted text-xs font-medium">
                        {initials(name)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-60 border-2 border-ink"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="space-y-0.5">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <p className="truncate font-mono text-xs font-normal text-muted-foreground">
                            {email}
                        </p>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/?landing=1" />}>
                    <Info /> About Cloud69
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={pending}
                    closeOnClick={false}
                    onClick={() => startTransition(() => signOut())}
                >
                    {pending ? (
                        <LoaderCircle className="animate-spin motion-reduce:animate-pulse" />
                    ) : (
                        <LogOut />
                    )}
                    {pending ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
