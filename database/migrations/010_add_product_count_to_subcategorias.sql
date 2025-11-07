-- =====================================================
-- MIGRATION: Adicionar coluna para contagem de produtos em subcategorias
-- =====================================================
-- Esta migration adiciona uma coluna opcional na tabela subcategorias
-- para armazenar a contagem de produtos vinculados (opcional - pode ser calculado)
-- =====================================================

-- Adicionar coluna product_count se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subcategorias' 
    AND column_name = 'product_count'
  ) THEN
    ALTER TABLE public.subcategorias ADD COLUMN product_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Coluna product_count adicionada à tabela subcategorias';
    
    -- Atualizar contagem inicial
    UPDATE public.subcategorias s
    SET product_count = (
      SELECT COUNT(*) 
      FROM public.products p 
      WHERE p.subcategory_id = s.id::text
    );
    
    RAISE NOTICE '✅ Contagem de produtos atualizada para todas as subcategorias';
  ELSE
    RAISE NOTICE '✅ Coluna product_count já existe na tabela subcategorias';
  END IF;
END $$;

-- Criar função para atualizar contagem automaticamente (opcional)
CREATE OR REPLACE FUNCTION update_subcategory_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contagem quando produto é inserido ou atualizado
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.subcategory_id IS NOT NULL THEN
      UPDATE public.subcategorias
      SET product_count = (
        SELECT COUNT(*) 
        FROM public.products 
        WHERE subcategory_id = NEW.subcategory_id
      )
      WHERE id::text = NEW.subcategory_id;
    END IF;
    
    -- Atualizar contagem da subcategoria antiga se mudou
    IF TG_OP = 'UPDATE' AND OLD.subcategory_id IS NOT NULL 
       AND OLD.subcategory_id != NEW.subcategory_id THEN
      UPDATE public.subcategorias
      SET product_count = (
        SELECT COUNT(*) 
        FROM public.products 
        WHERE subcategory_id = OLD.subcategory_id
      )
      WHERE id::text = OLD.subcategory_id;
    END IF;
  END IF;
  
  -- Atualizar contagem quando produto é deletado
  IF TG_OP = 'DELETE' AND OLD.subcategory_id IS NOT NULL THEN
    UPDATE public.subcategorias
    SET product_count = (
      SELECT COUNT(*) 
      FROM public.products 
      WHERE subcategory_id = OLD.subcategory_id
    )
    WHERE id::text = OLD.subcategory_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para manter contagem atualizada
DROP TRIGGER IF EXISTS trigger_update_subcategory_count ON public.products;
CREATE TRIGGER trigger_update_subcategory_count
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_subcategory_product_count();

-- Adicionar comentário
COMMENT ON COLUMN public.subcategorias.product_count IS 
  'Contagem de produtos vinculados a esta subcategoria (atualizada automaticamente)';

-- Mensagem de confirmação
DO $$ 
BEGIN
  RAISE NOTICE '✅ Migration concluída!';
  RAISE NOTICE '📋 Coluna product_count adicionada à tabela subcategorias';
  RAISE NOTICE '🔄 Triggers criados para manter contagem atualizada automaticamente';
END $$;

