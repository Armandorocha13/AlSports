-- Script para verificar e corrigir usuário admin
-- Email: almundodabola@gmail.com

-- 1. Verificar se o usuário existe
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.created_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- 2. Se o usuário existir, atualizar para admin
UPDATE public.profiles 
SET user_type = 'admin'
WHERE email = 'almundodabola@gmail.com';

-- 3. Verificar se a atualização foi bem-sucedida
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.created_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- 4. Se o usuário não existir, criar um novo perfil admin
-- (Execute apenas se o usuário não existir)
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    user_type,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'almundodabola@gmail.com',
    'Administrador',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    user_type = 'admin',
    updated_at = NOW();

-- 5. Verificação final
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.created_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';
