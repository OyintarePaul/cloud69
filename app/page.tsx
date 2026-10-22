import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl space-y-6 p-10">
      <h1 className="font-display text-[40px] font-bold">Cloud69</h1>
      <p className="text-muted-foreground">Warm off-white, ink black, coral.</p>
      <p className="font-mono text-sm">12.4 MB · Oct 21, 2026</p>
      <Button className="border-2 border-ink shadow-hard">Continue with Google</Button>
      <p className="text-accent-text">Coral as text</p>
    </main>
  );
}
