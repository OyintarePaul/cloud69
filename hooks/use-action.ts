"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
    type ActionFailure,
    type ActionResult,
    fail,
} from "@/lib/actions/result";

type Options<T> = {
    onSuccess?: (data: T) => void;
    /** Providing this means the caller handles errors: no toast. */
    onError?: (failure: ActionFailure) => void;
    /** No toast and no callback. Use for forms that map errors to fields. */
    silent?: boolean;
    successMessage?: string;
};

export function useAction<I, T>(
    action: (input: I) => Promise<ActionResult<T>>,
    opts: Options<T> = {},
) {
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult<T> | null>(null);
    const router = useRouter();

    function execute(input: I): Promise<ActionResult<T>> {
        return new Promise((resolve) => {
            startTransition(async () => {
                let res: ActionResult<T>;
                try {
                    res = await action(input);
                } catch {
                    res = fail(
                        "UNKNOWN",
                        "Network error. Check your connection and try again.",
                    );
                }

                setResult(res);

                if (res.ok) {
                    if (opts.successMessage) toast.success(opts.successMessage);
                    opts.onSuccess?.(res.data);
                } else if (res.code === "UNAUTHORIZED") {
                    const here =
                        window.location.pathname + window.location.search;
                    router.push(`/login?next=${encodeURIComponent(here)}`);
                } else if (!opts.silent) {
                    if (opts.onError) opts.onError(res);
                    else toast.error(res.message);
                }

                resolve(res);
            });
        });
    }

    return { execute, pending, result };
}
