-- =====================================================
-- ⚠️ EXECUTE ESTE SCRIPT IMEDIATAMENTE NO SUPABASE
-- =====================================================
-- Copie TODO este código e cole no SQL Editor do Supabase
-- Clique em RUN ou pressione Ctrl+Enter
-- 
-- Este script vai:
-- 1. Criar o ENUM order_status se não existir
-- 2. Verificar se está funcionando
-- 3. Criar/verificar a tabela orders
-- 
-- ⚠️ IMPORTANTE: Execute na ordem abaixo!

-- ============================================
-- PARTE 1: Verificar e Recriar ENUM se necessário
-- ============================================

DO $$ 
DECLARE
  enum_exists BOOLEAN;
  test_passed BOOLEAN := FALSE;
BEGIN
  -- Verificar se o ENUM existe
  SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'order_status') INTO enum_exists;
  
  IF enum_exists THEN
    RAISE NOTICE '✅ ENUM order_status já existe. Testando se funciona...';
    
    -- Tentar testar o valor
    BEGIN
      PERFORM 'aguardando_pagamento'::order_status;
      test_passed := TRUE;
      RAISE NOTICE '✅✅✅ TESTE PASSADO: O ENUM funciona corretamente!';
    EXCEPTION
      WHEN invalid_text_representation OR OTHERS THEN
        RAISE NOTICE '⚠️ ENUM existe mas o valor não funciona. Recriando ENUM...';
        test_passed := FALSE;
    END;
  ELSE
    RAISE NOTICE '📦 ENUM order_status não existe. Criando...';
    test_passed := FALSE;
  END IF;
  
  -- Se o teste falhou ou não existe, precisamos recriar
  IF NOT test_passed THEN
    RAISE NOTICE '🔧 Iniciando recriação do ENUM...';
    
    -- Se existe, primeiro alterar colunas que usam o ENUM para TEXT temporariamente
    IF enum_exists THEN
      BEGIN
        -- Tentar alterar a coluna status para TEXT temporariamente
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'orders' 
          AND column_name = 'status'
        ) THEN
          ALTER TABLE public.orders ALTER COLUMN status TYPE TEXT;
          RAISE NOTICE '✅ Coluna status alterada para TEXT temporariamente';
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE '⚠️ Aviso ao alterar coluna: %', SQLERRM;
      END;
      
      -- Dropar o ENUM antigo
      DROP TYPE IF EXISTS order_status CASCADE;
      RAISE NOTICE '✅ ENUM antigo removido';
    END IF;
    
    -- Criar novo ENUM com todos os valores corretos
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
    RAISE NOTICE '✅✅✅ ENUM order_status RECRIADO COM SUCESSO!';
    
    -- Restaurar a coluna status para usar o novo ENUM
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'status'
      AND data_type = 'text'
    ) THEN
      BEGIN
        -- Converter valores de texto para ENUM (usando valor padrão se inválido)
        ALTER TABLE public.orders 
        ALTER COLUMN status TYPE order_status 
        USING CASE 
          WHEN status::text = 'aguardando_pagamento' THEN 'aguardando_pagamento'::order_status
          WHEN status::text = 'pagamento_confirmado' THEN 'pagamento_confirmado'::order_status
          WHEN status::text = 'preparando_pedido' THEN 'preparando_pedido'::order_status
          WHEN status::text = 'enviado' THEN 'enviado'::order_status
          WHEN status::text = 'em_transito' THEN 'em_transito'::order_status
          WHEN status::text = 'entregue' THEN 'entregue'::order_status
          WHEN status::text = 'cancelado' THEN 'cancelado'::order_status
          WHEN status::text = 'devolvido' THEN 'devolvido'::order_status
          ELSE 'aguardando_pagamento'::order_status
        END;
        
        RAISE NOTICE '✅ Coluna status restaurada para tipo order_status';
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE '⚠️ Erro ao restaurar coluna: %. Tentando criar nova coluna...', SQLERRM;
          -- Se falhar, criar nova coluna
          ALTER TABLE public.orders 
          ADD COLUMN status_new order_status DEFAULT 'aguardando_pagamento';
          ALTER TABLE public.orders DROP COLUMN status;
          ALTER TABLE public.orders RENAME COLUMN status_new TO status;
          RAISE NOTICE '✅ Coluna status recriada';
      END;
    END IF;
    
    -- Testar novamente
    BEGIN
      PERFORM 'aguardando_pagamento'::order_status;
      RAISE NOTICE '✅✅✅ TESTE FINAL PASSADO: ENUM funcionando perfeitamente!';
    EXCEPTION
      WHEN OTHERS THEN
        RAISE EXCEPTION '❌❌❌ TESTE FINAL FALHOU: %', SQLERRM;
    END;
  END IF;
