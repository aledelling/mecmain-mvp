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
        
        // Rutas públicas que no requieren tenant (Health, Docs, etc)
        String path = request.getRequestURI();
        if (path.startsWith("/api/health") || path.equals("/api/tenants/resolve")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Estrategia 1: Header (Para DEV o llamadas directas)
        String tenantSlug = request.getHeader("X-Tenant-Slug");

        // Estrategia 2: Subdominio (PROD) - Simplificado para MVP
        // En un entorno real, parsearíamos request.getServerName()

        if (tenantSlug != null && !tenantSlug.isEmpty()) {
            Optional<TenantEntity> tenantOpt = tenantRepository.findBySlug(tenantSlug);
            
            if (tenantOpt.isPresent()) {
                TenantContext.setTenantId(tenantOpt.get().getId());
                log.debug("Tenant resolved: {} -> {}", tenantSlug, tenantOpt.get().getId());
            } else {
                // Si mandan un slug que no existe, es un 404 lógico o 400
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid Tenant Slug");
                return;
            }
        } else {
            // Nota para Junior: En producción, si la ruta es protegida y no hay tenant, denegamos.
            // Para rutas globales (landing admin), se permitiría null.
            // Aquí asumimos estricto tenant context para /api/**
            log.warn("No tenant slug provided in request to {}", path);
             // response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Tenant ID missing");
             // return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // MUY IMPORTANTE: Limpiar el contexto siempre
            TenantContext.clear();
        }
    }
}