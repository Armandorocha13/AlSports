-- Adicionar coluna cpf à tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT UNIQUE;

