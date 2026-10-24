import { InfoIcon } from "lucide-react";

type Props = {
    limit: number;
    total: number;
};

const fmt = (n: number) => n.toLocaleString("en-US");

export function TruncationNotice({ limit, total }: Props) {
    return (
        <div
            role="status"
            className="flex items-center gap-2 rounded-lg border-2 border-ink bg-muted px-3 py-2 text-sm"
        >
            <InfoIcon className="size-4 shrink-0" aria-hidden="true" />
            <p>
                Showing the first{" "}
                <span className="font-mono">{fmt(limit)}</span> folders and{" "}
                <span className="font-mono">{fmt(limit)}</span> files. This
                folder has <span className="font-mono">{fmt(total)}</span> items
                in total.
            </p>
        </div>
    );
}
