-- =====================================================
-- SCHEMA DO BANCO DE DADOS - E-COMMERCE ALSPORTS
-- Versão: 2.0 - Com Propriedades ACID e Isolamento de Usuários
-- =====================================================
-- Este schema garante:
-- - Atomicidade: Transações e stored procedures
-- - Consistência: CHECK constraints, FOREIGN KEY, NOT NULL
-- - Isolamento: Row Level Security (RLS) e locks
-- - Durabilidade: Garantido pelo PostgreSQL
-- - Isolamento de Usuários: Cada usuário vê apenas seus próprios pedidos
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ENUMS
-- =====================================================

-- Status dos pedidos
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'aguardando_pagamento',
    'pagamento_confirmado',
    'preparando_pedido',
    'enviado',
    'em_transito',
    'entregue',
    'cancelado',
    'devolvido'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tipos de usuário
DO $$ BEGIN
  CREATE TYPE user_types AS ENUM (
    'cliente',
    'admin',
    'vendedor'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Métodos de pagamento
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'pix',
    'cartao_credito',
    'cartao_debito',
    'boleto',
    'transferencia'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Status de pagamento
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pendente',
    'processando',
    'aprovado',
    'rejeitado',
    'cancelado'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de usuários (extensão do auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  user_types user_types DEFAULT 'cliente' NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT profiles_birth_date_valid CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE)
);

-- Endereços dos usuários
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Casa", "Trabalho", etc.
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT addresses_zip_code_format CHECK (zip_code ~ '^[0-9]{8}$')
);

-- Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT categories_sort_order_non_negative CHECK (sort_order >= 0)
);

-- Subcategorias
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- UNIQUE constraint
  UNIQUE(category_id, slug),
  
  -- CHECK constraints
  CONSTRAINT subcategories_sort_order_non_negative CHECK (sort_order >= 0)
);

-- Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  wholesale_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  barcode TEXT,
  weight DECIMAL(8,3), -- em kg
  dimensions JSONB, -- {width, height, depth} em cm
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  is_on_sale BOOLEAN DEFAULT FALSE NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  min_stock INTEGER DEFAULT 0 NOT NULL,
  max_stock INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT products_price_positive CHECK (price >= 0),
  CONSTRAINT products_wholesale_price_positive CHECK (wholesale_price >= 0),
  CONSTRAINT products_cost_price_positive CHECK (cost_price IS NULL OR cost_price >= 0),
  CONSTRAINT products_weight_positive CHECK (weight IS NULL OR weight > 0),
  CONSTRAINT products_stock_quantity_non_negative CHECK (stock_quantity >= 0),
  CONSTRAINT products_min_stock_non_negative CHECK (min_stock >= 0),
  CONSTRAINT products_max_stock_valid CHECK (max_stock IS NULL OR max_stock >= min_stock),
  CONSTRAINT products_wholesale_vs_price CHECK (wholesale_price <= price)
);

-- Imagens dos produtos
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT product_images_sort_order_non_negative CHECK (sort_order >= 0)
);

-- Faixas de preço por quantidade
CREATE TABLE IF NOT EXISTS public.price_ranges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT price_ranges_min_quantity_positive CHECK (min_quantity > 0),
  CONSTRAINT price_ranges_max_quantity_valid CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  CONSTRAINT price_ranges_price_positive CHECK (price >= 0)
);

-- Pedidos
-- IMPORTANTE: user_id é NOT NULL para garantir que cada pedido pertence a um usuário
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- Número do pedido (ex: "ALS-2024-001")
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT, -- RESTRICT para proteger pedidos
  status order_status DEFAULT 'aguardando_pagamento' NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0 NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL, -- Endereço de entrega
  billing_address JSONB, -- Endereço de cobrança
  notes TEXT,
  tracking_code TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints para garantir consistência
  CONSTRAINT orders_subtotal_positive CHECK (subtotal >= 0),
  CONSTRAINT orders_shipping_cost_non_negative CHECK (shipping_cost >= 0),
  CONSTRAINT orders_discount_amount_non_negative CHECK (discount_amount >= 0),
  CONSTRAINT orders_total_amount_positive CHECK (total_amount > 0),
  CONSTRAINT orders_total_amount_consistency CHECK (
    ABS(total_amount - (subtotal + shipping_cost - discount_amount)) < 0.01
  )
);

-- Itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, -- Nome do produto no momento da compra
  product_sku TEXT,
  product_image_url TEXT,
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints para garantir consistência
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_positive CHECK (unit_price >= 0),
  CONSTRAINT order_items_total_price_positive CHECK (total_price >= 0),
  CONSTRAINT order_items_total_price_consistency CHECK (
    ABS(total_price - (quantity * unit_price)) < 0.01
  )
);

-- Histórico de status dos pedidos
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pendente' NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id TEXT,
  gateway_response JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT payments_amount_positive CHECK (amount > 0)
);

-- Pedidos via WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'aguardando_pagamento' NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL, -- Array de itens do pedido
  shipping_address JSONB, -- Endereço de entrega
  notes TEXT,
  whatsapp_message TEXT, -- Mensagem enviada via WhatsApp
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- CHECK constraints
  CONSTRAINT whatsapp_orders_subtotal_positive CHECK (subtotal >= 0),
  CONSTRAINT whatsapp_orders_shipping_cost_non_negative CHECK (shipping_cost >= 0),
  CONSTRAINT whatsapp_orders_total_amount_positive CHECK (total_amount > 0),
  CONSTRAINT whatsapp_orders_email_format CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Configurações do sistema
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at);

-- Índices para pedidos (críticos para isolamento de usuários)
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);

-- Índices para itens de pedidos
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- Índices para histórico de status
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created ON public.order_status_history(created_at);

-- Índices para pagamentos
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Índices para endereços
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_default ON public.addresses(user_id, is_default);

