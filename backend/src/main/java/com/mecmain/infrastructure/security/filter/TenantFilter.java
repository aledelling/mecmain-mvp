package com.mecmain.infrastructure.security.filter;

import com.mecmain.infrastructure.security.context.TenantContext;
import com.mecmain.infrastructure.adapter.out.persistence.repository.TenantJpaRepository;
import com.mecmain.infrastructure.adapter.out.persistence.entity.TenantEntity;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class TenantFilter extends OncePerRequestFilter {

    private final TenantJpaRepository tenantRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        // Skip endpoints públicos
        if (path.startsWith("/api/health") || path.equals("/api/tenants/resolve") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Resolución de Tenant
        // Prioridad 1: Header (Estándar para API calls desde Frontend)
        String tenantSlug = request.getHeader("X-Tenant-Slug");
        
        // Prioridad 2: Fallback desde Subdominio (para llamadas directas sin proxy en prod)
        if (tenantSlug == null) {
             // Simplificado: asumir que el host viene en header Host
             String host = request.getHeader("Host");
             if (host != null && !host.contains("localhost") && !host.contains("vercel.app")) {
                 tenantSlug = host.split("\\.")[0];
             }
        }

        if (tenantSlug != null && !tenantSlug.isEmpty()) {
            Optional<TenantEntity> tenantOpt = tenantRepository.findBySlug(tenantSlug);
            
            if (tenantOpt.isPresent()) {
                TenantContext.setTenantId(tenantOpt.get().getId());
                // log.debug("Tenant context set to: {}", tenantSlug);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid Tenant Slug: " + tenantSlug);
                return;
            }
        } else {
            // Enrutamiento estricto: Si es una llamada a la API protegida, DEBE tener tenant.
            // Para este MVP, lanzamos error si no se encuentra.
            log.warn("Tenant slug missing in request: {}", path);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing X-Tenant-Slug header or subdomain");
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // CRÍTICO: Limpiar ThreadLocal para evitar contaminación de contextos en pooling de hilos
            TenantContext.clear();
        }
    }
}