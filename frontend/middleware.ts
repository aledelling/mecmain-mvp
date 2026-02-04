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
  const hostname = req.headers.get("host")!; 

  // Dominios que deben tratarse como la "Landing Global" (No tenants)
  // Incluimos 'vercel.app' para que 'mi-proyecto.vercel.app' sea el root.
  const isVercelDomain = hostname.endsWith(".vercel.app");
  const isLocalhost = hostname.includes("localhost");
  const isMainProductionDomain = hostname === "mecmain.com" || hostname === "www.mecmain.com";

  // Determinamos si es una petición a un subdominio de tenant real
  // Lógica: No es localhost, no es el dominio principal prod, y (si es vercel) no es el dominio raíz del despliegue.
  // Nota: Para MVP en Vercel, asumimos que NO usamos subdominios reales todavía, 
  // confiamos en el modo PATH (/t/slug).
  // Si quisieras subdominios reales en Vercel, necesitarías configurar wildcards.
  
  let subdomain = null;
  
  if (!isLocalhost && !isMainProductionDomain) {
      // Caso simple: Si tienes un dominio propio "talleres.com" y entra "moto.talleres.com"
      const parts = hostname.split('.');
      if (parts.length > 2 && !isVercelDomain) {
          subdomain = parts[0]; 
      }
      // Caso Vercel: Si configuras "moto-app.vercel.app" vs "mecmain-saas.vercel.app", 
      // es difícil distinguir automáticamente cuál es tenant y cuál es app sin una lista blanca.
      // Para este MVP, DESACTIVAMOS la detección automática de subdominio en Vercel 
      // para evitar romper la landing global. Usaremos /t/slug estrictamente.
  }

  // --- REWRITE PARA SUBDOMINIO (Target PROD futuro) ---
  if (subdomain) {
    return NextResponse.rewrite(
      new URL(`/app/${subdomain}${url.pathname}`, req.url)
    );
  }

  // --- REWRITE PARA PATH FALLBACK (Modo actual MVP) ---
  // Permite acceder a /t/motoridersco/dashboard y que internamente Next.js renderice /app/[tenant]/dashboard
  if (url.pathname.startsWith("/t/")) {
    const segments = url.pathname.split("/");
    // segments[0] = empty, segments[1] = 't', segments[2] = tenantSlug
    const tenantSlug = segments[2];
    
    if (tenantSlug) {
        // Cortamos /t/slug de la URL para pasársela al router interno
        // Ejemplo: /t/motoridersco/store -> /app/motoridersco/store
        // Ejemplo: /t/motoridersco -> /t/motoridersco (Landing del tenant)
        
        // Excepción: La landing page del tenant vive en /app/t/[tenant]/page.tsx ? 
        // No, en nuestra estructura actual de archivos:
        // Landing Tenant: frontend/app/t/[tenant]/page.tsx
        // App Dashboard: frontend/app/app/[tenant]/...
        
        // El middleware actual NO necesita reescribir /t/..., porque Next.js App Router 
        // ya maneja rutas dinámicas en carpetas.
        // /app/t/[tenant]/page.tsx mapea a /t/motoridersco automáticamente.
        
        // SIN EMBARGO, si queremos soportar urls limpias futuras, mantenemos la lógica simple.
        // Por ahora, dejamos pasar la request tal cual, ya que la estructura de carpetas
        // coincide con la URL pública para el modo PATH.
        
        return NextResponse.next();
    }
  }

  return NextResponse.next();
}