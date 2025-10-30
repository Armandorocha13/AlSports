-- =====================================================
-- TESTE: Verificar se pedidos estão sendo salvos e exibidos
-- =====================================================
-- Execute este script para diagnosticar problemas com pedidos

-- ============================================
-- PASSO 1: Verificar estrutura do banco
-- ============================================
DO $$
DECLARE
  table_exists BOOLEAN;
  view_exists BOOLEAN;
  enum_exists BOOLEAN;
BEGIN
  -- Verificar se tabela orders existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
  ) INTO table_exists;
  
  -- Verificar se view orders_with_customer existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_schema = 'public' 
    AND table_name = 'orders_with_customer'
  ) INTO view_exists;
  
  -- Verificar se ENUM order_status existe
  SELECT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'order_status'
  ) INTO enum_exists;
  
  RAISE NOTICE '🔍 DIAGNÓSTICO DO BANCO:';
  RAISE NOTICE '   - Tabela orders existe: %', CASE WHEN table_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '   - View orders_with_customer existe: %', CASE WHEN view_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '   - ENUM order_status existe: %', CASE WHEN enum_exists THEN '✅' ELSE '❌' END;
END $$;

-- ============================================
-- PASSO 2: Contar registros
-- ============================================
DO $$
DECLARE
  orders_count INTEGER;
  profiles_count INTEGER;
  order_items_count INTEGER;
  payments_count INTEGER;
BEGIN
  -- Contar registros em cada tabela
  SELECT COUNT(*) INTO orders_count FROM public.orders;
  SELECT COUNT(*) INTO profiles_count FROM public.profiles;
  SELECT COUNT(*) INTO order_items_count FROM public.order_items;
  SELECT COUNT(*) INTO payments_count FROM public.payments;
  
  RAISE NOTICE '📊 CONTAGEM DE REGISTROS:';
  RAISE NOTICE '   - Pedidos: %', orders_count;
  RAISE NOTICE '   - Usuários: %', profiles_count;
  RAISE NOTICE '   - Itens de pedidos: %', order_items_count;
  RAISE NOTICE '   - Pagamentos: %', payments_count;
END $$;

-- ============================================
-- PASSO 3: Verificar pedidos recentes
-- ============================================
DO $$
DECLARE
  recent_orders RECORD;
BEGIN
  RAISE NOTICE '📋 PEDIDOS RECENTES (últimos 5):';
  
  FOR recent_orders IN 
    SELECT 
      id,
      order_number,
      user_id,
      status,
      total_amount,
      created_at
    FROM public.orders 
    ORDER BY created_at DESC 
    LIMIT 5
  LOOP
    RAISE NOTICE '   - % | % | % | % | R$ % | %', 
      recent_orders.id,
      recent_orders.order_number,
      recent_orders.user_id,
      recent_orders.status,
      recent_orders.total_amount,
      recent_orders.created_at;
  END LOOP;
END $$;

-- ============================================
-- PASSO 4: Testar view orders_with_customer
-- ============================================
DO $$
DECLARE
  view_count INTEGER;
  view_sample RECORD;
BEGIN
  -- Contar registros na view
  SELECT COUNT(*) INTO view_count FROM public.orders_with_customer;
  
  RAISE NOTICE '👁️ TESTE DA VIEW orders_with_customer:';
  RAISE NOTICE '   - Registros na view: %', view_count;
  
  -- Mostrar amostra da view
  IF view_count > 0 THEN
    RAISE NOTICE '   - Amostra da view:';
    FOR view_sample IN 
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        status,
        total_amount
      FROM public.orders_with_customer 
      ORDER BY created_at DESC 
      LIMIT 3
    LOOP
      RAISE NOTICE '     * % | % | % | % | % | R$ %', 
        view_sample.id,
        view_sample.order_number,
        COALESCE(view_sample.customer_name, 'NULL'),
        COALESCE(view_sample.customer_email, 'NULL'),
        view_sample.status,
        view_sample.total_amount;
    END LOOP;
  ELSE
    RAISE NOTICE '   - ⚠️ View não retorna dados';
  END IF;
