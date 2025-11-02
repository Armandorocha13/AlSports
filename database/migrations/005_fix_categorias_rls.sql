-- =====================================================
-- CORREÇÃO DE POLÍTICAS RLS PARA TABELA categorias
-- =====================================================

-- Habilitar RLS na tabela categorias (se ainda não estiver)
ALTER TABLE IF EXISTS public.categorias ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Anyone can view categorias" ON public.categorias;
DROP POLICY IF EXISTS "Admin can view all categorias" ON public.categorias;
DROP POLICY IF EXISTS "Public can view categorias" ON public.categorias;

-- Política: Qualquer um pode ver categorias (público)
CREATE POLICY "Anyone can view categorias" ON public.categorias
  FOR SELECT 
  USING (true);

-- Política: Admins podem fazer tudo com categorias
CREATE POLICY "Admin can manage categorias" ON public.categorias
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.user_types = 'admin'
        OR LOWER(profiles.email) = 'almundodabola@gmail.com'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.user_types = 'admin'
        OR LOWER(profiles.email) = 'almundodabola@gmail.com'
      )
    )
  );

-- Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'categorias'
ORDER BY policyname;

