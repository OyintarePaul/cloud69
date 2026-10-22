import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/actions/auth";
import { safeNext } from "@/lib/validate";

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string; error?: string }>;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-6 rounded-xl border-2 border-ink bg-card p-8 shadow-hard">
                <h1 className="font-display text-[28px] font-bold">
                    Sign in to Cloud69
                </h1>
                <Suspense
                    fallback={
                        <Button disabled className="w-full">
                            Continue with Google
                        </Button>
                    }
                >
                    <LoginForm searchParams={searchParams} />
                </Suspense>
            </div>
        </main>
    );
}

async function LoginForm({
    searchParams,
}: {
    searchParams: Promise<{ next?: string; error?: string }>;
}) {
    const { next, error } = await searchParams;
    return (
        <>
            {error && (
                <p role="alert" className="text-sm text-destructive">
                    Sign-in failed. Please try again.
                </p>
            )}
            <form action={signInWithGoogle}>
                <input type="hidden" name="next" value={safeNext(next)} />
                <Button
                    type="submit"
                    className="w-full border-2 border-ink shadow-hard"
                >
                    Continue with Google
                </Button>
            </form>
        </>
    );
}
