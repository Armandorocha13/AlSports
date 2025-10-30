-- =====================================================
-- MIGRAÇÃO: Garantir estrutura correta da tabela orders
-- =====================================================
-- Esta migração garante que a tabela orders tenha todas as colunas necessárias
-- conforme definido no schema.sql

-- ============================================
-- PASSO 1: Garantir que o ENUM order_status existe
-- ============================================
-- IMPORTANTE: Execute a migração 000_create_enums_first.sql ANTES desta!
DO $$ 
BEGIN
  -- Verificar se o ENUM existe
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    -- Criar ENUM do zero
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
    RAISE NOTICE '✅ ENUM order_status criado com sucesso';
  ELSE
    RAISE NOTICE '✅ ENUM order_status já existe no banco';
  END IF;
END $$;

-- Verificar se a tabela orders existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    -- Criar tabela completa se não existir
    CREATE TABLE public.orders (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id UUID REFERENCES public.profiles(id),
      status order_status DEFAULT 'aguardando_pagamento',
      subtotal DECIMAL(10,2) NOT NULL,
      shipping_cost DECIMAL(10,2) DEFAULT 0,
      discount_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address JSONB NOT NULL,
      billing_address JSONB,
      notes TEXT,
      tracking_code TEXT,
      estimated_delivery DATE,
      delivered_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Se a tabela já existe, adicionar colunas que possam estar faltando
    
    -- Adicionar order_number se não existir (OBRIGATÓRIO)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_number') THEN
      ALTER TABLE public.orders ADD COLUMN order_number TEXT;
      RAISE NOTICE 'Coluna order_number adicionada à tabela orders';
    END IF;
    
    -- Adicionar status se não existir (OBRIGATÓRIO com DEFAULT)
    -- IMPORTANTE: Garantir que o ENUM order_status existe antes de criar a coluna
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status') THEN
      -- Verificar se o ENUM existe antes de criar a coluna
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        ALTER TABLE public.orders ADD COLUMN status order_status DEFAULT 'aguardando_pagamento';
        RAISE NOTICE 'Coluna status adicionada à tabela orders';
      ELSE
        RAISE EXCEPTION 'ENUM order_status não existe. Execute a migração completa desde o início.';
      END IF;
    ELSE
      -- Se a coluna já existe, verificar se usa o tipo correto
      -- Se não usar o ENUM correto, não podemos alterar facilmente sem recriar
      -- Por enquanto apenas logamos um aviso
      RAISE NOTICE 'Coluna status já existe na tabela orders';
    END IF;
    
    -- Adicionar subtotal se não existir (OBRIGATÓRIO)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'subtotal') THEN
      ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2);
      -- Preencher valores nulos
      UPDATE public.orders SET subtotal = 0 WHERE subtotal IS NULL;
      ALTER TABLE public.orders ALTER COLUMN subtotal SET NOT NULL;
      RAISE NOTICE 'Coluna subtotal adicionada à tabela orders';
    END IF;
    
    -- Adicionar shipping_cost se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_cost') THEN
      ALTER TABLE public.orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
      RAISE NOTICE 'Coluna shipping_cost adicionada à tabela orders';
    END IF;
    
    -- Adicionar total_amount se não existir (OBRIGATÓRIO)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_amount') THEN
      ALTER TABLE public.orders ADD COLUMN total_amount DECIMAL(10,2);
      -- Preencher valores nulos
      UPDATE public.orders SET total_amount = 0 WHERE total_amount IS NULL;
      ALTER TABLE public.orders ALTER COLUMN total_amount SET NOT NULL;
      RAISE NOTICE 'Coluna total_amount adicionada à tabela orders';
    END IF;
    
    -- Adicionar discount_amount se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'discount_amount') THEN
      ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
      RAISE NOTICE 'Coluna discount_amount adicionada à tabela orders';
    END IF;
    
    -- Adicionar shipping_address se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_address') THEN
      ALTER TABLE public.orders ADD COLUMN shipping_address JSONB;
      -- Preencher com valor padrão se houver registros existentes
      UPDATE public.orders SET shipping_address = '{}'::jsonb WHERE shipping_address IS NULL;
      -- Tornar NOT NULL após preencher valores nulos
      ALTER TABLE public.orders ALTER COLUMN shipping_address SET NOT NULL;
      RAISE NOTICE 'Coluna shipping_address adicionada à tabela orders';
    ELSE
      -- Se a coluna existe mas permite NULL, garantir que não aceita NULL
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' 
                 AND column_name = 'shipping_address' AND is_nullable = 'YES') THEN
        -- Preencher valores nulos com objeto vazio
        UPDATE public.orders SET shipping_address = '{}'::jsonb WHERE shipping_address IS NULL;
        -- Tornar NOT NULL
        ALTER TABLE public.orders ALTER COLUMN shipping_address SET NOT NULL;
        RAISE NOTICE 'Coluna shipping_address alterada para NOT NULL';
      END IF;
    END IF;
    
    -- Adicionar billing_address se não existir (é opcional, pode ser NULL)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'billing_address') THEN
      ALTER TABLE public.orders ADD COLUMN billing_address JSONB;
      RAISE NOTICE 'Coluna billing_address adicionada à tabela orders';
    END IF;
    
    -- Adicionar notes se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'notes') THEN
      ALTER TABLE public.orders ADD COLUMN notes TEXT;
      RAISE NOTICE 'Coluna notes adicionada à tabela orders';
    END IF;
    
    -- Adicionar created_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'created_at') THEN
      ALTER TABLE public.orders ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      RAISE NOTICE 'Coluna created_at adicionada à tabela orders';
    END IF;
    
    -- Adicionar updated_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'updated_at') THEN
      ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      RAISE NOTICE 'Coluna updated_at adicionada à tabela orders';
    END IF;
    
    -- Adicionar outras colunas opcionais se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'tracking_code') THEN
      ALTER TABLE public.orders ADD COLUMN tracking_code TEXT;
      RAISE NOTICE 'Coluna tracking_code adicionada à tabela orders';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'estimated_delivery') THEN
      ALTER TABLE public.orders ADD COLUMN estimated_delivery DATE;
      RAISE NOTICE 'Coluna estimated_delivery adicionada à tabela orders';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivered_at') THEN
      ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
      RAISE NOTICE 'Coluna delivered_at adicionada à tabela orders';
    END IF;
    
    -- Verificar se a constraint UNIQUE em order_number existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_schema = 'public' AND table_name = 'orders' 
                   AND constraint_name LIKE '%order_number%' AND constraint_type = 'UNIQUE') THEN
      CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_unique ON public.orders(order_number);
      RAISE NOTICE 'Constraint UNIQUE em order_number criada';
    END IF;
    
  END IF;
