import { Suspense } from "react";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { safeNext } from "@/lib/validate";

type LoginSearchParams = Promise<{ next?: string; error?: string }>;

export default function LoginPage({
    searchParams,
}: {
    searchParams: LoginSearchParams;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <Card variant="hard" size="lg" className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle
                        role="heading"
                        aria-level={1}
                        className="text-[28px]"
                    >
                        Sign in to Cloud69
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Suspense
                        fallback={
                            <Button disabled className="btn-hard w-full">
                                Continue with Google
                            </Button>
                        }
                    >
                        <LoginForm searchParams={searchParams} />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    );
}

async function LoginForm({
    searchParams,
}: {
    searchParams: LoginSearchParams;
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
                <SubmitButton className="btn-hard w-full">
                    Continue with Google
                </SubmitButton>
            </form>
        </>
    );
}
