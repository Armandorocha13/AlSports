-- Script simples para corrigir o problema do admin
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos ver se a tabela profiles existe e sua estrutura
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Adicionar a coluna user_types se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_types' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN user_types TEXT DEFAULT 'cliente';
    END IF;
END $$;

-- 3. Verificar se a coluna foi criada
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'user_types' 
AND table_schema = 'public';

-- 4. Atualizar ou inserir o usuário admin
INSERT INTO public.profiles (
    email,
    full_name,
    user_types,
    created_at,
    updated_at
) VALUES (
    'almundodabola@gmail.com',
    'Administrador',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    user_types = 'admin',
    full_name = 'Administrador',
    updated_at = NOW();

-- 5. Verificar o resultado
SELECT 
    email,
    full_name,
    user_types,
    created_at
FROM public.profiles 
WHERE email = 'almundodabola@gmail.com';
