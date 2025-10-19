-- ========================================================================
-- CORREÇÃO SEGURA DA TABELA PROFILES - APENAS ADICIONAR COLUNAS FALTANTES
-- ========================================================================

-- 1. Adicionar coluna email se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT UNIQUE NOT NULL;
        RAISE NOTICE 'Coluna email adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna email já existe';
    END IF;
END $$;

-- 2. Adicionar coluna cpf se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'cpf'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN cpf TEXT UNIQUE;
        RAISE NOTICE 'Coluna cpf adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna cpf já existe';
    END IF;
END $$;

-- 3. Adicionar coluna birth_date se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'birth_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN birth_date DATE;
        RAISE NOTICE 'Coluna birth_date adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna birth_date já existe';
    END IF;
END $$;

-- 4. Adicionar coluna user_type se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN user_type user_type DEFAULT 'cliente';
        RAISE NOTICE 'Coluna user_type adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna user_type já existe';
    END IF;
END $$;

-- 5. Adicionar coluna avatar_url se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'avatar_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Coluna avatar_url adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna avatar_url já existe';
    END IF;
END $$;

-- 6. Adicionar coluna updated_at se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna updated_at adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe';
    END IF;
END $$;

-- 7. Verificar estrutura final da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

