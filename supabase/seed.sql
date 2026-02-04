-- 1. Crear el tenant de prueba
INSERT INTO tenants (id, slug, name)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'motoridersco', 'MotoRiders Colombia')
ON CONFLICT (slug) DO NOTHING;

-- INSTRUCCIONES MANUALES:
-- 1. Regístrate en tu app (localhost:3000) o en Supabase Auth con un email.
-- 2. Copia tu User ID (UUID) desde el dashboard de Authentication.
-- 3. Ejecuta este SQL reemplazando TU_USER_ID_AQUI:

-- INSERT INTO tenant_memberships (tenant_id, user_id, role)
-- VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TU_USER_ID_AQUI', 'OWNER_ADMIN');
