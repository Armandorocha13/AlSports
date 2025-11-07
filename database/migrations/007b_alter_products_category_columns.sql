-- =====================================================
-- MIGRATION: Alterar category_id e subcategory_id para TEXT
-- =====================================================
-- Esta migration altera as colunas category_id e subcategory_id
-- de UUID para TEXT para compatibilidade com as tabelas categorias e subcategorias
-- =====================================================

-- Verificar se as colunas existem e são do tipo UUID
DO $$ 
BEGIN
  -- Alterar category_id de UUID para TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'category_id'
    AND data_type = 'uuid'
  ) THEN
    -- Primeiro, remover foreign key constraints se existirem
    ALTER TABLE public.products 
      DROP CONSTRAINT IF EXISTS products_category_id_fkey,
      DROP CONSTRAINT IF EXISTS products_subcategory_id_fkey;
    
    -- Alterar tipo de UUID para TEXT
    ALTER TABLE public.products 
      ALTER COLUMN category_id TYPE TEXT USING category_id::TEXT;
    
    RAISE NOTICE '✅ Coluna category_id alterada de UUID para TEXT';
  ELSE
    -- Se já for TEXT, apenas garantir que está correto
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'category_id'
      AND data_type = 'text'
    ) THEN
      RAISE NOTICE '✅ Coluna category_id já é do tipo TEXT';
    ELSE
      -- Se não existir, criar como TEXT
      ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id TEXT;
      RAISE NOTICE '✅ Coluna category_id criada como TEXT';
    END IF;
  END IF;
  
  -- Alterar subcategory_id de UUID para TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'subcategory_id'
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.products 
      ALTER COLUMN subcategory_id TYPE TEXT USING subcategory_id::TEXT;
    
    RAISE NOTICE '✅ Coluna subcategory_id alterada de UUID para TEXT';
  ELSE
    -- Se já for TEXT, apenas garantir que está correto
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'subcategory_id'
      AND data_type = 'text'
    ) THEN
      RAISE NOTICE '✅ Coluna subcategory_id já é do tipo TEXT';
    ELSE
      -- Se não existir, criar como TEXT
      ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_id TEXT;
      RAISE NOTICE '✅ Coluna subcategory_id criada como TEXT';
    END IF;
  END IF;
END $$;

-- Recriar índices se necessário
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_subcategory;

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id) WHERE subcategory_id IS NOT NULL;

-- Mensagem final
DO $$ 
BEGIN
  RAISE NOTICE '✅ Migration concluída! Colunas category_id e subcategory_id agora são TEXT';
END $$;

