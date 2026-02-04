-- Habilitar RLS en nuevas tablas
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;

-- Función helper
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

-- 1. ADMINISTROS (Membresía requerida)
-- Pueden ver/editar todo en su tenant
CREATE POLICY "Admins manage store categories" ON store_categories
    ALL USING (has_tenant_access(tenant_id));

CREATE POLICY "Admins manage store products" ON store_products
    ALL USING (has_tenant_access(tenant_id));
    
CREATE POLICY "Admins view all orders" ON store_orders
    FOR SELECT USING (has_tenant_access(tenant_id));
    
CREATE POLICY "Admins view all order items" ON store_order_items
    FOR SELECT USING (has_tenant_access(tenant_id));

-- 2. CLIENTES (Dueños del dato)
-- Carritos: solo el dueño puede ver/editar su carrito activo
CREATE POLICY "Users manage own carts" ON store_carts
    ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own cart items" ON store_cart_items
    ALL USING (
        EXISTS (SELECT 1 FROM store_carts WHERE id = cart_id AND user_id = auth.uid())
    );

-- Órdenes: solo el dueño puede ver sus órdenes (y admin arriba)
CREATE POLICY "Users view own orders" ON store_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own order items" ON store_order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM store_orders WHERE id = order_id AND user_id = auth.uid())
    );

-- 3. PÚBLICO
-- Productos: Aunque la API backend hace de gatekeeper, permitimos SELECT a autenticados 
-- para facilitar consultas complejas si fuera necesario, pero solo si están publicados.
CREATE POLICY "Auth users view published products" ON store_products
    FOR SELECT USING (is_published = true);
