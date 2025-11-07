-- =====================================================
-- SCRIPT PARA IDENTIFICAR TABELAS NÃO UTILIZADAS
-- =====================================================
-- Este script lista todas as tabelas no schema 'public'
-- e você pode comparar manualmente com o código-fonte
-- 
-- TABELAS UTILIZADAS NO CÓDIGO (verificadas):
-- - profiles
-- - addresses
-- - categorias
-- - subcategorias
-- - products
-- - product_images
-- - orders
-- - order_items
-- - order_status_history
-- - payments
-- - whatsapp_orders
-- - settings
-- =====================================================

-- Listar todas as tabelas do schema public
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.table_constraints 
     WHERE table_schema = 'public' 
     AND table_name = t.table_name 
     AND constraint_type = 'FOREIGN KEY') as foreign_key_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- TABELAS POTENCIALMENTE NÃO UTILIZADAS
-- =====================================================
-- Se você encontrar tabelas na lista acima que NÃO estão
-- na lista de "TABELAS UTILIZADAS", elas podem ser deletadas.
--
-- EXEMPLO DE COMANDO PARA DELETAR UMA TABELA:
-- DROP TABLE IF EXISTS public.nome_da_tabela CASCADE;
--
-- ⚠️  ATENÇÃO: 
-- 1. Faça backup antes de deletar!
-- 2. Verifique se a tabela não é usada por triggers, views ou stored procedures
-- 3. O CASCADE deletará também objetos dependentes
-- =====================================================

-- Verificar dependências de uma tabela específica
-- (Substitua 'nome_da_tabela' pelo nome real)
/*
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'nome_da_tabela';
*/

-- Listar views que podem referenciar tabelas
SELECT 
    table_name as view_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

