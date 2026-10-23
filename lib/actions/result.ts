export type ErrorCode =
    | "VALIDATION"
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "DUPLICATE_NAME"
    | "QUOTA_EXCEEDED"
    | "PROFILE_MISSING"
    | "PARENT_TRASHED"
    | "UNKNOWN";

/** Keyed by field name; "_form" holds errors not tied to a field. */
export type FieldErrors = Record<string, string[]>;

export type ActionFailure = {
    ok: false;
    code: ErrorCode;
    message: string;
    fieldErrors?: FieldErrors;
};

export type ActionResult<T = void> = { ok: true; data: T } | ActionFailure;

export const DEFAULT_MESSAGES: Record<ErrorCode, string> = {
    VALIDATION: "Please check the highlighted fields.",
    UNAUTHORIZED: "Your session has expired. Please sign in again.",
    NOT_FOUND: "That item no longer exists.",
    DUPLICATE_NAME: "That name is already taken here.",
    QUOTA_EXCEEDED: "Over quota.",
    PROFILE_MISSING:
        "Something went wrong with your account. Please try again.",
    PARENT_TRASHED: "That folder is in the trash.",
    UNKNOWN: "Something went wrong. Please try again.",
};

export function ok<T = void>(data?: T): ActionResult<T> {
    return { ok: true, data: data as T };
}

export function fail(
    code: ErrorCode,
    message?: string,
    fieldErrors?: FieldErrors,
): ActionFailure {
    return {
        ok: false,
        code,
        message: message ?? DEFAULT_MESSAGES[code],
        ...(fieldErrors ? { fieldErrors } : {}),
    };
}
