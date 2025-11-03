-- =====================================================
-- MIGRATION: Vincular imagens aos produtos
-- =====================================================
-- Este script cria uma tabela de relacionamento entre produtos
-- e imagens, permitindo múltiplas imagens por produto.
-- =====================================================

BEGIN;

-- Criar tabela de relacionamento produto-imagem
CREATE TABLE IF NOT EXISTS public.product_image_relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Garantir que a mesma imagem não seja vinculada duas vezes ao mesmo produto
  UNIQUE(product_id, image_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_product_image_relations_product ON public.product_image_relations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_image_relations_image ON public.product_image_relations(image_id);
CREATE INDEX IF NOT EXISTS idx_product_image_relations_primary ON public.product_image_relations(product_id, is_primary) WHERE is_primary = true;

-- Habilitar RLS
ALTER TABLE public.product_image_relations ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ver relações (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'product_image_relations' 
    AND policyname = 'Anyone can view product image relations'
  ) THEN
    CREATE POLICY "Anyone can view product image relations" ON public.product_image_relations
      FOR SELECT USING (true);
  END IF;
END $$;

-- Política: Apenas admins podem gerenciar relações (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'product_image_relations' 
    AND policyname = 'Only admins can manage product image relations'
  ) THEN
    CREATE POLICY "Only admins can manage product image relations" ON public.product_image_relations
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
        )
      );
  END IF;
END $$;

-- =====================================================
-- VINCULAR IMAGENS AOS PRODUTOS
-- =====================================================

-- Camisa Flamengo 2024/25 - Versão Jogador
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa Flamengo 2024/25%Versão Jogador%'
  AND i.image_url = '/images/Futebol/CamisaJogador/FlamengoJogador.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1
ON CONFLICT (product_id, image_id) DO NOTHING;

-- Camisa Retrô Flamengo 2009
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa Retrô Flamengo 2009%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1
ON CONFLICT (product_id, image_id) DO NOTHING;

-- Camisa 2 do Flamengo versão jogador 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa 2 do Flamengo%versão jogador%2024/25%'
  AND i.image_url = '/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa 3 do Flamengo versão jogador 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa 3 do Flamengo%versão jogador%2024/25%'
  AND i.image_url = '/images/Futebol/CamisaJogador/FlamengoJogador3.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa da selecao da inglaterra versão jogador 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%selecao da inglaterra%versão jogador%2024/25%'
  AND i.image_url = '/images/Futebol/CamisaJogador/(G).png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa Feminina Flamengo 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa Feminina Flamengo%2024/25%'
  AND i.image_url = '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2024-25.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Regata Flamengo 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Regata Flamengo%2024/25%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Regata Inter Miami 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Regata Inter Miami%2024/25%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataInterMiami.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Regata Real Madrid 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Regata Real Madrid%2024/25%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataRealMadrid.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa Retrô Parma 1995
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa Retrô Parma%1995%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRetro/Parma95.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa Retrô PSG 1998
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Camisa Retrô PSG%1998%'
  AND i.image_url = '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa Lakers LeBron James
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%Lakers%LeBron James%' OR p.name ILIKE '%LeBron%Lakers%')
  AND i.image_url = '/images/NBA/LebronJames.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa Chicago Bulls Jordan
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%Chicago Bulls%Jordan%' OR p.name ILIKE '%Bulls%Jordan%')
  AND i.image_url = '/images/NBA/bullsJordan.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa NFL MAHOMES
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%NFL%MAHOMES%' OR p.name ILIKE '%Mahomes%')
  AND i.image_url = '/images/NFL/mahomes.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Camisa NFL KELCE
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%NFL%KELCE%' OR p.name ILIKE '%Kelce%')
  AND i.image_url = '/images/NFL/kelce.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Conjunto de treino Flamengo Camisa + Short
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Conjunto%treino Flamengo%Camisa%Short%'
  AND i.image_url = '/images/ConjuntoTreino/camisa-shorts/BermudaShortsFamengo.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Conjunto de treino Inter Miami Camisa + Short
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Conjunto%treino Inter Miami%Camisa%Short%'
  AND i.image_url = '/images/ConjuntoTreino/camisa-shorts/BermudaShortsInterMiami.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Regata + Short de treino Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Regata%Short%treino Flamengo%'
  AND i.image_url = '/images/ConjuntoTreino/Regata-shorts/RegataFlamengoShorts.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Regata + Short de treino Inter Miami
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Regata%Short%treino Inter Miami%'
  AND i.image_url = '/images/ConjuntoTreino/Regata-shorts/RegataInterMiamiShorts.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Calça de treino Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Calça%treino Flamengo%'
  AND i.image_url = '/images/ConjuntoTreino/calças/CalçaFlamengo.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Casaco de treino Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Casaco%treino Flamengo%'
  AND i.image_url = '/images/ConjuntoTreino/Casacos/CasacoFlamengo.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Corta Vento de treino Fluminense
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Corta Vento%treino Fluminense%'
  AND i.image_url = '/images/ConjuntoTreino/CortaVento/CortaVentoFluminense.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Flamengo 2025/26 (primeira versão - sem já ter imagem)
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Flamengo%2025/26%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Real Madrid 2025/26
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Real Madrid%2025/26%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid1.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil PSG 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil PSG%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilPSG/InfantilPSG.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Brasil Retrô
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Brasil%Retrô%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilRetro/IntanfilBrasil1.jpeg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Brasil retrô (segunda versão)
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Brasil%retrô%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilRetro/InfantilBrasl2.jpeg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Flamengo 2025/26 (segunda versão - produtos que ainda não têm imagem vinculada)
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Flamengo%2025/26%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo2.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Flamengo 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Flamengo%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo3.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Fluminense 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Fluminense%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfanilFluminense/InfantilFlu.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Santos 2025/26
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Santos%2025/26%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilSantos/InfantilSantos.webp'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Vasco 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Vasco%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilVasco/InfantilVasco.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Milan 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Milan%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilMilan/InfantilMilan1.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil USA 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil USA%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/IntantilUSA/InfantilUSA.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Real Madrid 2024/26
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Real Madrid%2024/26%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid2.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Kit Infantil Real Madrid 2024/25
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil Real Madrid%2024/25%'
  AND i.image_url = '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid3.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Meia Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Meia Flamengo%'
  AND i.image_url = '/images/Acessorios/Meias/MeiaFlamengo.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Meia Casual
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Meia Casual%'
  AND i.image_url = '/images/Acessorios/Meias/MeiaCasual.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Boné Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Boné Flamengo%'
  AND i.image_url = '/images/Acessorios/BonesTime/BoneFlamengo.png'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

-- Boné Casual
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Boné Casual%'
  AND i.image_url = '/images/Acessorios/BoneCasual/BoneCasual.jpg'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 1;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

