-- Script de emergência para resolver o problema do admin
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela profiles existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) as profiles_table_exists;

-- 2. Se a tabela não existir, criar ela
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    user_type TEXT DEFAULT 'cliente',
    phone TEXT,
    cpf TEXT,
    birth_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Adicionar a coluna user_type se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 4. Inserir ou atualizar o usuário admin
INSERT INTO public.profiles (
    email,
    full_name,
    user_type,
    created_at,
    updated_at
) VALUES (
    'almundodabola@gmail.com',
    'Administrador',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    user_type = 'admin',
    full_name = 'Administrador',
    updated_at = NOW();

-- 5. Verificar o resultado final
SELECT 
    id,
    email,
    full_name,
    user_type,
    created_at
FROM public.profiles 
WHERE email = 'almundodabola@gmail.com';
