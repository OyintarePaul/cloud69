"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<
    ComponentProps<typeof Button>,
    "loading" | "type"
>;

/** Drop-in submit button for `<form action={...}>`: shows loading while the action runs. */
export function SubmitButton(props: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return <Button type="submit" loading={pending} {...props} />;
}