-- Índices para WhatsApp orders
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_email ON public.whatsapp_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_status ON public.whatsapp_orders(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_number ON public.whatsapp_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_created ON public.whatsapp_orders(created_at);

-- =====================================================
-- 4. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at em todas as tabelas relevantes
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_addresses_updated_at ON public.addresses;
CREATE TRIGGER trigger_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER trigger_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_payments_updated_at ON public.payments;
CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_settings_updated_at ON public.settings;
CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_whatsapp_orders_updated_at ON public.whatsapp_orders;
CREATE TRIGGER trigger_whatsapp_orders_updated_at
  BEFORE UPDATE ON public.whatsapp_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número do pedido com lock (garante atomicidade)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_part INTEGER;
  order_number TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Usar SELECT FOR UPDATE para garantir atomicidade e evitar race conditions
  -- Lock na tabela orders para garantir isolamento
  LOCK TABLE public.orders IN EXCLUSIVE MODE;
  
  -- Buscar o próximo número da sequência para o ano atual
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_part
  FROM public.orders
  WHERE order_number LIKE 'ALS-' || year_part || '-%';
  
  -- Formatar o número do pedido
  order_number := 'ALS-' || year_part || '-' || LPAD(sequence_part::TEXT, 6, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido automaticamente
DROP TRIGGER IF EXISTS trigger_orders_generate_number ON public.orders;
CREATE OR REPLACE FUNCTION trigger_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_generate_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_order_number();

-- Função para registrar mudança de status automaticamente
DROP TRIGGER IF EXISTS trigger_orders_log_status ON public.orders;
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou, registrar no histórico
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, notes, updated_by)
    VALUES (NEW.id, NEW.status, 
            COALESCE('Status alterado de ' || OLD.status::TEXT || ' para ' || NEW.status::TEXT, 'Status alterado automaticamente'),
            NULL);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_log_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Função para validar e calcular total_amount automaticamente
CREATE OR REPLACE FUNCTION validate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Garantir que total_amount seja consistente
  IF ABS(NEW.total_amount - (NEW.subtotal + NEW.shipping_cost - NEW.discount_amount)) >= 0.01 THEN
    NEW.total_amount := NEW.subtotal + NEW.shipping_cost - NEW.discount_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_validate_totals ON public.orders;
CREATE TRIGGER trigger_orders_validate_totals
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_totals();

-- Função para validar total_price em order_items
CREATE OR REPLACE FUNCTION validate_order_item_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Garantir que total_price seja consistente
  IF ABS(NEW.total_price - (NEW.quantity * NEW.unit_price)) >= 0.01 THEN
    NEW.total_price := NEW.quantity * NEW.unit_price;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_order_items_validate_totals ON public.order_items;
CREATE TRIGGER trigger_order_items_validate_totals
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_item_totals();

-- =====================================================
-- 5. STORED PROCEDURES PARA ATOMICIDADE
-- =====================================================

-- Função transacional para criar pedido completo (garante atomicidade)
CREATE OR REPLACE FUNCTION create_order_complete(
  p_user_id UUID,
  p_order_number TEXT DEFAULT NULL,
  p_subtotal DECIMAL(10,2),
  p_shipping_cost DECIMAL(10,2) DEFAULT 0,
  p_discount_amount DECIMAL(10,2) DEFAULT 0,
  p_shipping_address JSONB,
  p_billing_address JSONB DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_items JSONB, -- Array de itens: [{"product_id": uuid, "product_name": text, "quantity": int, "unit_price": decimal, ...}]
  p_payment_method payment_method DEFAULT 'pix'
)
RETURNS JSONB AS $$
DECLARE
  v_order_id UUID;
  v_total_amount DECIMAL(10,2);
  v_order_number TEXT;
  v_item JSONB;
  v_result JSONB;
BEGIN
  -- Calcular total
  v_total_amount := p_subtotal + p_shipping_cost - p_discount_amount;
  
  -- Gerar número do pedido se não fornecido
  IF p_order_number IS NULL OR p_order_number = '' THEN
    v_order_number := generate_order_number();
  ELSE
    v_order_number := p_order_number;
  END IF;
  
  -- Inserir pedido (transação começa aqui)
  INSERT INTO public.orders (
    order_number,
    user_id,
    status,
    subtotal,
    shipping_cost,
    discount_amount,
    total_amount,
    shipping_address,
    billing_address,
    notes
  ) VALUES (
    v_order_number,
    p_user_id,
    'aguardando_pagamento',
    p_subtotal,
    p_shipping_cost,
    p_discount_amount,
    v_total_amount,
    p_shipping_address,
    p_billing_address,
    p_notes
  ) RETURNING id INTO v_order_id;
  
  -- Inserir histórico de status
  INSERT INTO public.order_status_history (order_id, status, notes, updated_by)
  VALUES (v_order_id, 'aguardando_pagamento', 'Pedido criado', p_user_id);
  
  -- Inserir itens do pedido
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_sku,
      product_image_url,
      size,
      color,
      quantity,
      unit_price,
      total_price
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      v_item->>'product_sku',
      v_item->>'product_image_url',
      v_item->>'size',
      v_item->>'color',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::DECIMAL(10,2),
      (v_item->>'quantity')::INTEGER * (v_item->>'unit_price')::DECIMAL(10,2)
    );
  END LOOP;
  
  -- Inserir registro de pagamento
  INSERT INTO public.payments (
    order_id,
    method,
    status,
    amount
  ) VALUES (
    v_order_id,
    p_payment_method,
    'pendente',
    v_total_amount
  );
  
  -- Retornar resultado
  v_result := jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total_amount', v_total_amount
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, rollback automático (garante atomicidade)
    RAISE EXCEPTION 'Erro ao criar pedido: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RLS (Row Level Security) - Isolamento de Usuários
-- =====================================================

-- Habilitar RLS em todas as tabelas que contêm dados sensíveis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem (para recriar)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
            AND tablename IN ('profiles', 'addresses', 'orders', 'order_items', 'order_status_history', 'payments'))
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Users can view own %s" ON public.%I', r.tablename, r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Users can update own %s" ON public.%I', r.tablename, r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert own %s" ON public.%I', r.tablename, r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete own %s" ON public.%I', r.tablename, r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Admin can view all %s" ON public.%I', r.tablename, r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Admin can manage all %s" ON public.%I', r.tablename, r.tablename);
  END LOOP;
