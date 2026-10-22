import { createClient } from "@/lib/supabase/server";
import { UserMenuDropdown } from "./user-menu-dropdown";

export async function UserMenu() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const meta = user.user_metadata ?? {};
    const name = (meta.full_name ??
        meta.name ??
        user.email ??
        "User") as string;
    const avatarUrl = (meta.avatar_url ?? meta.picture ?? null) as
        | string
        | null;

    return (
        <UserMenuDropdown
            name={name}
            email={user.email ?? ""}
            avatarUrl={avatarUrl}
        />
    );
}
