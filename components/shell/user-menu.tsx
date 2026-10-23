import { getCurrentUser } from "@/lib/auth";
import { UserMenuDropdown } from "./user-menu-dropdown";

export async function UserMenu() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <UserMenuDropdown
            name={user.name}
            email={user.email}
            avatarUrl={user.avatarUrl}
        />
    );
}
