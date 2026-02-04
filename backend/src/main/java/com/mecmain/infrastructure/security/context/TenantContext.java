package com.mecmain.infrastructure.security.context;

import java.util.UUID;

/**
 * Almacena el ID del Tenant para el hilo de ejecución actual.
 * Es vital limpiar esto después de cada request para evitar fugas de datos
 * entre peticiones (Pooling de hilos).
 */
public class TenantContext {
    private static final ThreadLocal<UUID> currentTenant = new ThreadLocal<>();

    public static void setTenantId(UUID tenantId) {
        currentTenant.set(tenantId);
    }

    public static UUID getTenantId() {
        return currentTenant.get();
    }

    public static void clear() {
        currentTenant.remove();
    }
}