-- =====================================================
-- CORREÇÃO URGENTE: Criar ENUM order_status
-- =====================================================
-- Execute este script IMEDIATAMENTE no Supabase SQL Editor
-- Ele irá corrigir o problema do ENUM order_status

-- Passo 1: Remover o ENUM antigo se existir (CUIDADO: só se tiver certeza)
-- COMENTADO POR SEGURANÇA - Descomente apenas se necessário
-- DROP TYPE IF EXISTS order_status CASCADE;

-- Passo 2: Criar o ENUM order_status do zero
DO $$ 
BEGIN
  -- Verificar se existe
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    RAISE NOTICE '⚠️ ENUM order_status já existe! Verificando valores...';
    
    -- Tentar usar o valor para ver se funciona
    BEGIN
      PERFORM 'aguardando_pagamento'::order_status;
      RAISE NOTICE '✅ Valor "aguardando_pagamento" existe no ENUM';
    EXCEPTION
      WHEN invalid_text_representation THEN
        RAISE EXCEPTION '❌ Valor "aguardando_pagamento" NÃO existe no ENUM! É necessário recriar o ENUM.';
    END;
  ELSE
    -- Criar novo ENUM
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
    RAISE NOTICE '✅✅✅ ENUM order_status criado com sucesso!';
  END IF;
END $$;

-- Passo 3: Verificar a tabela orders
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    RAISE NOTICE '⚠️ Tabela orders não existe! Execute a migração 001_ensure_orders_structure.sql';
  ELSE
    -- Verificar se a coluna status existe e usa o tipo correto
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'status'
    ) THEN
      RAISE NOTICE '✅ Coluna status existe na tabela orders';
    ELSE
      RAISE NOTICE '⚠️ Coluna status NÃO existe na tabela orders! Execute a migração 001_ensure_orders_structure.sql';
    END IF;
  END IF;
END $$;

-- Passo 4: Teste final - tentar criar um valor de teste
DO $$ 
DECLARE
  test_value order_status;
BEGIN
  test_value := 'aguardando_pagamento'::order_status;
  RAISE NOTICE '✅✅✅ TESTE PASSADO: O valor "aguardando_pagamento" funciona corretamente!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '❌❌❌ TESTE FALHOU: %', SQLERRM;
END $$;

-- Mensagem final
SELECT '✅ SCRIPT EXECUTADO. Verifique as mensagens acima.' as resultado;

