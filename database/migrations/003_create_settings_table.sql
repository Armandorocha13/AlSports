-- =====================================================
-- MIGRAÇÃO 003: Criar tabela settings se não existir
-- =====================================================

-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar índice para busca rápida por key
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_settings_updated_at ON public.settings;
CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- =====================================================
-- POLÍTICAS RLS PARA SETTINGS
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;

-- Todos podem ler configurações (para funcionar no cliente)
CREATE POLICY "Public can view settings" ON public.settings
  FOR SELECT USING (true);

-- Apenas admins podem inserir/atualizar/deletar configurações
CREATE POLICY "Admin can manage settings" ON public.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_types = 'admin'
    )
  );

-- =====================================================
-- DADOS INICIAIS (só insere se não existir)
-- =====================================================

-- Inserir configurações padrão (se não existirem)
INSERT INTO public.settings (key, value, description) 
VALUES
  ('site_name', '"AlSports"', 'Nome do site'),
  ('site_description', '"E-commerce de produtos esportivos"', 'Descrição do site'),
  ('site_logo', '""', 'URL da logo do site'),
  ('contact_phone', '"(21) 99459-5532"', 'Telefone de contato'),
  ('contact_email', '"contato@alsports.com.br"', 'Email de contato'),
  ('contact_address', '"Cidade da Moda, 13900 - Nova Iguaçu - RJ"', 'Endereço de contato'),
  ('shipping_free_minimum', '500.00', 'Valor mínimo para frete grátis'),
  ('shipping_cost', '15.00', 'Custo padrão do frete'),
  ('min_order_value', '50.00', 'Valor mínimo do pedido'),
  ('max_installments', '12', 'Máximo de parcelas'),
  ('whatsapp_number', '"5521994595532"', 'Número do WhatsApp para recebimento de pedidos'),
  ('instagram_url', '"https://instagram.com/alsports"', 'URL do Instagram'),
  ('facebook_url', '"https://facebook.com/alsports"', 'URL do Facebook'),
  ('twitter_url', '""', 'URL do Twitter')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a tabela foi criada
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settings') THEN
    RAISE NOTICE '✅ Tabela settings criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro: Tabela settings não foi criada';
  END IF;
END $$;

-- Verificar se as configurações foram inseridas
DO $$
DECLARE
  settings_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO settings_count FROM public.settings;
  RAISE NOTICE '✅ Configurações inseridas: % registros', settings_count;
END $$;

