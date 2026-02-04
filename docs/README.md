# MecMain MVP - Guía de Inicio

Bienvenido al equipo. Este proyecto es un SaaS multitenant para gestión de talleres.

## Requisitos
- Java 21+
- Node.js 18+ (Next.js 14)
- Docker (opcional, para BD local) o cuenta en Supabase.

## 1. Configuración de Base de Datos (Supabase)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al SQL Editor y ejecuta los scripts en **orden estricto**:
   - `supabase/schema.sql` (Crea tablas: Tenants, Customers, Motorcycles, Inventory, Orders, Invoices).
   - `supabase/rls.sql` (Configura seguridad Row Level Security).
   - `supabase/seed.sql` (Datos de prueba: tenant 'motoridersco', motos, inventario).
3. Obtén tus credenciales: `SUPABASE_URL` y `SUPABASE_KEY` (service_role para backend, anon para frontend).

## 2. Backend (Spring Boot)
El backend es el núcleo de la lógica. Usa Arquitectura Hexagonal.

```bash
cd backend
# Copia el ejemplo de variables
cp .env.example .env 
# Edita .env con tus credenciales de DB
./mvnw spring-boot:run
```

La API correrá en `http://localhost:8080`.

## 3. Frontend (Next.js)
La interfaz de usuario. Maneja la detección del tenant.

```bash
cd frontend
# Copia variables
cp .env.local.example .env.local
npm install
npm run dev
```

La app correrá en `http://localhost:3000`.

## Cómo probar Multitenancy en Local
Como no tenemos subdominios en localhost fácilmente:
1. Accede a `http://localhost:3000/t/motoridersco/dashboard`
2. Esto simula estar en `motoridersco.mecmain.com`.
3. Navega a "Motos" o "Inventario" para ver los datos del seed.

## Arquitectura
Consulta `docs/ARCHITECTURE.md` para entender la separación por capas (Hexagonal) y cómo funciona el `TenantContext`.