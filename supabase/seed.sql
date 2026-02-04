-- 1. Tenants
INSERT INTO tenants (id, slug, name)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'motoridersco', 'MotoRiders Colombia')
ON CONFLICT (slug) DO NOTHING;

-- 2. Inventario Base (Físico)
INSERT INTO inventory_items (id, tenant_id, name, sku, stock, price, cost)
VALUES
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aceite Sintético 10W40', 'OIL-SYN-1040', 50, 45000, 25000),
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Casco Arai Concept-X', 'HLMT-ARAI-CX', 5, 2800000, 2000000),
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Guantes Alpinestars', 'GLV-ALP-01', 15, 450000, 300000)
ON CONFLICT (tenant_id, sku) DO NOTHING;

-- 3. Categorías Tienda
INSERT INTO store_categories (id, tenant_id, name, slug)
VALUES
    ('cat-001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aceites', 'aceites'),
    ('cat-002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cascos', 'cascos'),
    ('cat-003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Indumentaria', 'indumentaria')
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 4. Productos Tienda (Publicados)
INSERT INTO store_products (tenant_id, inventory_item_id, name, slug, description, brand, price_override, is_published, image_url)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Aceite Premium 10W40', 'aceite-premium', 'Máxima protección para tu motor.', 'Motul', NULL, true, '🛢️'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d55', 'Casco Arai Concept-X', 'casco-arai', 'Seguridad y estilo retro.', 'Arai', 2750000, true, '🪖'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380d66', 'Guantes GP Pro', 'guantes-gp', 'Cuero de alta resistencia.', 'Alpinestars', NULL, true, '🧤')
ON CONFLICT (tenant_id, slug) DO NOTHING;