END $$;

-- =====================================================
-- POLÍTICAS RLS PARA PROFILES
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil (registro inicial)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin pode ver todos os perfis
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode atualizar todos os perfis
CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA ADDRESSES
-- =====================================================

-- Usuários podem ver seus próprios endereços
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir seus próprios endereços
CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios endereços
CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios endereços
CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Admin pode ver todos os endereços
CREATE POLICY "Admin can view all addresses" ON public.addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA ORDERS (CRÍTICO PARA ISOLAMENTO)
-- =====================================================

-- Usuários podem ver APENAS seus próprios pedidos
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir pedidos apenas para si mesmos
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários NÃO podem atualizar pedidos (apenas admin)
-- Não criar política de UPDATE para usuários comuns

-- Admin pode ver todos os pedidos
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode atualizar todos os pedidos
CREATE POLICY "Admin can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode inserir pedidos (para suporte)
CREATE POLICY "Admin can insert orders" ON public.orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA ORDER_ITEMS
-- =====================================================

-- Usuários podem ver itens apenas de seus próprios pedidos
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Usuários podem inserir itens apenas em seus próprios pedidos
CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin pode ver todos os itens
CREATE POLICY "Admin can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode gerenciar todos os itens
CREATE POLICY "Admin can manage all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA ORDER_STATUS_HISTORY
-- =====================================================

-- Usuários podem ver histórico apenas de seus próprios pedidos
CREATE POLICY "Users can view own order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin pode ver todo histórico
CREATE POLICY "Admin can view all order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode inserir histórico
CREATE POLICY "Admin can insert order status history" ON public.order_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA PAYMENTS
-- =====================================================

-- Usuários podem ver pagamentos apenas de seus próprios pedidos
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Usuários podem inserir pagamentos apenas em seus próprios pedidos
CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin pode ver todos os pagamentos
CREATE POLICY "Admin can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode gerenciar todos os pagamentos
CREATE POLICY "Admin can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- POLÍTICAS PÚBLICAS PARA PRODUTOS E CATEGORIAS
-- =====================================================

-- Qualquer um pode ver categorias ativas
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Qualquer um pode ver subcategorias ativas
CREATE POLICY "Anyone can view active subcategories" ON public.subcategories
  FOR SELECT USING (is_active = true);

-- Qualquer um pode ver produtos ativos
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Qualquer um pode ver imagens de produtos
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

-- Qualquer um pode ver faixas de preço
CREATE POLICY "Anyone can view price ranges" ON public.price_ranges
  FOR SELECT USING (true);

-- =====================================================
-- 7. VIEWS ÚTEIS
-- =====================================================

-- View para produtos com informações completas
DROP VIEW IF EXISTS public.products_with_details;
CREATE VIEW public.products_with_details AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  s.name as subcategory_name,
  s.slug as subcategory_slug,
  pi.image_url as primary_image
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.subcategories s ON p.subcategory_id = s.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE p.is_active = true;

-- View para pedidos com informações do cliente (com RLS)
DROP VIEW IF EXISTS public.orders_with_customer;
CREATE VIEW public.orders_with_customer AS
SELECT 
  o.*,
  p.full_name as customer_name,
  p.email as customer_email,
  p.phone as customer_phone
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id;

-- Habilitar RLS na view
ALTER VIEW public.orders_with_customer SET (security_invoker = true);

-- View para acompanhamento de pedidos
DROP VIEW IF EXISTS public.order_tracking;
CREATE VIEW public.order_tracking AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.total_amount,
  o.created_at,
  o.estimated_delivery,
  o.tracking_code,
  p.full_name as customer_name,
  p.email as customer_email,
  p.phone as customer_phone,
  o.shipping_address,
  -- Último status do histórico
  (
    SELECT jsonb_build_object(
      'status', osh.status,
      'created_at', osh.created_at,
      'notes', osh.notes
    )
    FROM public.order_status_history osh
    WHERE osh.order_id = o.id
    ORDER BY osh.created_at DESC
    LIMIT 1
  ) as last_status_update,
  -- Histórico completo de status
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'status', osh.status,
        'created_at', osh.created_at,
        'notes', osh.notes
      ) ORDER BY osh.created_at
    )
    FROM public.order_status_history osh
    WHERE osh.order_id = o.id
  ) as status_history
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id;

