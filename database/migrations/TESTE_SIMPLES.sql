-- =====================================================
-- SCRIPT DE TESTE SIMPLES: Verificar Estrutura e Dados
-- =====================================================
-- Este script faz verificações básicas sem inserir dados de teste

-- ============================================
-- PASSO 1: Verificar se as tabelas existem
-- ============================================
DO $$
DECLARE
  table_exists BOOLEAN;
  view_exists BOOLEAN;
  enum_exists BOOLEAN;
BEGIN
  -- Verificar tabela orders
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) INTO table_exists;
  
  -- Verificar view orders_with_customer
  SELECT EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_schema = 'public' AND table_name = 'orders_with_customer'
  ) INTO view_exists;
  
  -- Verificar ENUM order_status
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'order_status'
  ) INTO enum_exists;
  
  RAISE NOTICE '🔍 VERIFICAÇÃO DE ESTRUTURA:';
  RAISE NOTICE '   - Tabela orders: %', CASE WHEN table_exists THEN '✅ Existe' ELSE '❌ Não existe' END;
  RAISE NOTICE '   - View orders_with_customer: %', CASE WHEN view_exists THEN '✅ Existe' ELSE '❌ Não existe' END;
  RAISE NOTICE '   - ENUM order_status: %', CASE WHEN enum_exists THEN '✅ Existe' ELSE '❌ Não existe' END;
END $$;

-- ============================================
-- PASSO 2: Contar registros existentes
-- ============================================
DO $$
DECLARE
  orders_count INTEGER;
  profiles_count INTEGER;
  view_count INTEGER;
BEGIN
  -- Contar pedidos
  SELECT COUNT(*) INTO orders_count FROM public.orders;
  
  -- Contar perfis
  SELECT COUNT(*) INTO profiles_count FROM public.profiles;
  
  -- Contar na view
  SELECT COUNT(*) INTO view_count FROM public.orders_with_customer;
  
  RAISE NOTICE '📊 CONTAGEM DE REGISTROS:';
  RAISE NOTICE '   - Pedidos na tabela orders: %', orders_count;
  RAISE NOTICE '   - Perfis na tabela profiles: %', profiles_count;
  RAISE NOTICE '   - Registros na view orders_with_customer: %', view_count;
END $$;

-- ============================================
-- PASSO 3: Verificar estrutura da tabela orders
-- ============================================
DO $$
DECLARE
  col_info RECORD;
  has_required_columns BOOLEAN := TRUE;
BEGIN
  RAISE NOTICE '🏗️ ESTRUTURA DA TABELA ORDERS:';
  
  -- Verificar colunas obrigatórias
  FOR col_info IN 
    SELECT column_name, is_nullable, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
    AND column_name IN ('id', 'order_number', 'user_id', 'status', 'subtotal', 'total_amount', 'shipping_address')
    ORDER BY column_name
  LOOP
    RAISE NOTICE '   - %: % (%)', col_info.column_name, col_info.data_type, 
      CASE WHEN col_info.is_nullable = 'NO' THEN 'NOT NULL' ELSE 'NULL' END;
  END LOOP;
  
  -- Verificar se todas as colunas obrigatórias existem
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'id') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_number') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'subtotal') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_amount') THEN
    has_required_columns := FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_address') THEN
    has_required_columns := FALSE;
  END IF;
  
  RAISE NOTICE '   - Todas as colunas obrigatórias: %', CASE WHEN has_required_columns THEN '✅ Sim' ELSE '❌ Não' END;
END $$;

-- ============================================
-- PASSO 4: Teste simples da view
-- ============================================
DO $$
DECLARE
  view_works BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE '👁️ TESTE DA VIEW orders_with_customer:';
  
  BEGIN
    -- Tentar executar uma query simples na view
    PERFORM 1 FROM public.orders_with_customer LIMIT 1;
    view_works := TRUE;
    RAISE NOTICE '   - ✅ View funciona corretamente';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE '   - ❌ Erro na view: %', SQLERRM;
  END;
END $$;

-- ============================================
-- PASSO 5: Verificar permissões RLS
-- ============================================
DO $$
DECLARE
  rls_enabled BOOLEAN;
  policy_count INTEGER;
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
  RAISE NOTICE '   - RLS habilitado: %', CASE WHEN rls_enabled THEN '✅ Sim' ELSE '❌ Não' END;
  RAISE NOTICE '   - Políticas RLS: %', policy_count;
END $$;

-- ============================================
-- RESULTADO FINAL
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅✅✅ DIAGNÓSTICO CONCLUÍDO!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
  RAISE NOTICE '   1. Se alguma estrutura está faltando, execute as migrações:';
  RAISE NOTICE '      - 000_create_enums_first.sql';
  RAISE NOTICE '      - 001_ensure_orders_structure.sql';
  RAISE NOTICE '      - 002_fix_related_tables.sql';
  RAISE NOTICE '      - 003_fix_orders_view.sql';
  RAISE NOTICE '   2. Se tudo está OK mas pedidos não aparecem:';
  RAISE NOTICE '      - Verifique os logs do console da aplicação';
  RAISE NOTICE '      - Verifique se o usuário está logado';
  RAISE NOTICE '      - Verifique se as permissões RLS estão corretas';
END $$;
