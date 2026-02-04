import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host")!; // ej: motoridersco.mecmain.com o localhost:3000

  // Dominios permitidos que NO son tenants (nuestro landing principal)
  const allowedDomains = ["localhost:3000", "mecmain.com", "vercel.app"];
  
  // Detectar si estamos en un subdominio
  const isMainDomain = allowedDomains.some(domain => hostname.includes(domain) && !hostname.startsWith("tenant."));
  
  // Extraer subdominio (muy simplificado)
  // En local, usamos path fallback (/t/slug).
  // En prod, si el host es "motoridersco.mecmain.com", subdomain es "motoridersco".
  
  const subdomain = hostname.split('.')[0];
  const isSubdomainRequest = !allowedDomains.includes(hostname) && subdomain !== 'www';

  if (isSubdomainRequest) {
    // REWRITE: Mantiene la URL en el navegador pero internamente carga /app/[subdomain]/...
    // Ejemplo: motoridersco.mecmain.com/dashboard -> /app/motoridersco/dashboard
    return NextResponse.rewrite(
      new URL(`/app/${subdomain}${url.pathname}`, req.url)
    );
  }

  // Fallback para modo DEV (localhost/t/motoridersco)
  if (url.pathname.startsWith("/t/")) {
    const [, , tenantSlug, ...rest] = url.pathname.split("/");
    // Rewrite /t/motoridersco/dashboard -> /app/motoridersco/dashboard
    const newPath = `/${rest.join("/")}`;
    return NextResponse.rewrite(
      new URL(`/app/${tenantSlug}${newPath}`, req.url)
    );
  }

  return NextResponse.next();
}