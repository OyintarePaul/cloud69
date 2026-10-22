const FALLBACK = "/folder/root";

/** Accepts only same-site relative paths; anything else falls back to root. */
export function safeNext(next: string | null | undefined): string {
    if (!next) return FALLBACK;
    if (!next.startsWith("/")) return FALLBACK;
    if (next.startsWith("//")) return FALLBACK;
    if (next.includes("\\")) return FALLBACK; // browsers treat /\ like //
    if (/[\u0000-\u001f]/.test(next)) return FALLBACK; // control chars
    if (/^\/[a-z][a-z0-9+.-]*:/i.test(next)) return FALLBACK; // scheme-like
    return next;
}
