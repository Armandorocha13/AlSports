-- ========================================================================
-- CORREÇÃO DA TABELA PROFILES - ADICIONAR COLUNAS FALTANTES
-- ========================================================================

-- Verificar se a coluna email já existe
DO $$ 
BEGIN
    -- Adicionar coluna email se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT UNIQUE NOT NULL;
    END IF;
END $$;

-- Verificar se a coluna cpf já existe
DO $$ 
BEGIN
    -- Adicionar coluna cpf se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'cpf'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN cpf TEXT UNIQUE;
    END IF;
END $$;

-- Verificar se a coluna birth_date existe
DO $$ 
BEGIN
    -- Adicionar coluna birth_date se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'birth_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN birth_date DATE;
    END IF;
END $$;

-- Verificar se a coluna user_types existe
DO $$ 
BEGIN
    -- Adicionar coluna user_types se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_types'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN user_types user_types DEFAULT 'cliente';
    END IF;
END $$;

-- Verificar se a coluna avatar_url existe
DO $$ 
BEGIN
    -- Adicionar coluna avatar_url se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'avatar_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Verificar se a coluna updated_at existe
DO $$ 
BEGIN
    -- Adicionar coluna updated_at se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar estrutura final da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