END $$;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);

-- Verificar se a tabela order_items existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
    CREATE TABLE public.order_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES public.products(id),
      product_name TEXT NOT NULL,
      product_sku TEXT,
      product_image_url TEXT,
      size TEXT,
      color TEXT,
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE 'Tabela order_items criada';
  END IF;
END $$;

-- Criar índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- Verificar se a tabela order_status_history existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_status_history') THEN
    CREATE TABLE public.order_status_history (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
      status order_status NOT NULL,
      notes TEXT,
      updated_by UUID REFERENCES public.profiles(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE 'Tabela order_status_history criada';
  END IF;
END $$;

-- Criar índices para order_status_history
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created ON public.order_status_history(created_at);

-- Verificar se a tabela payments existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    -- Verificar se o ENUM payment_method existe
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
      CREATE TYPE payment_method AS ENUM (
        'pix',
        'cartao_credito',
        'cartao_debito',
        'boleto',
        'transferencia'
      );
    END IF;
    
    -- Verificar se o ENUM payment_status existe
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
      CREATE TYPE payment_status AS ENUM (
        'pendente',
        'processando',
        'aprovado',
        'rejeitado',
        'cancelado'
      );
    END IF;
    
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
    RAISE NOTICE 'Tabela payments criada';
  END IF;
END $$;

-- Criar índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Mensagem final de conclusão
DO $$ 
BEGIN
  RAISE NOTICE 'Migração concluída: Estrutura da tabela orders verificada e atualizada';
END $$;

