import { z } from "zod";

// Slash, backslash, control chars (blueprint section 7). DB check is the backstop.
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[/\\\u0000-\u001f\u007f]/;

export const nameSchema = z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or fewer")
    .refine(
        (v) => !FORBIDDEN.test(v),
        "Name can't contain / \\ or control characters",
    )
    .refine((v) => v !== "." && v !== "..", "That name isn't allowed");
