-- Aseguramos que RLS esté activo en todas las tablas nuevas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Función helper para validar acceso (si no existe, la creamos)
CREATE OR REPLACE FUNCTION public.has_tenant_access(requested_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Permite si el usuario actual tiene una membresía en el tenant solicitado
  RETURN EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE user_id = auth.uid()
      AND tenant_id = requested_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- POLÍTICAS GENERALES ---

-- Tenants: Lectura pública (para login/resolución), escritura restringida
DROP POLICY IF EXISTS "Public read tenants" ON tenants;
CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);

-- Memberships: Ver propias membresías
DROP POLICY IF EXISTS "User can see own memberships" ON tenant_memberships;
CREATE POLICY "User can see own memberships" ON tenant_memberships
    FOR SELECT USING (auth.uid() = user_id);

-- --- POLÍTICAS DE NEGOCIO (Patrón Repetible) ---

-- Customers
DROP POLICY IF EXISTS "Tenant isolation for customers" ON customers;
CREATE POLICY "Tenant isolation for customers" ON customers
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Motorcycles
DROP POLICY IF EXISTS "Tenant isolation for motorcycles" ON motorcycles;
CREATE POLICY "Tenant isolation for motorcycles" ON motorcycles
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Inventory
DROP POLICY IF EXISTS "Tenant isolation for inventory" ON inventory_items;
CREATE POLICY "Tenant isolation for inventory" ON inventory_items
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Work Orders
DROP POLICY IF EXISTS "Tenant isolation for work_orders" ON work_orders;
CREATE POLICY "Tenant isolation for work_orders" ON work_orders
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Work Order Lines
DROP POLICY IF EXISTS "Tenant isolation for work_order_lines" ON work_order_lines;
CREATE POLICY "Tenant isolation for work_order_lines" ON work_order_lines
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));

-- Invoices
DROP POLICY IF EXISTS "Tenant isolation for invoices" ON invoices;
CREATE POLICY "Tenant isolation for invoices" ON invoices
    ALL USING (has_tenant_access(tenant_id))
    WITH CHECK (has_tenant_access(tenant_id));
