import { cookies } from "next/headers";
import { ViewToggle } from "@/components/shell/view-toggle";
import { parseViewMode, VIEW_COOKIE } from "@/lib/schemas/browse";

export async function ViewToggleSlot() {
    const store = await cookies();
    const savedView = parseViewMode(store.get(VIEW_COOKIE)?.value);
    return <ViewToggle savedView={savedView} />;
}
