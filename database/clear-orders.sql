-- Script para limpar todos os pedidos previamente cadastrados
-- Execute este script no Supabase SQL Editor

-- 1. Verificar quantos pedidos existem antes da limpeza
SELECT 
    'whatsapp_orders' as tabela,
    COUNT(*) as total_pedidos
FROM public.whatsapp_orders
UNION ALL
SELECT 
    'orders' as tabela,
    COUNT(*) as total_pedidos
FROM public.orders
UNION ALL
SELECT 
    'order_items' as tabela,
    COUNT(*) as total_pedidos
FROM public.order_items;

-- 2. Limpar tabela de itens dos pedidos (dependência)
DELETE FROM public.order_items;

-- 3. Limpar tabela de pedidos WhatsApp
DELETE FROM public.whatsapp_orders;

-- 4. Limpar tabela de pedidos tradicionais
DELETE FROM public.orders;

-- 5. Verificar se a limpeza foi bem-sucedida
SELECT 
    'whatsapp_orders' as tabela,
    COUNT(*) as total_pedidos
FROM public.whatsapp_orders
UNION ALL
SELECT 
    'orders' as tabela,
    COUNT(*) as total_pedidos
FROM public.orders
UNION ALL
SELECT 
    'order_items' as tabela,
    COUNT(*) as total_pedidos
FROM public.order_items;

-- 6. Verificar se há pedidos no localStorage (informação)
-- Nota: Pedidos salvos no localStorage do navegador não são afetados por este script
-- Para limpar o localStorage, o usuário precisa fazer isso manualmente no navegador
