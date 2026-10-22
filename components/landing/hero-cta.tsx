import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function HeroCta() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

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
