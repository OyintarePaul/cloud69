import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
};

/**
 * Verified identity from the JWT (signature checked locally against the
 * project's public keys). Deduped per request via React cache().
 * Must be called inside a <Suspense> boundary (it reads request data).
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return null;

    const claims = data.claims;
    const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
    const email = (claims.email as string | undefined) ?? "";

    return {
        id: claims.sub,
        email,
        name: String(meta.full_name ?? meta.name ?? (email || "User")),
        avatarUrl: (meta.avatar_url ?? meta.picture ?? null) as string | null,
    };
});

/** For pages and actions that need a user. Pass the current path as `next`. */
export async function requireUser(next?: string): Promise<CurrentUser> {
    const user = await getCurrentUser();
    if (!user) {
        redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
    }
    return user;
}
