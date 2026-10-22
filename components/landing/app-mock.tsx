import { FileText, Folder, Image as ImageIcon } from "lucide-react";

const ROWS = [
    { icon: Folder, name: "Projects", meta: "12 items", selected: false },
    { icon: Folder, name: "Receipts 2026", meta: "48 items", selected: false },
    {
        icon: ImageIcon,
        name: "team-offsite.jpg",
        meta: "3.2 MB",
        selected: true,
    },
    { icon: FileText, name: "Q3-report.pdf", meta: "1.1 MB", selected: false },
    { icon: FileText, name: "notes.md", meta: "4 KB", selected: false },
];

export function AppMock() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-hard"
        >
            <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
                <p className="font-mono text-xs text-muted-foreground">
                    Home / <span className="text-foreground">Projects</span>
                </p>
                <span className="rounded-lg border-2 border-ink bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Upload
                </span>
            </div>

            <ul>
                {ROWS.map(({ icon: Icon, name, meta, selected }) => (
                    <li
                        key={name}
                        className={`flex h-11 items-center gap-3 border-b border-border px-4 last:border-b-0 ${
                            selected ? "bg-muted" : ""
                        }`}
                    >
                        <span className="flex size-7 items-center justify-center rounded-md border-2 border-ink bg-muted">
                            <Icon className="size-3.5" />
                        </span>
                        <span className="flex-1 truncate text-sm font-medium">
                            {name}
                        </span>
                        {selected && (
                            <span className="size-2 rounded-full bg-primary" />
                        )}
                        <span className="font-mono text-xs text-muted-foreground">
                            {meta}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="space-y-1.5 border-t-2 border-ink px-4 py-3">
                <div className="flex justify-between font-mono text-xs text-muted-foreground">
                    <span>Storage</span>
                    <span>32 MB / 500 MB</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full border border-ink bg-muted">
                    <div className="h-full w-[6%] bg-primary" />
                </div>
            </div>
        </div>
    );
}
