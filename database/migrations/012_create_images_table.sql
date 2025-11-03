-- =====================================================
-- MIGRATION: Criar tabela simples para armazenar imagens
-- =====================================================
-- Esta migration cria uma tabela simples para armazenar
-- as imagens dos produtos. Depois, podemos fazer referências
-- usando os IDs das imagens nos produtos.
-- =====================================================

BEGIN;

-- Criar tabela de imagens
CREATE TABLE IF NOT EXISTS public.images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar índice para busca rápida por URL
CREATE INDEX IF NOT EXISTS idx_images_url ON public.images(image_url);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ver imagens (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'images' 
    AND policyname = 'Anyone can view images'
  ) THEN
    CREATE POLICY "Anyone can view images" ON public.images
      FOR SELECT USING (true);
  END IF;
END $$;

-- Política: Apenas admins podem inserir/atualizar/deletar imagens (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'images' 
    AND policyname = 'Only admins can manage images'
  ) THEN
    CREATE POLICY "Only admins can manage images" ON public.images
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
        )
      );
  END IF;
END $$;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

