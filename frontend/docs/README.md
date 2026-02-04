# MecMain MVP - Frontend Dark Neon

Bienvenido al frontend de MecMain. Hemos actualizado la UI para que coincida con el branding de alto rendimiento de MotoRidersCO.

## 🎨 Nuevo Sistema de Diseño
- **Tema:** Dark Mode por defecto.
- **Colores:** Fondo `#0B0E11`, Acento `#00E599` (Verde Neón).
- **Estilo:** Glassmorphism (paneles translúcidos con blur).

## 🚀 Cómo Ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Correr servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Accede a `http://localhost:3000`.

## 🧪 Rutas Clave para Probar (UI Demo)

El frontend tiene rutas específicas para simular el entorno multi-tenant sin dominio real:

1. **Landing Global (SaaS):**
   - URL: `http://localhost:3000/`
   - Qué ver: Marketing de MecMain, CTA para prueba gratis.

2. **Landing del Tenant (MotoRidersCO):**
   - URL: `http://localhost:3000/t/motoridersco`
   - Qué ver: Hero con moto, Servicios, Footer con datos de contacto.

3. **Tienda Virtual (Demo E-commerce):**
   - URL: `http://localhost:3000/t/motoridersco/store`
   - Qué ver: Filtros laterales, Grid de productos, Carrito de compras funcional (visual).

4. **App Dashboard (Admin):**
   - URL: `http://localhost:3000/app/motoridersco/dashboard`
   - Qué ver: Sidebar oscuro, métricas clave, tablas con estilo glass.

5. **Login:**
   - URL: `http://localhost:3000/auth/login`
   - Qué ver: Tarjeta central flotante con efecto vidrio.

## 🛠 Estructura de Carpetas UI
- `components/ui`: Átomos (Button, Card, Input).
- `components/tenant`: Bloques específicos para landings de clientes.
- `lib/tenants.ts`: Configuración simulada de branding (Logo, textos).
- `app/t/[tenant]`: Rutas públicas del tenant (Landing, Store).
- `app/app/[tenant]`: Rutas privadas del tenant (Dashboard).
