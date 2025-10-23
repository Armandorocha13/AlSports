-- ========================================================================
-- TORNAR USUÁRIO ADMIN - SCRIPT DIRETO
-- ========================================================================

-- 1. Adicionar coluna user_type se não existir
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 2. Ver usuários existentes
SELECT id, email, full_name, user_type, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 3. ESCOLHA UMA DAS OPÇÕES ABAIXO:

-- OPÇÃO A: Tornar admin o usuário mais antigo (primeiro cadastrado)
UPDATE public.profiles 
SET user_type = 'admin' 
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- OPÇÃO B: Tornar admin por email específico (descomente e substitua o email)
-- UPDATE public.profiles 
-- SET user_type = 'admin' 
-- WHERE email = 'SEU_EMAIL_AQUI@exemplo.com';

-- OPÇÃO C: Tornar admin por ID específico (descomente e substitua o UUID)
-- UPDATE public.profiles 
-- SET user_type = 'admin' 
-- WHERE id = 'UUID_DO_USUARIO_AQUI';

-- 4. Verificar resultado
SELECT id, email, full_name, user_type, created_at
FROM public.profiles
WHERE user_type = 'admin';
