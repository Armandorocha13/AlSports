-- Criar tabela whatsapp_orders no Supabase
CREATE TABLE IF NOT EXISTS public.whatsapp_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'aguardando_pagamento',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB,
  notes TEXT,
  whatsapp_message TEXT,
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_customer_email ON public.whatsapp_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_status ON public.whatsapp_orders(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_order_number ON public.whatsapp_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_created_at ON public.whatsapp_orders(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.whatsapp_orders ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura e escrita para usuários autenticados
CREATE POLICY "Permitir leitura e escrita para usuários autenticados" ON public.whatsapp_orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar política para permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura para usuários autenticados" ON public.whatsapp_orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" ON public.whatsapp_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Criar política para permitir atualização para usuários autenticados
CREATE POLICY "Permitir atualização para usuários autenticados" ON public.whatsapp_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Criar política para permitir exclusão para usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" ON public.whatsapp_orders
  FOR DELETE USING (auth.role() = 'authenticated');
