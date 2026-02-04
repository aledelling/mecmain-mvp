-- 1. Crear el tenant de prueba
INSERT INTO tenants (id, slug, name)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'motoridersco', 'MotoRiders Colombia')
ON CONFLICT (slug) DO NOTHING;

-- 2. Crear Cliente de prueba
INSERT INTO customers (id, tenant_id, full_name, email, phone)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Juan Motero', 'juan@example.com', '3001234567')
ON CONFLICT DO NOTHING;

-- 3. Crear Motocicleta de prueba
INSERT INTO motorcycles (id, tenant_id, customer_id, plate, brand, model, year, displacement_cc)
VALUES
    ('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'XYZ-123', 'Yamaha', 'MT-09', 2023, 890)
ON CONFLICT DO NOTHING;

-- 4. Crear Inventario de prueba
INSERT INTO inventory_items (id, tenant_id, name, sku, stock, price, cost)
VALUES
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aceite Sintético 10W40', 'OIL-SYN-1040', 50, 45000, 25000),
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Filtro Aire MT-09', 'FIL-AIR-MT09', 10, 85000, 50000)
ON CONFLICT DO NOTHING;

-- INSTRUCCIONES POST-SEED:
-- Para probar login, recuerda insertar manualmente tu user_id en tenant_memberships:
-- INSERT INTO tenant_memberships (tenant_id, user_id, role) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TU_UID_DE_SUPABASE', 'OWNER_ADMIN');
