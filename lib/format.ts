const UNITS = ["B", "KB", "MB", "GB"] as const;

/** 524288000 -> "500 MB". Binary units, whole numbers from 10 up. */
export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        UNITS.length - 1,
    );
    const value = bytes / 1024 ** i;
    const text =
        value >= 10 || Number.isInteger(value)
            ? Math.round(value).toString()
            : value.toFixed(1);
    return `${text} ${UNITS[i]}`;
}
