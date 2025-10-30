-- =====================================================
-- CORREÇÃO: Criar tabelas relacionadas (order_items e order_status_history)
-- =====================================================
-- Execute este script para criar/verificar as tabelas que faltam

-- ============================================
-- PARTE 1: Criar tabela order_status_history
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'order_status_history'
  ) THEN
    RAISE NOTICE '📦 Criando tabela order_status_history...';
    
    CREATE TABLE public.order_status_history (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
      status order_status NOT NULL,
      notes TEXT,
      updated_by UUID REFERENCES public.profiles(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE '✅ Tabela order_status_history criada!';
  ELSE
    RAISE NOTICE '✅ Tabela order_status_history já existe';
    
    -- Verificar se a coluna status existe
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_status_history' 
      AND column_name = 'status'
    ) THEN
      ALTER TABLE public.order_status_history 
      ADD COLUMN status order_status NOT NULL DEFAULT 'aguardando_pagamento';
      RAISE NOTICE '✅ Coluna status adicionada em order_status_history';
    END IF;
    
    -- Verificar outras colunas importantes
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_status_history' 
      AND column_name = 'order_id'
    ) THEN
      ALTER TABLE public.order_status_history 
      ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;
      RAISE NOTICE '✅ Coluna order_id adicionada em order_status_history';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_status_history' 
      AND column_name = 'notes'
    ) THEN
      ALTER TABLE public.order_status_history ADD COLUMN notes TEXT;
      RAISE NOTICE '✅ Coluna notes adicionada em order_status_history';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_status_history' 
      AND column_name = 'created_at'
    ) THEN
      ALTER TABLE public.order_status_history 
      ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      RAISE NOTICE '✅ Coluna created_at adicionada em order_status_history';
    END IF;
  END IF;
END $$;

-- Criar índices para order_status_history
CREATE INDEX IF NOT EXISTS idx_order_status_history_order 
ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created 
ON public.order_status_history(created_at);

-- ============================================
-- PARTE 2: Criar tabela order_items
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'order_items'
  ) THEN
    RAISE NOTICE '📦 Criando tabela order_items...';
    
    CREATE TABLE public.order_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
      product_id UUID,
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
    
    RAISE NOTICE '✅ Tabela order_items criada!';
  ELSE
    RAISE NOTICE '✅ Tabela order_items já existe';
    
    -- Verificar se a coluna color existe
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'color'
    ) THEN
      ALTER TABLE public.order_items ADD COLUMN color TEXT;
      RAISE NOTICE '✅ Coluna color adicionada em order_items';
    END IF;
    
    -- Verificar outras colunas importantes
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'size'
    ) THEN
      ALTER TABLE public.order_items ADD COLUMN size TEXT;
      RAISE NOTICE '✅ Coluna size adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'product_image_url'
    ) THEN
      ALTER TABLE public.order_items ADD COLUMN product_image_url TEXT;
      RAISE NOTICE '✅ Coluna product_image_url adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'product_sku'
    ) THEN
      ALTER TABLE public.order_items ADD COLUMN product_sku TEXT;
      RAISE NOTICE '✅ Coluna product_sku adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'product_id'
    ) THEN
      ALTER TABLE public.order_items ADD COLUMN product_id UUID;
      RAISE NOTICE '✅ Coluna product_id adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'order_id'
    ) THEN
      ALTER TABLE public.order_items 
      ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;
      RAISE NOTICE '✅ Coluna order_id adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'product_name'
    ) THEN
      ALTER TABLE public.order_items 
      ADD COLUMN product_name TEXT NOT NULL DEFAULT '';
      RAISE NOTICE '✅ Coluna product_name adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'quantity'
    ) THEN
      ALTER TABLE public.order_items 
      ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
      RAISE NOTICE '✅ Coluna quantity adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'unit_price'
    ) THEN
      ALTER TABLE public.order_items 
      ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0;
      RAISE NOTICE '✅ Coluna unit_price adicionada em order_items';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'total_price'
    ) THEN
      ALTER TABLE public.order_items 
      ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0;
      RAISE NOTICE '✅ Coluna total_price adicionada em order_items';
    END IF;
  END IF;
END $$;

-- Criar índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order 
ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product 
ON public.order_items(product_id);

-- ============================================
-- PARTE 3: Criar tabela payments (se não existir)
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'payments'
  ) THEN
    RAISE NOTICE '📦 Criando tabela payments...';
    
    -- Garantir que os ENUMs existem
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
      CREATE TYPE payment_method AS ENUM (
        'pix',
        'cartao_credito',
        'cartao_debito',
        'boleto',
        'transferencia'
      );
    END IF;
    
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
    
    RAISE NOTICE '✅ Tabela payments criada!';
  ELSE
    RAISE NOTICE '✅ Tabela payments já existe';
  END IF;
END $$;

-- Criar índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_order 
ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status 
ON public.payments(status);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ CORREÇÃO CONCLUÍDA!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tabelas verificadas/criadas:';
  RAISE NOTICE '  ✅ order_status_history';
  RAISE NOTICE '  ✅ order_items';
  RAISE NOTICE '  ✅ payments';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Agora você pode criar pedidos completos!';
END $$;

-- Query de verificação final
SELECT 
  'order_status_history' as tabela,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'order_status_history'
    ) THEN '✅ Existe'
    ELSE '❌ Não existe'
  END as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_status_history' 
      AND column_name = 'status'
    ) THEN '✅ Coluna status OK'
    ELSE '❌ Coluna status faltando'
  END as coluna_status
UNION ALL
SELECT 
  'order_items',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'order_items'
    ) THEN '✅ Existe'
    ELSE '❌ Não existe'
  END,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'color'
    ) THEN '✅ Coluna color OK'
    ELSE '❌ Coluna color faltando'
  END
UNION ALL
SELECT 
  'payments',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'payments'
    ) THEN '✅ Existe'
    ELSE '❌ Não existe'
  END,
  '✅ OK' as coluna_status;

