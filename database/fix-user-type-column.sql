-- Script para corrigir a coluna user_type na tabela profiles
-- Execute este script no Supabase SQL Editor

-- 1. Verificar a estrutura atual da tabela profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Adicionar a coluna user_type se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 3. Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
AND column_name = 'user_type';

-- 4. Atualizar o usuário admin
UPDATE public.profiles 
SET user_type = 'admin'
WHERE email = 'almundodabola@gmail.com';

-- 5. Verificar se a atualização foi bem-sucedida
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.full_name,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.email = 'almundodabola@gmail.com';

-- 6. Verificar todos os usuários admin
SELECT 
    p.id,
    p.email,
    p.user_type,
    p.full_name
FROM public.profiles p
WHERE p.user_type = 'admin';