END $$;

-- ============================================
-- PASSO 5: Verificar permissões RLS
-- ============================================
DO $$
DECLARE
  rls_enabled BOOLEAN;
  policy_count INTEGER;
  policy_info RECORD;
BEGIN
  -- Verificar se RLS está habilitado
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class 
  WHERE relname = 'orders' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
  
  -- Contar políticas RLS
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'orders';
  
  RAISE NOTICE '🔒 PERMISSÕES RLS:';
  RAISE NOTICE '   - RLS habilitado: %', CASE WHEN rls_enabled THEN '✅' ELSE '❌' END;
  RAISE NOTICE '   - Políticas RLS: %', policy_count;
  
  IF policy_count > 0 THEN
    RAISE NOTICE '   - Políticas encontradas:';
    FOR policy_info IN 
      SELECT policyname, cmd, qual 
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'orders'
    LOOP
      RAISE NOTICE '     * %: %', policy_info.policyname, policy_info.cmd;
    END LOOP;
  END IF;
END $$;

-- ============================================
-- PASSO 6: Verificar estrutura da tabela orders
-- ============================================
DO $$
DECLARE
  col_info RECORD;
BEGIN
  RAISE NOTICE '🏗️ ESTRUTURA DA TABELA ORDERS:';
  
  FOR col_info IN 
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '   - %: % % %', 
      col_info.column_name,
      col_info.data_type,
      CASE WHEN col_info.is_nullable = 'NO' THEN 'NOT NULL' ELSE 'NULL' END,
      CASE WHEN col_info.column_default IS NOT NULL THEN 'DEFAULT ' || col_info.column_default ELSE '' END;
  END LOOP;
END $$;

-- ============================================
-- PASSO 7: Teste de inserção (opcional)
-- ============================================
DO $$
DECLARE
  test_order_id UUID;
  test_user_id UUID;
BEGIN
  -- Verificar se há usuários para testar
  SELECT id INTO test_user_id FROM public.profiles LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE '🧪 TESTE DE INSERÇÃO:';
    
    -- Inserir pedido de teste
    INSERT INTO public.orders (
      order_number,
      user_id,
      status,
      subtotal,
      shipping_cost,
      discount_amount,
      total_amount,
      shipping_address,
      notes
    ) VALUES (
      'TEST-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),
      test_user_id,
      'aguardando_pagamento',
      100.00,
      15.00,
      0.00,
      115.00,
      '{"test": true, "street": "Rua Teste", "number": "123", "city": "Cidade Teste", "state": "TS", "zip_code": "12345678"}'::jsonb,
      'Pedido de teste para diagnóstico'
    ) RETURNING id INTO test_order_id;
    
    RAISE NOTICE '   - Pedido de teste criado: %', test_order_id;
    
    -- Verificar se aparece na view
    IF EXISTS (SELECT 1 FROM public.orders_with_customer WHERE id = test_order_id) THEN
      RAISE NOTICE '   - ✅ Pedido aparece na view orders_with_customer';
    ELSE
      RAISE NOTICE '   - ❌ Pedido NÃO aparece na view orders_with_customer';
    END IF;
    
    -- Limpar pedido de teste
    DELETE FROM public.orders WHERE id = test_order_id;
    RAISE NOTICE '   - Pedido de teste removido';
    
  ELSE
    RAISE NOTICE '⚠️ TESTE DE INSERÇÃO: Nenhum usuário encontrado para testar';
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE '✅✅✅ DIAGNÓSTICO CONCLUÍDO!';
  RAISE NOTICE '📋 Se os pedidos não aparecem na aplicação:';
  RAISE NOTICE '   1. Verifique se há pedidos na tabela orders';
  RAISE NOTICE '   2. Verifique se a view orders_with_customer funciona';
  RAISE NOTICE '   3. Verifique se as permissões RLS estão corretas';
  RAISE NOTICE '   4. Verifique os logs do console da aplicação';
END $$;
