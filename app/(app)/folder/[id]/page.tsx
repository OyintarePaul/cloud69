import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="p-10">Loading…</main>}>
      <FolderContent params={params} />
    </Suspense>
  );
}

async function FolderContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/folder/${id}`);

  return (
    <main className="mx-auto max-w-xl space-y-4 p-10">
      <h1 className="font-display text-[28px] font-bold">Folder: {id}</h1>
      <p className="font-mono text-sm">{user.email}</p>
      <form action={signOut}>
        <Button type="submit" variant="outline">Sign out</Button>
      </form>
    </main>
  );
}
