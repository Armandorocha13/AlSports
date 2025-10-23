-- ========================================================================
-- RECRIAR TABELA PROFILES COMPLETA
-- ========================================================================

-- Primeiro, vamos verificar se a tabela existe e sua estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Se a tabela profiles não tem a estrutura correta, vamos recriá-la
-- ATENÇÃO: Isso vai deletar todos os dados existentes na tabela profiles
-- Execute apenas se você tem certeza de que quer recriar a tabela

-- 1. Deletar a tabela profiles (CUIDADO: isso apaga todos os dados!)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Recriar a tabela profiles com a estrutura correta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  user_types user_types DEFAULT 'cliente',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Verificar a estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

