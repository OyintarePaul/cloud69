import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_rethrow } from "next/navigation";
import type { z } from "zod";
import { type CurrentUser, getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
    type ActionFailure,
    type ActionResult,
    type ErrorCode,
    type FieldErrors,
    fail,
    ok,
} from "./result";

/** Throw from a handler for an expected, typed failure. */
export class ActionError extends Error {
    constructor(
        public code: ErrorCode,
        message?: string,
        public fieldErrors?: FieldErrors,
    ) {
        super(message ?? code);
    }
}

type Ctx<S extends z.ZodType> = {
    input: z.output<S>;
    supabase: SupabaseClient;
    user: CurrentUser;
};

/** Maps ActionError and Postgres/RPC errors; logs and hides anything else. */
function mapError(e: unknown): ActionFailure {
    if (e instanceof ActionError) return fail(e.code, e.message, e.fieldErrors);

    const pg = (e ?? {}) as { code?: string; message?: string };
    const msg = pg.message ?? "";

    if (msg.includes("QUOTA_EXCEEDED")) return fail("QUOTA_EXCEEDED");
    if (msg.includes("PROFILE_MISSING")) {
        console.error("[action] PROFILE_MISSING", e);
        return fail("PROFILE_MISSING");
    }
    if (msg.includes("PARENT_TRASHED")) return fail("PARENT_TRASHED");
    if (msg.includes("NOT_FOUND")) return fail("NOT_FOUND");
    if (msg.includes("DUPLICATE_NAME") || pg.code === "23505") {
        return fail("DUPLICATE_NAME");
    }

    console.error("[action] unexpected error", e);
    return fail("UNKNOWN");
}

/**
 * validate (zod) -> auth (getClaims) -> handler -> typed result.
 * Handlers return data and throw (e.g. `if (error) throw error`) on failure.
 */
export function createAction<S extends z.ZodType, T>(
    schema: S,
    handler: (ctx: Ctx<S>) => Promise<T>,
) {
    return async (input: z.input<S>): Promise<ActionResult<T>> => {
        const parsed = schema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path.length
                    ? issue.path.map(String).join(".")
                    : "_form";
                (fieldErrors[key] ??= []).push(issue.message);
            }
            return fail("VALIDATION", fieldErrors._form?.[0], fieldErrors);
        }

        const user = await getCurrentUser();
        if (!user) return fail("UNAUTHORIZED");

        try {
            const supabase = await createClient();
            const data = await handler({ input: parsed.data, supabase, user });
            return ok(data);
        } catch (e) {
            unstable_rethrow(e); // redirect() / notFound() must pass through
            return mapError(e);
        }
    };
}
