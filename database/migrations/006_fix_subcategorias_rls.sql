-- =====================================================
-- Migration 006: Fix RLS para tabela subcategorias
-- =====================================================
-- Descrição: Habilita RLS e cria políticas para a tabela subcategorias
-- Data: 2024

-- Habilitar RLS na tabela subcategorias
ALTER TABLE IF EXISTS public.subcategorias ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Anyone can view subcategorias" ON public.subcategorias;
DROP POLICY IF EXISTS "Admin can view all subcategorias" ON public.subcategorias;
DROP POLICY IF EXISTS "Admin can insert subcategorias" ON public.subcategorias;
DROP POLICY IF EXISTS "Admin can update subcategorias" ON public.subcategorias;
DROP POLICY IF EXISTS "Admin can delete subcategorias" ON public.subcategorias;

-- 1. Política para usuários anônimos/públicos (SELECT)
-- Permite que qualquer um veja subcategorias
CREATE POLICY "Anyone can view subcategorias" ON public.subcategorias
  FOR SELECT USING (true);

-- 2. Política para administradores (SELECT, INSERT, UPDATE, DELETE)
-- Admins podem fazer tudo com subcategorias
CREATE POLICY "Admin can manage subcategorias" ON public.subcategorias
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
  AND tablename = 'subcategorias'
ORDER BY policyname;

