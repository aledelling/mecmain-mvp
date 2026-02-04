-- Activar RLS en todas las tablas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Función helper para saber si el usuario actual tiene acceso al tenant X
CREATE OR REPLACE FUNCTION public.has_tenant_access(requested_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE user_id = auth.uid()
      AND tenant_id = requested_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS

-- Tenants: Todos pueden leer el tenant público si saben el slug (para resolver el login)
-- Pero para editar, solo si eres miembro.
CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);

-- Customers: Solo ver si eres miembro del tenant
CREATE POLICY "Tenant isolation for customers" ON customers
    USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Memberships: Un usuario puede ver sus propias membresías
CREATE POLICY "User can see own memberships" ON tenant_memberships
    FOR SELECT USING (auth.uid() = user_id);
