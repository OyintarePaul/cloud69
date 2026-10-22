import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/validate";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const h = await headers();
  const forwardedHost = h.get("x-forwarded-host");
  const proto = h.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const origin = forwardedHost ? `${proto}://${forwardedHost}` : url.origin;

  const cookieStore = await cookies();
  const next = safeNext(cookieStore.get("cloud69_next")?.value);
  cookieStore.delete("cloud69_next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
