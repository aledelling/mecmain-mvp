# MecMain MVP - Guía de Inicio

Bienvenido al equipo. Este proyecto es un SaaS multitenant para gestión de talleres y e-commerce.

## Requisitos
- Java 21+
- Node.js 18+ (Next.js 14)
- Docker (opcional, para BD local) o cuenta en Supabase.

## 1. Configuración de Base de Datos (Supabase)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al SQL Editor y ejecuta los scripts en **orden estricto**:
   - `supabase/schema.sql` (Schema completo incluyendo módulo Tienda).
   - `supabase/rls.sql` (Seguridad RLS actualizada).
   - `supabase/seed.sql` (Datos de prueba: tenant, inventario, productos publicados).
3. Obtén tus credenciales: `SUPABASE_URL` y `SUPABASE_KEY` (service_role para backend, anon para frontend).

## 2. Backend (Spring Boot)
El backend es el núcleo de la lógica. Usa Arquitectura Hexagonal.

```bash
cd backend
cp .env.example .env 
./mvnw spring-boot:run
```
La API correrá en `http://localhost:8080`.

## 3. Frontend (Next.js)
La interfaz de usuario "Dark Neon".

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
La app correrá en `http://localhost:3000`.

## 🧪 Cómo probar el flujo de Tienda
1. **Publicar productos (Admin):**
   - Ve a `http://localhost:3000/app/motoridersco/store/products`
   - Asegúrate de que los ítems del inventario estén publicados en la tienda.
2. **Comprar (Cliente):**
   - Ve a `http://localhost:3000/t/motoridersco/store`
   - Inicia sesión (user: `juan@example.com` / pass: lo que definas en Supabase o crea uno nuevo).
   - Agrega productos al carrito.
   - Dale a "Proceder al Pago".
3. **Verificar (Admin):**
   - Ve a `http://localhost:3000/app/motoridersco/store/orders`
   - Verás la nueva orden.
   - En `Inventario`, el stock habrá disminuido.
