import { Cloud, FolderTree, Undo2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AppMock } from "@/components/landing/app-mock";
import { HeroCta, HeroCtaFallback } from "@/components/landing/hero-cta";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const REPO_URL = "https://github.com/OyintarePaul/cloud69";

const FEATURES = [
    {
        icon: FolderTree,
        title: "Nested folders",
        body: "Organize without limits. Move things around, rename anything, and keep names tidy automatically.",
    },
    {
        icon: UploadCloud,
        title: "Resumable uploads",
        body: "Big files, flaky Wi-Fi, refreshed tabs. Uploads pick up where they left off.",
    },
    {
        icon: Undo2,
        title: "Trash and restore",
        body: "Deleted something by mistake? Bring a whole folder back with one click, for 30 days.",
    },
];

export default function LandingPage() {
    return (
        <div className="flex min-h-dvh flex-col">
            <header className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg border-2 border-ink bg-primary text-primary-foreground">
                        <Cloud className="size-5" />
                    </span>
                    <span className="font-display text-xl font-bold">
                        Cloud69
                    </span>
                </Link>
                <ThemeToggle />
            </header>

            <main className="flex-1">
                <section className="mx-auto grid w-full max-w-[1120px] items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
                    <div className="space-y-6">
                        <h1 className="font-display text-[40px] font-bold leading-tight">
                            Your files,{" "}
                            <span className="rounded-lg bg-primary px-2 text-primary-foreground">
                                neatly
                            </span>{" "}
                            kept.
                        </h1>
                        <p className="max-w-md text-base text-muted-foreground">
                            Small, fast file storage with nested folders,
                            uploads that survive a refresh, and a trash that
                            lets you undo.
                        </p>
                        <Suspense fallback={<HeroCtaFallback />}>
                            <HeroCta />
                        </Suspense>
                    </div>
                    <AppMock />
                </section>

                <section className="mx-auto grid w-full max-w-[1120px] gap-6 px-6 pb-20 md:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, body }) => (
                        <Card key={title} variant="hard" size="lg">
                            <CardHeader>
                                <span className="mb-2 flex size-10 items-center justify-center rounded-lg border-2 border-ink bg-muted">
                                    <Icon className="size-5" />
                                </span>
                                <CardTitle
                                    role="heading"
                                    aria-level={2}
                                    className="text-xl"
                                >
                                    {title}
                                </CardTitle>
                                <CardDescription>{body}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </section>
            </main>

            <footer className="border-t-2 border-ink">
                <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground">
                    <p>Built with Next.js and Supabase.</p>
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-accent-text underline underline-offset-4"
                    >
                        View the repo
                    </a>
                </div>
            </footer>
        </div>
    );
}
