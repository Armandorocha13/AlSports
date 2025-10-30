-- =====================================================
-- MIGRAÇÃO 000: Criar ENUMs primeiro (ANTES de tudo)
-- =====================================================
-- ⚠️ IMPORTANTE: Esta migração DEVE ser executada ANTES de qualquer outra!
-- Ela garante que todos os ENUMs necessários existam antes de criar tabelas que os usam.

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Criar ENUM order_status
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'aguardando_pagamento',
      'pagamento_confirmado',
      'preparando_pedido',
      'enviado',
      'em_transito',
      'entregue',
      'cancelado',
      'devolvido'
    );
    RAISE NOTICE '✅ ENUM order_status criado com sucesso';
  ELSE
    RAISE NOTICE '✅ ENUM order_status já existe';
  END IF;
END $$;

-- ============================================
-- Criar ENUM user_types (se necessário)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_types') THEN
    CREATE TYPE user_types AS ENUM (
      'cliente',
      'admin',
      'vendedor'
    );
    RAISE NOTICE '✅ ENUM user_types criado com sucesso';
  ELSE
    RAISE NOTICE '✅ ENUM user_types já existe';
  END IF;
END $$;

-- ============================================
-- Criar ENUM payment_method (se necessário)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM (
      'pix',
      'cartao_credito',
      'cartao_debito',
      'boleto',
      'transferencia'
    );
    RAISE NOTICE '✅ ENUM payment_method criado com sucesso';
  ELSE
    RAISE NOTICE '✅ ENUM payment_method já existe';
  END IF;
END $$;

-- ============================================
-- Criar ENUM payment_status (se necessário)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM (
      'pendente',
      'processando',
      'aprovado',
      'rejeitado',
      'cancelado'
    );
    RAISE NOTICE '✅ ENUM payment_status criado com sucesso';
  ELSE
    RAISE NOTICE '✅ ENUM payment_status já existe';
  END IF;
END $$;

-- Mensagem final
DO $$ 
BEGIN
  RAISE NOTICE '✅✅✅ Todos os ENUMs foram verificados/criados com sucesso!';
  RAISE NOTICE '📋 Próximo passo: Execute a migração 001_ensure_orders_structure.sql';
END $$;
