import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
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
            <Button type="submit" size="lg" className="btn-hard">
                Continue with Google
            </Button>
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
