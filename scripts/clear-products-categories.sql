-- Script para limpar produtos, categorias e subcategorias do banco
-- ATENÇÃO: Este script irá deletar TODOS os dados das tabelas abaixo
-- Execute com cuidado em ambiente de produção!
-- Este script verifica se as tabelas existem antes de tentar deletar

-- Ordem de exclusão respeitando as foreign keys:
-- 1. Primeiro deletar relações de imagens de produtos
-- 2. Deletar imagens dos produtos
-- 3. Deletar produtos
-- 4. Deletar subcategorias
-- 5. Deletar categorias

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- 1. Deletar relações de imagens com produtos (se a tabela existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_image_relations') THEN
    EXECUTE 'DELETE FROM public.product_image_relations';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ product_image_relations: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ product_image_relations: tabela não existe';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_images') THEN
    EXECUTE 'DELETE FROM public.product_images';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ product_images: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ product_images: tabela não existe';
  END IF;

  -- 2. Deletar todas as imagens (se a tabela images existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'images') THEN
    EXECUTE 'DELETE FROM public.images';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ images: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ images: tabela não existe';
  END IF;

  -- 3. Deletar todos os produtos (se a tabela existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    EXECUTE 'DELETE FROM public.products';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ products: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ products: tabela não existe';
  END IF;

  -- 4. Deletar todas as subcategorias (se a tabela existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subcategories') THEN
    EXECUTE 'DELETE FROM public.subcategories';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ subcategories: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ subcategories: tabela não existe';
  END IF;

  -- 5. Deletar todas as categorias (se a tabela existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
    EXECUTE 'DELETE FROM public.categories';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ categories: % linhas deletadas', deleted_count;
  ELSE
    RAISE NOTICE 'ℹ categories: tabela não existe';
  END IF;

  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE '✅ Limpeza concluída!';
  RAISE NOTICE '════════════════════════════════════════';
END $$;

-- Verificar contagem final (apenas para tabelas que existem)
DO $$
DECLARE
  products_count INTEGER := 0;
  subcategories_count INTEGER := 0;
  categories_count INTEGER := 0;
BEGIN
  -- Verificar e contar produtos
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    SELECT COUNT(*) INTO products_count FROM public.products;
  END IF;

  -- Verificar e contar subcategorias
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subcategories') THEN
    SELECT COUNT(*) INTO subcategories_count FROM public.subcategories;
  END IF;

  -- Verificar e contar categorias
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
    SELECT COUNT(*) INTO categories_count FROM public.categories;
  END IF;

  -- Exibir resultados
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Contagem final das tabelas:';
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Produtos: %', products_count;
  RAISE NOTICE 'Subcategorias: %', subcategories_count;
  RAISE NOTICE 'Categorias: %', categories_count;
  RAISE NOTICE '════════════════════════════════════════';
END $$;

