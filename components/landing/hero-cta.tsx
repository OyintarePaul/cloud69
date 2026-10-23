import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signInWithGoogle } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export async function HeroCta() {
    const user = await getCurrentUser();

    if (user) {
        return (
            <Link
                href="/folder/root"
                className={cn(buttonVariants({ size: "lg" }), "btn-hard")}
            >
                Open Cloud69 <ArrowRight />
            </Link>
        );
    }

    return (
        <form action={signInWithGoogle}>
            <SubmitButton size="lg" className="btn-hard">
                Continue with Google
            </SubmitButton>
        </form>
    );
}

export function HeroCtaFallback() {
    return (
        <Button size="lg" disabled className="btn-hard">
            Continue with Google
        </Button>
    );
}
