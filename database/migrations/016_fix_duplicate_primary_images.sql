-- =====================================================
-- MIGRATION: Corrigir imagens primárias duplicadas
-- =====================================================
-- Este script garante que cada produto tenha apenas
-- uma imagem primária, removendo duplicatas.
-- =====================================================

BEGIN;

-- Remover a constraint problemática se existir (caso a tabela já tenha sido criada)
DO $$
BEGIN
  -- Tentar remover constraint se existir
  BEGIN
    ALTER TABLE public.product_image_relations 
    DROP CONSTRAINT IF EXISTS product_image_relations_product_id_is_primary_key;
  EXCEPTION
    WHEN OTHERS THEN
      NULL; -- Ignorar se não existir
  END;
END $$;

-- Garantir apenas uma imagem primária por produto
-- Para produtos com múltiplas imagens primárias, manter apenas a mais recente
WITH ranked_images AS (
  SELECT 
    id,
    product_id,
    is_primary,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY created_at DESC) as rn
  FROM public.product_image_relations
  WHERE is_primary = true
)
UPDATE public.product_image_relations pir
SET is_primary = false
FROM ranked_images r
WHERE pir.id = r.id 
  AND r.rn > 1;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

