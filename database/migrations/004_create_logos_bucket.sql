-- =====================================================
-- MIGRAÇÃO 004: Criar bucket 'logos' no Supabase Storage
-- =====================================================
-- 
-- IMPORTANTE: Esta migração deve ser executada manualmente no Supabase Dashboard
-- Vá em: Storage > Create Bucket
-- Nome: logos
-- Public: true (para permitir acesso público às logos)
--
-- Ou execute via SQL se tiver permissões:
-- =====================================================

-- Nota: O Supabase Storage não pode ser criado diretamente via SQL por usuários regulares
-- É necessário criar o bucket através da interface do Supabase Dashboard ou API

-- Para criar via Dashboard:
-- 1. Acesse Supabase Dashboard > Storage
-- 2. Clique em "New bucket"
-- 3. Nome: "logos"
-- 4. Marque "Public bucket" (para permitir acesso público)
-- 5. Clique em "Create bucket"

-- Para criar via API (se tiver service_role key):
-- Você pode usar o Supabase Management API ou criar manualmente no Dashboard

-- =====================================================
-- POLÍTICAS RLS PARA O BUCKET (após criar o bucket)
-- =====================================================

-- Após criar o bucket 'logos', configure as políticas no Dashboard:
-- Storage > logos > Policies
-- 
-- Política 1: "Anyone can view logos"
-- - Policy name: Public read access
-- - Operation: SELECT
-- - Target roles: public
-- - USING expression: true
--
-- Política 2: "Admins can upload logos"  
-- - Policy name: Admin upload access
-- - Operation: INSERT
-- - Target roles: authenticated
-- - WITH CHECK expression: 
--   EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.user_types = 'admin'
--   )
--
-- Política 3: "Admins can update logos"
-- - Policy name: Admin update access
-- - Operation: UPDATE
-- - Target roles: authenticated
-- - USING expression: 
--   EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.user_types = 'admin'
--   )
--
-- Política 4: "Admins can delete logos"
-- - Policy name: Admin delete access
-- - Operation: DELETE
-- - Target roles: authenticated
-- - USING expression: 
--   EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.user_types = 'admin'
--   )

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Para verificar se o bucket foi criado, execute:
-- SELECT name FROM storage.buckets WHERE name = 'logos';

