-- Habilitar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Memberships
CREATE TABLE IF NOT EXISTS tenant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL, 
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER_ADMIN', 'MECHANIC', 'CASHIER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
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

-- 4. Motorcycles
CREATE TABLE IF NOT EXISTS motorcycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    plate VARCHAR(20) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50),
    year INT,
    displacement_cc INT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, plate)
);

-- 5. Inventory Items (Base de stock y costo)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50),
    stock INT DEFAULT 0 NOT NULL,
    low_stock_threshold INT DEFAULT 5,
    cost NUMERIC(12, 2) DEFAULT 0,
    price NUMERIC(12, 2) DEFAULT 0, -- Precio base sugerido
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, sku)
);

-- 6. Work Orders & Invoices (Core Workshop)
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    work_order_id UUID REFERENCES work_orders(id),
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MÓDULO TIENDA (E-COMMERCE)
-- ==========================================

-- 7. Store Categories
CREATE TABLE IF NOT EXISTS store_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- 8. Store Products (Máscara pública del inventario)
CREATE TABLE IF NOT EXISTS store_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id), -- Link al stock real
    name VARCHAR(200) NOT NULL, -- Puede diferir del nombre interno de inventario
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    price_override NUMERIC(12, 2), -- Si NULL, usa inventory_items.price
    image_url TEXT, -- URL simple para MVP
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, slug),
    UNIQUE(tenant_id, inventory_item_id)
);

-- 9. Store Carts (Carrito persistente por usuario)
CREATE TABLE IF NOT EXISTS store_carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL, -- Supabase Auth ID
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ORDERED', 'ABANDONED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id, status) -- Solo 1 carrito activo por usuario
);

CREATE TABLE IF NOT EXISTS store_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    cart_id UUID NOT NULL REFERENCES store_carts(id),
    product_id UUID NOT NULL REFERENCES store_products(id),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, cart_id, product_id)
);

-- 10. Store Orders (Pedidos de tienda)
CREATE TABLE IF NOT EXISTS store_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'PAID', 'SHIPPED', 'CANCELLED')),
    total NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    order_id UUID NOT NULL REFERENCES store_orders(id),
    product_id UUID NOT NULL REFERENCES store_products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL, -- Precio congelado al momento de compra
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_store_products_tenant ON store_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_store_products_slug ON store_products(slug);
CREATE INDEX IF NOT EXISTS idx_store_orders_user ON store_orders(user_id);
