-- Script para definir usuário específico como admin
-- Email: almundodabola@gmail.com

-- Primeiro, vamos verificar se o usuário existe
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.created_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- Se o usuário existir, vamos atualizar para admin
UPDATE public.profiles 
SET user_type = 'admin'
WHERE email = 'almundodabola@gmail.com';

-- Verificar se a atualização foi bem-sucedida
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.created_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- Se o usuário não existir, você precisará criar primeiro
-- (Isso só será necessário se o usuário ainda não estiver cadastrado no sistema)
