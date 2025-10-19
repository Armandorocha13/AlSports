-- ========================================================================
-- CRIAR VIEW ORDERS_WITH_CUSTOMER
-- ========================================================================

-- Verificar se a view já existe e removê-la se necessário
DROP VIEW IF EXISTS public.orders_with_customer;

-- Criar a view orders_with_customer
CREATE VIEW public.orders_with_customer AS
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  o.status,
  o.subtotal,
  o.shipping_cost,
  o.total_amount,
  o.total_items,
  o.shipping_address,
  o.billing_address,
  o.notes,
  o.estimated_delivery,
  o.tracking_code,
  o.created_at,
  o.updated_at,
  p.full_name as customer_name,
  p.email as customer_email,
  p.phone as customer_phone
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id;

-- Verificar se a view foi criada corretamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders_with_customer' 
AND table_schema = 'public'
ORDER BY ordinal_position;

