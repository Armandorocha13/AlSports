-- =====================================================
-- MIGRATION: Criar tabela de favoritos
-- =====================================================
-- Esta migration cria a tabela favorites para armazenar
-- os produtos favoritos de cada cliente
-- =====================================================

BEGIN;

-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- ID do produto (pode ser do Strapi ou do banco)
  product_data JSONB NOT NULL, -- Dados completos do produto para cache
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

-- Constraint: um usuário não pode favoritar o mesmo produto duas vezes
CONSTRAINT favorites_user_product_unique UNIQUE (user_id, product_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites (product_id);

CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites (created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios favoritos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'favorites' 
    AND policyname = 'Users can view their own favorites'
  ) THEN
    CREATE POLICY "Users can view their own favorites" ON public.favorites
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Política: Usuários podem inserir seus próprios favoritos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'favorites' 
    AND policyname = 'Users can insert their own favorites'
  ) THEN
    CREATE POLICY "Users can insert their own favorites" ON public.favorites
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Política: Usuários podem deletar seus próprios favoritos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'favorites' 
    AND policyname = 'Users can delete their own favorites'
  ) THEN
    CREATE POLICY "Users can delete their own favorites" ON public.favorites
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER favorites_updated_at
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_updated_at();

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================


