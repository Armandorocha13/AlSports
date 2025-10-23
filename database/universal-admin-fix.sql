-- Script universal para resolver o problema do admin
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela profiles existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 2. Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    user_type TEXT DEFAULT 'cliente',
    user_types TEXT DEFAULT 'cliente', -- Backup com nome plural
    phone TEXT,
    cpf TEXT,
    birth_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Adicionar ambas as colunas se não existirem
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_types TEXT DEFAULT 'cliente';

-- 4. Inserir ou atualizar o usuário admin
INSERT INTO public.profiles (
    email,
    full_name,
    user_type,
    user_types,
    created_at,
    updated_at
) VALUES (
    'almundodabola@gmail.com',
    'Administrador',
    'admin',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    user_type = 'admin',
    user_types = 'admin',
    full_name = 'Administrador',
    updated_at = NOW();

-- 5. Verificar o resultado
SELECT 
    id,
    email,
    full_name,
    user_type,
    user_types,
    created_at
FROM public.profiles 
WHERE email = 'almundodabola@gmail.com';

-- 6. Verificar estrutura da tabela
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
AND column_name IN ('user_type', 'user_types')
ORDER BY column_name;
