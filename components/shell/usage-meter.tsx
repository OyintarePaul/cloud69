"use client";

import { TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";

export function UsageMeter({
    usedBytes,
    quotaBytes,
}: {
    usedBytes: number;
    quotaBytes: number;
}) {
    const ratio = quotaBytes > 0 ? usedBytes / quotaBytes : 0;
    const warning =
        ratio >= 1 ? "Storage full" : ratio >= 0.9 ? "Almost full" : null;

    return (
        <Card size="sm" className="bg-background">
            <CardContent className="space-y-2">
                <Progress
                    value={usedBytes}
                    max={quotaBytes}
                    getAriaValueText={(_formatted, value) =>
                        `${formatBytes(value ?? 0)} of ${formatBytes(quotaBytes)} used`
                    }
                    indicatorClassName={warning ? "bg-destructive" : undefined}
                >
                    <ProgressLabel className="text-xs">Storage</ProgressLabel>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                        {formatBytes(usedBytes)} / {formatBytes(quotaBytes)}
                    </span>
                </Progress>
                {warning && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                        <TriangleAlert
                            className="size-3.5"
                            aria-hidden="true"
                        />
                        {warning}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
