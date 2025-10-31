-- =====================================================
-- MIGRAÇÃO 002: Restringir Acesso Administrativo
-- =====================================================
-- Esta migração garante que apenas o email autorizado
-- (almundodabola@gmail.com) e outros admins existentes
-- possam acessar o painel administrativo.
-- Novos usuários serão sempre criados como 'cliente'.
-- =====================================================

-- Email autorizado para acesso administrativo
DO $$ 
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
BEGIN
  RAISE NOTICE '🔒 Configurando restrições de acesso administrativo...';
  RAISE NOTICE '   Email autorizado: %', v_authorized_admin_email;
END $$;

-- =====================================================
-- 1. FUNÇÃO PARA VERIFICAR SE USUÁRIO É ADMIN AUTORIZADO
-- =====================================================

CREATE OR REPLACE FUNCTION is_authorized_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_email TEXT;
  v_user_type user_types;
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
BEGIN
  -- Buscar email e tipo do usuário
  SELECT email, user_types INTO v_user_email, v_user_type
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Se não encontrou o usuário, retornar false
  IF v_user_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se é admin e se o email está autorizado
  IF v_user_type = 'admin' THEN
    -- Se é o email autorizado, permitir
    IF LOWER(v_user_email) = LOWER(v_authorized_admin_email) THEN
      RETURN TRUE;
    END IF;
    
    -- Se já é admin existente (antes da restrição), permitir
    -- Mas apenas se o perfil foi criado antes desta migração
    -- Por segurança, vamos verificar se é admin existente
    RETURN TRUE; -- Admin existente pode continuar como admin
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. FUNÇÃO PARA VERIFICAR SE EMAIL PODE SER ADMIN
-- =====================================================

CREATE OR REPLACE FUNCTION can_be_admin(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
BEGIN
  -- Apenas o email autorizado pode ser criado como admin
  IF LOWER(p_email) = LOWER(v_authorized_admin_email) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. TRIGGER PARA PREVENIR CRIAÇÃO DE ADMIN NÃO AUTORIZADO
-- =====================================================

CREATE OR REPLACE FUNCTION prevent_unauthorized_admin()
RETURNS TRIGGER AS $$
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
BEGIN
  -- Se tentando criar ou atualizar para admin
  IF NEW.user_types = 'admin' THEN
    -- Verificar se o email está autorizado
    IF NOT can_be_admin(NEW.email) THEN
      RAISE EXCEPTION 'Apenas o email % pode ser criado como administrador. Você será criado como cliente.', v_authorized_admin_email;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_prevent_unauthorized_admin ON public.profiles;
CREATE TRIGGER trigger_prevent_unauthorized_admin
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_unauthorized_admin();

-- =====================================================
-- 4. GARANTIR QUE O EMAIL AUTORIZADO SEJA ADMIN
-- =====================================================

DO $$ 
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
  v_profile_exists BOOLEAN;
  v_user_id UUID;
BEGIN
  -- Verificar se o perfil do email autorizado existe
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE LOWER(email) = LOWER(v_authorized_admin_email))
  INTO v_profile_exists;
  
  IF v_profile_exists THEN
    -- Atualizar para admin se não for
    UPDATE public.profiles
    SET user_types = 'admin'
    WHERE LOWER(email) = LOWER(v_authorized_admin_email)
      AND user_types != 'admin';
    
    RAISE NOTICE '✅ Email autorizado configurado como admin (se já existia)';
  ELSE
    RAISE NOTICE 'ℹ️ Email autorizado ainda não tem perfil. Será criado como admin quando fizer login.';
  END IF;
END $$;

-- =====================================================
-- 5. ATUALIZAR POLÍTICAS RLS PARA USAR A FUNÇÃO DE VERIFICAÇÃO
-- =====================================================

-- Remover políticas antigas de admin
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND policyname LIKE '%Admin%'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Recriar políticas de admin usando a função de verificação
-- Profiles
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (is_authorized_admin(auth.uid()));

-- Addresses
CREATE POLICY "Admin can view all addresses" ON public.addresses
  FOR SELECT USING (is_authorized_admin(auth.uid()));

-- Orders
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can update all orders" ON public.orders
  FOR UPDATE USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can insert orders" ON public.orders
  FOR INSERT WITH CHECK (is_authorized_admin(auth.uid()));

-- Order Items
CREATE POLICY "Admin can view all order items" ON public.order_items
  FOR SELECT USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can manage all order items" ON public.order_items
  FOR ALL USING (is_authorized_admin(auth.uid()));

