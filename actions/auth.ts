"use server";

import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/validate";

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next") as string | null);
  const h = await headers();
  const origin = h.get("origin");
  if (!origin) redirect("/login?error=origin");

  // Carry `next` in a short-lived cookie so redirectTo has no query string.
  const cookieStore = await cookies();
  cookieStore.set("cloud69_next", next, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: process.env.NODE_ENV === "production",
  });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
