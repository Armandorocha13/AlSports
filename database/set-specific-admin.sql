-- ========================================================================
-- DEFINIR USUÁRIO ESPECÍFICO COMO ADMIN
-- ========================================================================

-- 1. Adicionar coluna user_type se não existir
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 2. Verificar se o usuário existe
SELECT id, email, full_name, user_type, created_at
FROM public.profiles
WHERE email = 'almundodabola@gmail.com';

-- 3. Definir o usuário específico como admin
UPDATE public.profiles 
SET user_type = 'admin' 
WHERE email = 'almundodabola@gmail.com';

-- 4. Verificar se a atualização foi feita
SELECT id, email, full_name, user_type, created_at
FROM public.profiles
WHERE email = 'almundodabola@gmail.com';

-- 5. Verificar todos os admins
SELECT id, email, full_name, user_type, created_at
FROM public.profiles
WHERE user_type = 'admin';
