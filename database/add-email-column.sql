-- Adicionar coluna email à tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL;

