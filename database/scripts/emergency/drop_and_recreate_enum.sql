-- =====================================================
-- ÚLTIMO RECURSO: Recriar ENUM order_status
-- =====================================================
-- ⚠️ CUIDADO: Este script DROPARÁ e RECRIARÁ o ENUM
-- Execute APENAS se o script FIX_URGENTE.sql não funcionar
-- 
-- ATENÇÃO: Se você tiver dados na tabela orders usando este ENUM,
-- eles podem ser afetados. Faça backup antes!

-- Passo 1: Verificar se há dados na tabela orders
DO $$ 
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM public.orders;
  
  IF row_count > 0 THEN
    RAISE NOTICE '⚠️ AVISO: Existem % registros na tabela orders', row_count;
    RAISE NOTICE '⚠️ Verifique se pode continuar antes de dropar o ENUM';
  ELSE
    RAISE NOTICE '✅ Tabela orders está vazia, seguro para continuar';
  END IF;
END $$;

-- Passo 2: Fazer backup dos valores atuais (se houver dados)
-- CREATE TABLE orders_backup AS SELECT * FROM orders;

-- Passo 3: Remover dependências temporariamente alterando a coluna para TEXT
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.orders 
    ALTER COLUMN status TYPE TEXT;
    RAISE NOTICE '✅ Coluna status alterada para TEXT temporariamente';
  END IF;
END $$;

-- Passo 4: Dropar o ENUM antigo
DROP TYPE IF EXISTS order_status CASCADE;

-- Passo 5: Recriar o ENUM com todos os valores corretos
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

RAISE NOTICE '✅✅✅ ENUM order_status recriado com sucesso!';

-- Passo 6: Restaurar a coluna para usar o novo ENUM
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'status'
    AND data_type = 'text'
  ) THEN
    -- Converter valores de texto de volta para ENUM
    ALTER TABLE public.orders 
    ALTER COLUMN status TYPE order_status 
    USING status::order_status;
    
    RAISE NOTICE '✅ Coluna status restaurada para tipo order_status';
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'status'
  ) THEN
    -- Se a coluna não existe, criar
    ALTER TABLE public.orders 
    ADD COLUMN status order_status DEFAULT 'aguardando_pagamento';
    
    RAISE NOTICE '✅ Coluna status criada com tipo order_status';
  END IF;
END $$;

-- Passo 7: Verificação final
DO $$ 
DECLARE
  test_value order_status;
BEGIN
  test_value := 'aguardando_pagamento'::order_status;
  RAISE NOTICE '✅✅✅ VERIFICAÇÃO FINAL: ENUM funcionando corretamente!';
END $$;

SELECT '✅✅✅ SCRIPT CONCLUÍDO COM SUCESSO!' as resultado;

