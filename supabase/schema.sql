-- Habilitar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants (Los talleres)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL, -- ej: motoridersco
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Memberships (Relación Usuario Auth -> Tenant)
-- Nota: 'user_id' referencia a auth.users de Supabase, pero como es un schema diferente,
-- no siempre se puede hacer FK directa estricta sin permisos especiales. Lo dejamos como UUID.
CREATE TABLE tenant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL, -- auth.users.id
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER_ADMIN', 'MECHANIC', 'CASHIER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- 3. Customers (Clientes del taller)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida por tenant
CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_memberships_user ON tenant_memberships(user_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);