ALTER VIEW public.order_tracking SET (security_invoker = true);

-- =====================================================
-- 8. DADOS INICIAIS
-- =====================================================

-- Inserir configurações padrão (se não existirem)
INSERT INTO public.settings (key, value, description) VALUES
('site_name', '"AlSports"', 'Nome do site'),
('site_description', '"E-commerce de produtos esportivos"', 'Descrição do site'),
('contact_phone', '"(11) 99999-9999"', 'Telefone de contato'),
('contact_email', '"contato@alsports.com.br"', 'Email de contato'),
('shipping_free_minimum', '500.00', 'Valor mínimo para frete grátis'),
('shipping_cost', '15.00', 'Custo padrão do frete'),
('min_order_value', '50.00', 'Valor mínimo do pedido'),
('max_installments', '12', 'Máximo de parcelas'),
('whatsapp_number', '"+5521994595532"', 'Número do WhatsApp'),
('instagram_url', '"https://instagram.com/alsports"', 'URL do Instagram'),
('facebook_url', '"https://facebook.com/alsports"', 'URL do Facebook')
ON CONFLICT (key) DO NOTHING;

-- Inserir categorias de exemplo (se não existirem)
INSERT INTO public.categories (name, slug, description, is_active, sort_order) VALUES
('Futebol', 'futebol', 'Produtos para futebol', true, 1),
('Basquete', 'basquete', 'Produtos para basquete', true, 2),
('Tênis', 'tenis', 'Tênis esportivos', true, 3),
('Roupas', 'roupas', 'Roupas esportivas', true, 4),
('Acessórios', 'acessorios', 'Acessórios esportivos', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Inserir subcategorias de exemplo (se não existirem)
INSERT INTO public.subcategories (category_id, name, slug, description, is_active, sort_order) VALUES
((SELECT id FROM public.categories WHERE slug = 'futebol' LIMIT 1), 'Chuteiras', 'chuteiras', 'Chuteiras de futebol', true, 1),
((SELECT id FROM public.categories WHERE slug = 'futebol' LIMIT 1), 'Bolas', 'bolas', 'Bolas de futebol', true, 2),
((SELECT id FROM public.categories WHERE slug = 'basquete' LIMIT 1), 'Tênis de Basquete', 'tenis-basquete', 'Tênis para basquete', true, 1),
((SELECT id FROM public.categories WHERE slug = 'basquete' LIMIT 1), 'Bolas de Basquete', 'bolas-basquete', 'Bolas de basquete', true, 2),
((SELECT id FROM public.categories WHERE slug = 'tenis' LIMIT 1), 'Tênis de Corrida', 'tenis-corrida', 'Tênis para corrida', true, 1),
((SELECT id FROM public.categories WHERE slug = 'tenis' LIMIT 1), 'Tênis Casual', 'tenis-casual', 'Tênis casuais', true, 2)
ON CONFLICT (category_id, slug) DO NOTHING;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Mensagem de confirmação
DO $$ 
BEGIN
  RAISE NOTICE '✅ Schema do banco de dados criado com sucesso!';
  RAISE NOTICE '📋 Propriedades ACID garantidas:';
  RAISE NOTICE '   - Atomicidade: Stored procedures transacionais';
  RAISE NOTICE '   - Consistência: CHECK constraints e validações';
  RAISE NOTICE '   - Isolamento: RLS e locks adequados';
  RAISE NOTICE '   - Durabilidade: Garantido pelo PostgreSQL';
  RAISE NOTICE '🔒 Isolamento de usuários: Cada usuário vê apenas seus próprios pedidos';
END $$;

