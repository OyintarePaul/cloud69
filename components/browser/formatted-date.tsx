"use client";

const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
});

export function FormattedDate({ value }: { value: string }) {
    return (
        <time dateTime={value} suppressHydrationWarning>
            {formatter.format(new Date(value))}
        </time>
    );
}
