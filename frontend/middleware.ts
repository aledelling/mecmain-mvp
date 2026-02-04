import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  // 1. Configuración inicial de respuesta
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Gestión de Sesión Supabase (Auth Refresh)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Actualizamos cookies en la request y en la response
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refrescamos la sesión si ha expirado
  await supabase.auth.getUser();

  // 3. Lógica Multitenant (Host/Path)
  const url = request.nextUrl;
  const hostname = request.headers.get("host")!;

  const isVercelDomain = hostname.endsWith(".vercel.app");
  const isLocalhost = hostname.includes("localhost");
  const isMainProductionDomain = hostname === "mecmain.com" || hostname === "www.mecmain.com";

  let subdomain = null;

  if (!isLocalhost && !isMainProductionDomain) {
    const parts = hostname.split('.');
    if (parts.length > 2 && !isVercelDomain) {
      subdomain = parts[0];
    }
  }

  // --- Caso A: Rewrite por Subdominio ---
  if (subdomain) {
    // Reescribimos la URL
    const rewriteUrl = new URL(`/app/${subdomain}${url.pathname}`, request.url);
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    
    // IMPORTANTE: Copiar las cookies de sesión (set-cookie) de la respuesta de Supabase
    // a la respuesta final del rewrite para no perder la sesión.
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      rewriteResponse.headers.set('set-cookie', setCookie);
    }
    return rewriteResponse;
  }

  // --- Caso B: Path Fallback (/t/slug) ---
  if (url.pathname.startsWith("/t/")) {
    const segments = url.pathname.split("/");
    const tenantSlug = segments[2];
    if (tenantSlug) {
      // Dejamos pasar la request (Next.js maneja la ruta dinámica)
      // Pero devolvemos la respuesta 'response' que ya trae las cookies actualizadas de Supabase
      return response;
    }
  }

  // Si no hubo rewrite, devolvemos la respuesta original con las cookies refrescadas
  return response;
}