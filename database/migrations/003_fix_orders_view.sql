-- =====================================================
-- MIGRAÇÃO 003: Corrigir view orders_with_customer
-- =====================================================
-- Esta migração garante que a view orders_with_customer funcione corretamente
-- e que os pedidos sejam visíveis para os usuários

-- ============================================
-- PASSO 1: Recriar a view orders_with_customer
-- ============================================
DO $$
BEGIN
  -- Dropar a view se existir
  DROP VIEW IF EXISTS public.orders_with_customer;
  
  -- Recriar a view
  CREATE VIEW public.orders_with_customer AS
  SELECT 
    o.*,
    p.full_name as customer_name,
    p.email as customer_email,
    p.phone as customer_phone
  FROM public.orders o
  LEFT JOIN public.profiles p ON o.user_id = p.id;
  
  RAISE NOTICE '✅ View orders_with_customer recriada com sucesso';
END $$;

-- ============================================
-- PASSO 2: Verificar se há pedidos na tabela
-- ============================================
DO $$
DECLARE
  order_count INTEGER;
  user_count INTEGER;
BEGIN
  -- Contar pedidos
  SELECT COUNT(*) INTO order_count FROM public.orders;
  
  -- Contar usuários
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  RAISE NOTICE '📊 Estatísticas do banco:';
  RAISE NOTICE '   - Pedidos: %', order_count;
  RAISE NOTICE '   - Usuários: %', user_count;
  
  IF order_count = 0 THEN
    RAISE NOTICE '⚠️ Nenhum pedido encontrado na tabela orders';
  ELSE
    RAISE NOTICE '✅ Pedidos encontrados na tabela orders';
  END IF;
  
  IF user_count = 0 THEN
    RAISE NOTICE '⚠️ Nenhum usuário encontrado na tabela profiles';
  ELSE
    RAISE NOTICE '✅ Usuários encontrados na tabela profiles';
  END IF;
END $$;

-- ============================================
-- PASSO 3: Verificar permissões RLS
-- ============================================
DO $$
BEGIN
  -- Verificar se RLS está habilitado
  IF EXISTS (
    SELECT 1 FROM pg_class 
    WHERE relname = 'orders' 
    AND relrowsecurity = true
  ) THEN
    RAISE NOTICE '✅ RLS habilitado na tabela orders';
  ELSE
    RAISE NOTICE '⚠️ RLS não está habilitado na tabela orders';
  END IF;
  
  -- Verificar se RLS está habilitado na view
  IF EXISTS (
    SELECT 1 FROM pg_class 
    WHERE relname = 'orders_with_customer' 
    AND relrowsecurity = true
  ) THEN
    RAISE NOTICE '✅ RLS habilitado na view orders_with_customer';
  ELSE
    RAISE NOTICE 'ℹ️ RLS não está habilitado na view orders_with_customer (normal para views)';
  END IF;
END $$;

-- ============================================
-- PASSO 4: Testar a view
-- ============================================
DO $$
DECLARE
  test_count INTEGER;
BEGIN
  -- Testar se a view retorna dados
  SELECT COUNT(*) INTO test_count FROM public.orders_with_customer;
  
  RAISE NOTICE '🧪 Teste da view orders_with_customer:';
  RAISE NOTICE '   - Registros retornados: %', test_count;
  
  IF test_count > 0 THEN
    RAISE NOTICE '✅ View funcionando corretamente';
  ELSE
    RAISE NOTICE '⚠️ View não retorna dados (pode ser normal se não há pedidos)';
  END IF;
END $$;

-- ============================================
-- PASSO 5: Verificar estrutura da tabela orders
-- ============================================
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  -- Contar colunas da tabela orders
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_schema = 'public' 
  AND table_name = 'orders';
  
  RAISE NOTICE '📋 Estrutura da tabela orders:';
  RAISE NOTICE '   - Número de colunas: %', col_count;
  
  -- Listar colunas importantes
  RAISE NOTICE '   - Colunas importantes:';
  RAISE NOTICE '     * id: %', 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'id'
    ) THEN '✅' ELSE '❌' END;
    
  RAISE NOTICE '     * order_number: %', 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'order_number'
    ) THEN '✅' ELSE '❌' END;
    
  RAISE NOTICE '     * user_id: %', 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'user_id'
    ) THEN '✅' ELSE '❌' END;
    
  RAISE NOTICE '     * status: %', 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'status'
    ) THEN '✅' ELSE '❌' END;
    
  RAISE NOTICE '     * total_amount: %', 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'orders' 
      AND column_name = 'total_amount'
    ) THEN '✅' ELSE '❌' END;
END $$;

DO $$
BEGIN
  RAISE NOTICE '✅✅✅ Migração 003 concluída!';
  RAISE NOTICE '📋 Próximos passos:';
  RAISE NOTICE '   1. Teste criar um pedido na aplicação';
  RAISE NOTICE '   2. Verifique se aparece na página "Meus Pedidos"';
  RAISE NOTICE '   3. Se não aparecer, verifique os logs do console';
END $$;