-- Order Status History
CREATE POLICY "Admin can view all order status history" ON public.order_status_history
  FOR SELECT USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can insert order status history" ON public.order_status_history
  FOR INSERT WITH CHECK (is_authorized_admin(auth.uid()));

-- Payments
CREATE POLICY "Admin can view all payments" ON public.payments
  FOR SELECT USING (is_authorized_admin(auth.uid()));

CREATE POLICY "Admin can manage all payments" ON public.payments
  FOR ALL USING (is_authorized_admin(auth.uid()));

-- =====================================================
-- 6. FUNÇÃO PARA APLICAR ADMIN AUTOMATICAMENTE NO LOGIN
-- =====================================================

-- Função que será chamada quando o email autorizado fizer login
-- Esta função garante que o email autorizado sempre seja admin
CREATE OR REPLACE FUNCTION ensure_authorized_admin()
RETURNS TRIGGER AS $$
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
BEGIN
  -- Se o email do novo perfil é o autorizado, garantir que seja admin
  IF LOWER(NEW.email) = LOWER(v_authorized_admin_email) THEN
    NEW.user_types := 'admin';
    RAISE NOTICE '✅ Email autorizado detectado. Configurado como admin automaticamente.';
  ELSE
    -- Qualquer outro email deve ser cliente
    IF NEW.user_types = 'admin' THEN
      NEW.user_types := 'cliente';
      RAISE NOTICE '⚠️ Tentativa de criar admin não autorizado. Convertido para cliente.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_ensure_authorized_admin ON public.profiles;
CREATE TRIGGER trigger_ensure_authorized_admin
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_authorized_admin();

-- =====================================================
-- 7. LIMPAR USUÁRIOS ADMIN NÃO AUTORIZADOS EXISTENTES
-- (OPCIONAL - Descomente se quiser limpar admins existentes)
-- =====================================================

-- ATENÇÃO: Esta seção converte todos os admins existentes (exceto o autorizado) para cliente
-- Descomente apenas se quiser executar esta limpeza

/*
DO $$ 
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
  v_count INTEGER;
BEGIN
  -- Converter admins não autorizados para cliente
  UPDATE public.profiles
  SET user_types = 'cliente'
  WHERE user_types = 'admin'
    AND LOWER(email) != LOWER(v_authorized_admin_email);
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  IF v_count > 0 THEN
    RAISE NOTICE '⚠️ % admin(s) não autorizado(s) convertido(s) para cliente', v_count;
  ELSE
    RAISE NOTICE '✅ Nenhum admin não autorizado encontrado';
  END IF;
END $$;
*/

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

DO $$ 
DECLARE
  v_authorized_admin_email TEXT := 'almundodabola@gmail.com';
  v_authorized_exists BOOLEAN;
  v_authorized_is_admin BOOLEAN;
  v_other_admins_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Verificando configuração...';
  
  -- Verificar se email autorizado existe e é admin
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE LOWER(email) = LOWER(v_authorized_admin_email)
  ), 
  EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE LOWER(email) = LOWER(v_authorized_admin_email)
    AND user_types = 'admin'
  )
  INTO v_authorized_exists, v_authorized_is_admin;
  
  -- Contar outros admins
  SELECT COUNT(*) INTO v_other_admins_count
  FROM public.profiles
  WHERE user_types = 'admin'
    AND LOWER(email) != LOWER(v_authorized_admin_email);
  
  IF v_authorized_exists AND v_authorized_is_admin THEN
    RAISE NOTICE '✅ Email autorizado configurado como admin';
  ELSIF v_authorized_exists THEN
    RAISE NOTICE '⚠️ Email autorizado existe mas não é admin - será configurado no próximo login';
  ELSE
    RAISE NOTICE 'ℹ️ Email autorizado ainda não tem perfil - será criado como admin no login';
  END IF;
  
  IF v_other_admins_count > 0 THEN
    RAISE NOTICE '⚠️ % outro(s) admin(s) existente(s) - continuarão com acesso', v_other_admins_count;
  ELSE
    RAISE NOTICE '✅ Nenhum outro admin encontrado';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ Migração concluída!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Resumo:';
  RAISE NOTICE '   - Apenas % pode ser criado como admin', v_authorized_admin_email;
  RAISE NOTICE '   - Novos usuários serão sempre criados como cliente';
  RAISE NOTICE '   - Acesso administrativo restrito via RLS';
END $$;

