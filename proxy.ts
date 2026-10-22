import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/validate";

const PROTECTED_PREFIXES = ["/folder", "/trash"];

function isProtected(pathname: string) {
    return PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
}

// Behind the Codespaces proxy, nextUrl can report localhost, so build the
// origin from the forwarded headers when they exist.
function getOrigin(request: NextRequest) {
    const host = request.headers.get("x-forwarded-host");
    if (!host) return request.nextUrl.origin;
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
}

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // Verifies the JWT and refreshes the session cookies when needed.
    // Do not put any code between createServerClient and this call.
    const { data, error } = await supabase.auth.getClaims();
    const signedIn = !error && !!data?.claims;

    const { pathname, search } = request.nextUrl;

    if (!signedIn && pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!signedIn && isProtected(pathname)) {
        const login = new URL("/login", getOrigin(request));
        login.searchParams.set("next", pathname + search);
        return NextResponse.redirect(login);
    }

    // Signed-in users have no business on /login. Honor a validated `next`
    // if there is one, otherwise go to root. Carry over any refreshed
    // session cookies so the redirect doesn't drop them.
    if (signedIn && pathname === "/login") {
        const dest = new URL(
            safeNext(request.nextUrl.searchParams.get("next")),
            getOrigin(request),
        );
        const redirect = NextResponse.redirect(dest);
        response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
        return redirect;
    }

    return response;

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
