-- ========================================================================
-- CONFIGURAR USUÁRIO COMO ADMIN
-- ========================================================================

-- Primeiro, vamos verificar se a coluna user_types existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'user_types'
AND table_schema = 'public';

-- Se a coluna user_types não existir, vamos criá-la
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
        ALTER TABLE public.profiles ADD COLUMN user_types TEXT DEFAULT 'cliente';
    END IF;
END $$;

-- Verificar usuários existentes
SELECT id, email, full_name, user_types, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ATENÇÃO: Substitua 'EMAIL_DO_DONO' pelo email real do dono
-- Exemplo: 'dono@alsports.com' ou 'armando@alsports.com'

-- Opção 1: Atualizar por email específico
-- UPDATE public.profiles 
-- SET user_types = 'admin' 
-- WHERE email = 'EMAIL_DO_DONO';

-- Opção 2: Atualizar o primeiro usuário (mais antigo)
-- UPDATE public.profiles 
-- SET user_types = 'admin' 
-- WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- Opção 3: Atualizar por ID específico (se você souber o ID)
-- UPDATE public.profiles 
-- SET user_types = 'admin' 
-- WHERE id = 'UUID_DO_USUARIO';

-- Verificar se a atualização foi feita
SELECT id, email, full_name, user_types, created_at
FROM public.profiles
WHERE user_types = 'admin';
