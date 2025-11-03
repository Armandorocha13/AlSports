-- =====================================================
-- MIGRATION: Vincular produtos restantes que não têm imagem
-- =====================================================
-- Este script vincula automaticamente produtos que ainda
-- não têm imagem, fazendo uma busca mais flexível pelo nome.
-- =====================================================

BEGIN;

-- =====================================================
-- ESTRATÉGIA: Para cada imagem, buscar produtos que:
-- 1. Ainda não têm imagem vinculada
-- 2. O nome do produto contém palavras-chave da URL da imagem
-- =====================================================

-- Função auxiliar para extrair palavra-chave da URL
-- Exemplo: /images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg
-- Extrai: Flamengo, Infantil

-- VINCULAR PRODUTOS QUE AINDA NÃO TÊM IMAGEM
-- Usando matching por palavras-chave extraídas da URL

-- Kit Infantil Flamengo - tentar todas as variações
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Flamengo%'
  AND i.image_url LIKE '%InfantilFlamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Real Madrid - tentar todas as variações
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Real Madrid%'
  AND i.image_url LIKE '%InfantilRealMadrid%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil PSG
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%PSG%'
  AND i.image_url LIKE '%InfantilPSG%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Brasil
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Brasil%'
  AND i.image_url LIKE '%InfantilRetro%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Fluminense
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Fluminense%'
  AND i.image_url LIKE '%InfantilFlu%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Santos
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Santos%'
  AND i.image_url LIKE '%InfantilSantos%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Vasco
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Vasco%'
  AND i.image_url LIKE '%InfantilVasco%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil Milan
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%Milan%'
  AND i.image_url LIKE '%InfantilMilan%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Kit Infantil USA
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Kit Infantil%USA%'
  AND i.image_url LIKE '%InfantilUSA%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Camisas de Futebol - padrões gerais
-- Flamengo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Flamengo%'
  AND i.image_url LIKE '%Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Real Madrid
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Real Madrid%'
  AND i.image_url LIKE '%RealMadrid%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Brasil
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Brasil%'
  AND i.image_url LIKE '%Brasil%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- PSG
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%PSG%'
  AND i.image_url LIKE '%PSG%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Fluminense
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Fluminense%'
  AND i.image_url LIKE '%Fluminense%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Inter Miami
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Inter Miami%'
  AND i.image_url LIKE '%InterMiami%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Vasco
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Vasco%'
  AND i.image_url LIKE '%Vasco%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 10;

-- Arsenal
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Arsenal%'
  AND i.image_url LIKE '%Arsenal%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Barcelona
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Barcelona%'
  AND i.image_url LIKE '%Barcelona%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Botafogo
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Botafogo%'
  AND i.image_url LIKE '%Botafogo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Chelsea
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Chelsea%'
  AND i.image_url LIKE '%Chelsea%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Internacional
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Internacional%'
  AND i.image_url LIKE '%Inter%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Milan
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Milan%'
  AND i.image_url LIKE '%Milan%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Portugal
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Portugal%'
  AND i.image_url LIKE '%Portugal%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Colômbia
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Colômbia%'
  AND i.image_url LIKE '%Colombia%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Palmeiras
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Palmeiras%'
  AND i.image_url LIKE '%Palmeiras%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Al Nassr
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Al Nassr%'
  AND i.image_url LIKE '%Alnasser%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- França
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%França%'
  AND i.image_url LIKE '%Franca%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Sport
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Sport%'
  AND i.image_url LIKE '%Sport%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Seleção Inglaterra
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%inglaterra%' OR p.name ILIKE '%Inglaterra%')
  AND i.image_url LIKE '%(G)%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Parma
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Parma%'
  AND i.image_url LIKE '%Parma%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Manchester United
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%Manchester United%' OR p.name ILIKE '%Man United%')
  AND i.image_url LIKE '%ManUnited%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Manchester City
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE (p.name ILIKE '%Manchester City%' OR p.name ILIKE '%Man City%')
  AND i.image_url LIKE '%City%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

-- Bayer
INSERT INTO public.product_image_relations (product_id, image_id, is_primary)
SELECT DISTINCT p.id, i.id, true
FROM public.products p
CROSS JOIN public.images i
WHERE p.name ILIKE '%Bayer%'
  AND i.image_url LIKE '%Bayer%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.product_image_relations pir 
    WHERE pir.product_id = p.id AND pir.image_id = i.id
  )
LIMIT 5;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

