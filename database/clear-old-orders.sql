-- Script para limpar pedidos antigos e de teste
-- Execute este script no Supabase SQL Editor

-- 1. Verificar pedidos existentes
SELECT 
    'whatsapp_orders' as tabela,
    COUNT(*) as total_pedidos,
    MIN(created_at) as pedido_mais_antigo,
    MAX(created_at) as pedido_mais_recente
FROM public.whatsapp_orders
UNION ALL
SELECT 
    'orders' as tabela,
    COUNT(*) as total_pedidos,
    MIN(created_at) as pedido_mais_antigo,
    MAX(created_at) as pedido_mais_recente
FROM public.orders;

-- 2. Limpar pedidos mais antigos que 30 dias
DELETE FROM public.order_items 
WHERE order_id IN (
    SELECT id FROM public.orders 
    WHERE created_at < NOW() - INTERVAL '30 days'
);

DELETE FROM public.whatsapp_orders 
WHERE created_at < NOW() - INTERVAL '30 days';

DELETE FROM public.orders 
WHERE created_at < NOW() - INTERVAL '30 days';

-- 3. Limpar pedidos de teste (com emails específicos de teste)
DELETE FROM public.order_items 
WHERE order_id IN (
    SELECT id FROM public.orders 
    WHERE customer_email LIKE '%test%' 
    OR customer_email LIKE '%exemplo%'
    OR customer_email LIKE '%demo%'
);

DELETE FROM public.whatsapp_orders 
WHERE customer_email LIKE '%test%' 
OR customer_email LIKE '%exemplo%'
OR customer_email LIKE '%demo%';

DELETE FROM public.orders 
WHERE customer_email LIKE '%test%' 
OR customer_email LIKE '%exemplo%'
OR customer_email LIKE '%demo%';

-- 4. Verificar resultado da limpeza
SELECT 
    'whatsapp_orders' as tabela,
    COUNT(*) as pedidos_restantes,
    MIN(created_at) as pedido_mais_antigo,
    MAX(created_at) as pedido_mais_recente
FROM public.whatsapp_orders
UNION ALL
SELECT 
    'orders' as tabela,
    COUNT(*) as pedidos_restantes,
    MIN(created_at) as pedido_mais_antigo,
    MAX(created_at) as pedido_mais_recente
FROM public.orders;
