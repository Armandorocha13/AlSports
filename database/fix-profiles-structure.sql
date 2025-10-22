-- ========================================================================
-- CORREÇÃO DA ESTRUTURA DA TABELA PROFILES
-- ========================================================================

-- Verificar se a tabela profiles existe e sua estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Adicionar colunas que podem estar faltando
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

    -- Adicionar coluna full_name se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'full_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;

    -- Adicionar coluna phone se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'phone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;

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

    -- Adicionar coluna created_at se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

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

-- Verificar a estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
