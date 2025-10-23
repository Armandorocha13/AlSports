-- Script para limpar pedidos por status específico
-- Execute este script no Supabase SQL Editor

-- 1. Verificar pedidos por status
SELECT 
    status,
    COUNT(*) as quantidade
FROM public.orders
GROUP BY status
ORDER BY quantidade DESC;

SELECT 
    status,
    COUNT(*) as quantidade
FROM public.whatsapp_orders
GROUP BY status
ORDER BY quantidade DESC;

-- 2. Limpar pedidos cancelados
DELETE FROM public.order_items 
WHERE order_id IN (
    SELECT id FROM public.orders 
    WHERE status = 'cancelado'
);

DELETE FROM public.orders 
WHERE status = 'cancelado';

DELETE FROM public.whatsapp_orders 
WHERE status = 'cancelado';

-- 3. Limpar pedidos com status 'aguardando_pagamento' há mais de 7 dias
DELETE FROM public.order_items 
WHERE order_id IN (
    SELECT id FROM public.orders 
    WHERE status = 'aguardando_pagamento' 
    AND created_at < NOW() - INTERVAL '7 days'
);

DELETE FROM public.orders 
WHERE status = 'aguardando_pagamento' 
AND created_at < NOW() - INTERVAL '7 days';

DELETE FROM public.whatsapp_orders 
WHERE status = 'aguardando_pagamento' 
AND created_at < NOW() - INTERVAL '7 days';

-- 4. Verificar resultado
SELECT 
    'orders' as tabela,
    status,
    COUNT(*) as quantidade
FROM public.orders
GROUP BY status
UNION ALL
SELECT 
    'whatsapp_orders' as tabela,
    status,
    COUNT(*) as quantidade
FROM public.whatsapp_orders
GROUP BY status
ORDER BY tabela, quantidade DESC;
