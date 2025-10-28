-- =====================================================
-- SCHEMA DO BANCO DE DADOS - E-COMMERCE ALSPORTS
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ENUMS
-- =====================================================

-- Status dos pedidos
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

-- Tipos de usuário
CREATE TYPE user_types AS ENUM (
  'cliente',
  'admin',
  'vendedor'
);

-- Métodos de pagamento
CREATE TYPE payment_method AS ENUM (
  'pix',
  'cartao_credito',
  'cartao_debito',
  'boleto',
  'transferencia'
);

-- Status de pagamento
CREATE TYPE payment_status AS ENUM (
  'pendente',
  'processando',
  'aprovado',
  'rejeitado',
  'cancelado'
);

-- =====================================================
-- 2. TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de usuários (extensão do auth.users do Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  user_types user_types DEFAULT 'cliente',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Endereços dos usuários
CREATE TABLE public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Casa", "Trabalho", etc.
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorias
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategorias
CREATE TABLE public.subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Produtos
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
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
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imagens dos produtos
CREATE TABLE public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faixas de preço por quantidade
CREATE TABLE public.price_ranges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pedidos
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- Número do pedido (ex: "ALS-2024-001")
  user_id UUID REFERENCES public.profiles(id),
  status order_status DEFAULT 'aguardando_pagamento',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL, -- Endereço de entrega
  billing_address JSONB, -- Endereço de cobrança
  notes TEXT,
  tracking_code TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL, -- Nome do produto no momento da compra
  product_sku TEXT,
  product_image_url TEXT,
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de status dos pedidos
CREATE TABLE public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pagamentos
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pendente',
  amount DECIMAL(10,2) NOT NULL,
  transaction_id TEXT,
  gateway_response JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pedidos via WhatsApp
CREATE TABLE public.whatsapp_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'aguardando_pagamento',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL, -- Array de itens do pedido
  shipping_address JSONB, -- Endereço de entrega
  notes TEXT,
  whatsapp_message TEXT, -- Mensagem enviada via WhatsApp
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações do sistema
CREATE TABLE public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_sku ON public.products(sku);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_created ON public.orders(created_at);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

CREATE INDEX idx_whatsapp_orders_email ON public.whatsapp_orders(customer_email);
CREATE INDEX idx_whatsapp_orders_status ON public.whatsapp_orders(status);
CREATE INDEX idx_whatsapp_orders_number ON public.whatsapp_orders(order_number);
CREATE INDEX idx_whatsapp_orders_created ON public.whatsapp_orders(created_at);

CREATE INDEX idx_order_status_history_order ON public.order_status_history(order_id);
CREATE INDEX idx_order_status_history_created ON public.order_status_history(created_at);

CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- =====================================================
-- 4. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_part TEXT;
  order_number TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Buscar o próximo número da sequência para o ano atual
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_part
  FROM public.orders
  WHERE order_number LIKE 'ALS-' || year_part || '-%';
  
  -- Formatar o número do pedido
  order_number := 'ALS-' || year_part || '-' || LPAD(sequence_part::TEXT, 3, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido automaticamente
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

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at em todas as tabelas relevantes
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para registrar mudança de status
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou, registrar no histórico
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, notes, updated_by)
    VALUES (NEW.id, NEW.status, 'Status alterado automaticamente', NULL);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_log_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- =====================================================
-- 5. RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Políticas para order_status_history
CREATE POLICY "Users can view own order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Políticas para payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Políticas públicas para produtos e categorias
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active subcategories" ON public.subcategories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view price ranges" ON public.price_ranges
  FOR SELECT USING (true);

-- Políticas para ADMIN acessar todos os dados
-- Admin pode ver todos os perfis
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode ver todos os pedidos
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode ver todos os itens de pedidos
CREATE POLICY "Admin can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- Admin pode ver todo histórico de status
CREATE POLICY "Admin can view all order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
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
-- 6. DADOS INICIAIS
-- =====================================================

-- Inserir configurações padrão
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
('facebook_url', '"https://facebook.com/alsports"', 'URL do Facebook');

-- Inserir categorias de exemplo
INSERT INTO public.categories (name, slug, description, is_active, sort_order) VALUES
('Futebol', 'futebol', 'Produtos para futebol', true, 1),
('Basquete', 'basquete', 'Produtos para basquete', true, 2),
('Tênis', 'tenis', 'Tênis esportivos', true, 3),
('Roupas', 'roupas', 'Roupas esportivas', true, 4),
('Acessórios', 'acessorios', 'Acessórios esportivos', true, 5);

-- Inserir subcategorias de exemplo
INSERT INTO public.subcategories (category_id, name, slug, description, is_active, sort_order) VALUES
((SELECT id FROM public.categories WHERE slug = 'futebol'), 'Chuteiras', 'chuteiras', 'Chuteiras de futebol', true, 1),
((SELECT id FROM public.categories WHERE slug = 'futebol'), 'Bolas', 'bolas', 'Bolas de futebol', true, 2),
((SELECT id FROM public.categories WHERE slug = 'basquete'), 'Tênis de Basquete', 'tenis-basquete', 'Tênis para basquete', true, 1),
((SELECT id FROM public.categories WHERE slug = 'basquete'), 'Bolas de Basquete', 'bolas-basquete', 'Bolas de basquete', true, 2),
((SELECT id FROM public.categories WHERE slug = 'tenis'), 'Tênis de Corrida', 'tenis-corrida', 'Tênis para corrida', true, 1),
((SELECT id FROM public.categories WHERE slug = 'tenis'), 'Tênis Casual', 'tenis-casual', 'Tênis casuais', true, 2);

-- =====================================================
-- 7. VIEWS ÚTEIS
-- =====================================================

-- View para produtos com informações completas
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

-- View para pedidos com informações do cliente
CREATE VIEW public.orders_with_customer AS
SELECT 
  o.*,
  p.full_name as customer_name,
  p.email as customer_email,
  p.phone as customer_phone
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id;

-- View para acompanhamento de pedidos
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
