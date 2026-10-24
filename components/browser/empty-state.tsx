import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    icon: LucideIcon;
    title: string;
    description?: string;
    /** One button or link. Leave out when there is nothing to do yet. */
    action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
    return (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
            <span
                aria-hidden="true"
                className="shadow-hard flex size-16 items-center justify-center rounded-xl border-2 border-ink bg-card"
            >
                <Icon className="size-7" />
            </span>
            <div className="space-y-1">
                <h2 className="font-display text-xl font-semibold">{title}</h2>
                {description && (
                    <p className="max-w-sm text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}
