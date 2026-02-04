# Arquitectura de MecMain

Este documento explica las decisiones técnicas para desarrolladores Junior/Mid.

## Patrón: Arquitectura Hexagonal (Ports & Adapters)
Queremos que el núcleo de nuestro negocio (Dominio) no dependa de frameworks externos.

1. **Domain (`com.mecmain.domain`)**: 
   - Aquí viven las entidades (`Customer`, `WorkOrder`) y excepciones de negocio. 
   - **Regla**: Prohibido importar `org.springframework.*` o librerías de persistencia aquí. Solo Java puro.

2. **Application (`com.mecmain.application`)**:
   - **Ports**: Interfaces que definen qué necesitamos (ej. `LoadCustomerPort`) o qué ofrecemos (`CreateCustomerUseCase`).
   - **Services**: Implementan los casos de uso. Orquestan el dominio.

3. **Infrastructure (`com.mecmain.infrastructure`)**:
   - **Adapters In**: Controladores REST (`Web`). Reciben HTTP y llaman a los UseCases.
   - **Adapters Out**: Persistencia (`JPA`), Emails, PDFs. Implementan los puertos de salida.
   - **Config**: Beans de Spring, Seguridad.

## Multitenancy (La joya de la corona)
Somos un SaaS. Varios talleres usan la misma BD.

### Estrategia: Discriminator Column
Todas las tablas críticas tienen `tenant_id` (UUID).

### Flujo de un Request
1. **Request llega**: `GET /api/customers`
2. **TenantFilter**:
   - Busca el header `X-Tenant-Slug` (o subdominio).
   - Valida que el tenant exista en DB.
   - Guarda el `tenantId` en un `TenantContext` (ThreadLocal).
3. **SecurityFilter**:
   - Valida el JWT de Supabase.
   - Valida que el usuario del JWT pertenezca al tenant actual (`tenant_memberships`).
4. **Service/Adapter**:
   - Cuando vamos a guardar o buscar en DB, el adaptador **SIEMPRE** inyecta el `TenantContext.getTenantId()`.
   - **Nunca** confiamos en que el frontend nos envíe el ID del tenant en el body del JSON para operaciones de seguridad.

## Frontend
Next.js usa Middleware para reescribir URLs.
- Usuario entra a `motoridersco.mecmain.com` -> Middleware lo reescribe internamente a `/app/motoridersco/...`.
- Esto nos permite manejar múltiples tenants con una sola instancia de despliegue.
