-- Script para verificar e corrigir o usuário admin
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o usuário existe e seu tipo
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.full_name,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- 2. Se não existir, criar o usuário admin
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
    full_name = 'Administrador',
    updated_at = NOW();

-- 3. Verificar se a atualização foi bem-sucedida
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.full_name,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- 4. Verificar se há outros usuários admin
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.full_name
FROM public.profiles p
WHERE p.user_type = 'admin';