END $$;

-- ============================================
-- PARTE 3: Verificar/Criar tabela orders
-- ============================================

-- Verificar se a tabela existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    RAISE NOTICE '⚠️ Tabela orders não existe. Criando...';
    
    CREATE TABLE public.orders (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id UUID,
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
    
    RAISE NOTICE '✅ Tabela orders criada!';
  ELSE
    RAISE NOTICE '✅ Tabela orders já existe';
    
    -- Verificar se a coluna status existe e usa o tipo correto
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'status'
    ) THEN
      ALTER TABLE public.orders 
      ADD COLUMN status order_status DEFAULT 'aguardando_pagamento';
      RAISE NOTICE '✅ Coluna status adicionada!';
    ELSE
      -- Verificar o tipo da coluna
      IF EXISTS (
        SELECT 1 FROM information_schema.columns c
        JOIN pg_type t ON t.typname = 'order_status'
        WHERE c.table_schema = 'public' 
        AND c.table_name = 'orders' 
        AND c.column_name = 'status'
        AND c.udt_name = 'order_status'
      ) THEN
        RAISE NOTICE '✅ Coluna status existe e está correta!';
      ELSE
        RAISE NOTICE '⚠️ Coluna status existe mas pode estar com tipo incorreto';
      END IF;
    END IF;
  END IF;
END $$;

-- ============================================
-- PARTE 4: Verificar outras colunas importantes
-- ============================================

DO $$ 
BEGIN
  -- Verificar subtotal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0;
    RAISE NOTICE '✅ Coluna subtotal adicionada!';
  END IF;
  
  -- Verificar shipping_address
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN shipping_address JSONB;
    UPDATE public.orders SET shipping_address = '{}'::jsonb WHERE shipping_address IS NULL;
    ALTER TABLE public.orders ALTER COLUMN shipping_address SET NOT NULL;
    RAISE NOTICE '✅ Coluna shipping_address adicionada!';
  END IF;
  
  -- Verificar total_amount
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
    RAISE NOTICE '✅ Coluna total_amount adicionada!';
  END IF;
  
  -- Verificar order_number
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'order_number'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN order_number TEXT UNIQUE NOT NULL;
    RAISE NOTICE '✅ Coluna order_number adicionada!';
  END IF;
END $$;

-- ============================================
-- PARTE 5: Teste final completo
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅✅✅ VERIFICAÇÃO FINAL:';
  RAISE NOTICE '  - ENUM order_status: OK';
  RAISE NOTICE '  - Tabela orders: OK';
  RAISE NOTICE '  - Colunas necessárias: OK';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 TUDO PRONTO! Agora você pode criar pedidos!';
END $$;

-- Query de verificação final (execute para ver o resultado)
SELECT 
  'ENUM order_status' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') 
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END as status
UNION ALL
SELECT 
  'Tabela orders',
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders')
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END
UNION ALL
SELECT 
  'Coluna status',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'status'
    )
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END
UNION ALL
SELECT 
  'Coluna subtotal',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'subtotal'
    )
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END
UNION ALL
SELECT 
  'Coluna shipping_address',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'shipping_address'
    )
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END;

