-- =====================================================
-- MIGRATION: Inserir imagens de produtos na tabela product_images
-- =====================================================
-- Este script insere as imagens dos produtos hardcoded
-- na tabela product_images usando subqueries para encontrar
-- os produtos pelo nome.
-- 
-- IMPORTANTE: 
-- - Este script usa ILIKE para matching flexível de nomes
-- - Usa NOT EXISTS para evitar duplicatas
-- - Se houver múltiplos produtos com nomes similares, apenas
--   o primeiro encontrado será usado (LIMIT 1)
-- - Execute este script no SQL Editor do Supabase
-- =====================================================

BEGIN;

-- =====================================================
-- PRODUTOS DE FUTEBOL
-- =====================================================

-- Camisa Flamengo 2024/25 - Versão Jogador
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisaJogador/FlamengoJogador.png', true
FROM public.products p
WHERE p.name ILIKE '%Camisa Flamengo 2024/25%Versão Jogador%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisaJogador/FlamengoJogador.png'
  )
LIMIT 1;

-- Camisa Retrô Flamengo 2009
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa Retrô Flamengo 2009%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png'
  )
LIMIT 1;

-- Camisa 2 do Flamengo versão jogador 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa 2 do Flamengo%versão jogador%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg'
  )
LIMIT 1;

-- Camisa 3 do Flamengo versão jogador 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisaJogador/FlamengoJogador3.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa 3 do Flamengo%versão jogador%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisaJogador/FlamengoJogador3.jpg'
  )
LIMIT 1;

-- Camisa da selecao da inglaterra versão jogador 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisaJogador/(G).png', 0, true
FROM public.products p
WHERE p.name ILIKE '%selecao da inglaterra%versão jogador%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisaJogador/(G).png'
  )
LIMIT 1;

-- Camisa Feminina Flamengo 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2024-25.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa Feminina Flamengo%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2024-25.png'
  )
LIMIT 1;

-- Regata Flamengo 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Regata Flamengo%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png'
  )
LIMIT 1;

-- Regata Inter Miami 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRegatas/RegataInterMiami.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Regata Inter Miami%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataInterMiami.jpg'
  )
LIMIT 1;

-- Regata Real Madrid 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRegatas/RegataRealMadrid.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Regata Real Madrid%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRegatas/RegataRealMadrid.jpg'
  )
LIMIT 1;

-- Camisa Retrô Parma 1995
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRetro/Parma95.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa Retrô Parma%1995%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRetro/Parma95.png'
  )
LIMIT 1;

-- Camisa Retrô PSG 1998
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Camisa Retrô PSG%1998%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg'
  )
LIMIT 1;

-- =====================================================
-- PRODUTOS NBA
-- =====================================================

-- Camisa Lakers LeBron James
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/NBA/LebronJames.jpg', 0, true
FROM public.products p
WHERE (p.name ILIKE '%Lakers%LeBron James%' OR p.name ILIKE '%LeBron%Lakers%')
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/NBA/LebronJames.jpg'
  )
LIMIT 1;

-- Camisa Chicago Bulls Jordan
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/NBA/bullsJordan.jpg', 0, true
FROM public.products p
WHERE (p.name ILIKE '%Chicago Bulls%Jordan%' OR p.name ILIKE '%Bulls%Jordan%')
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/NBA/bullsJordan.jpg'
  )
LIMIT 1;

-- =====================================================
-- PRODUTOS NFL
-- =====================================================

-- Camisa NFL MAHOMES
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/NFL/mahomes.jpg', 0, true
FROM public.products p
WHERE (p.name ILIKE '%NFL%MAHOMES%' OR p.name ILIKE '%Mahomes%')
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/NFL/mahomes.jpg'
  )
LIMIT 1;

-- Camisa NFL KELCE
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/NFL/kelce.jpg', 0, true
FROM public.products p
WHERE (p.name ILIKE '%NFL%KELCE%' OR p.name ILIKE '%Kelce%')
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/NFL/kelce.jpg'
  )
LIMIT 1;

-- =====================================================
-- PRODUTOS ROUPAS DE TREINO
-- =====================================================

-- Conjunto de treino Flamengo Camisa + Short
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/camisa-shorts/BermudaShortsFamengo.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Conjunto%treino Flamengo%Camisa%Short%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/camisa-shorts/BermudaShortsFamengo.png'
  )
LIMIT 1;

-- Conjunto de treino Inter Miami Camisa + Short
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/camisa-shorts/BermudaShortsInterMiami.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Conjunto%treino Inter Miami%Camisa%Short%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/camisa-shorts/BermudaShortsInterMiami.png'
  )
LIMIT 1;

-- Regata + Short de treino Flamengo
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/Regata-shorts/RegataFlamengoShorts.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Regata%Short%treino Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/Regata-shorts/RegataFlamengoShorts.png'
  )
LIMIT 1;

-- Regata + Short de treino Inter Miami
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/Regata-shorts/RegataInterMiamiShorts.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Regata%Short%treino Inter Miami%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/Regata-shorts/RegataInterMiamiShorts.png'
  )
LIMIT 1;

-- Calça de treino Flamengo
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/calças/CalçaFlamengo.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Calça%treino Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/calças/CalçaFlamengo.jpg'
  )
LIMIT 1;

-- Casaco de treino Flamengo
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/Casacos/CasacoFlamengo.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Casaco%treino Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/Casacos/CasacoFlamengo.jpg'
  )
LIMIT 1;

-- Corta Vento de treino Fluminense
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntoTreino/CortaVento/CortaVentoFluminense.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Corta Vento%treino Fluminense%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntoTreino/CortaVento/CortaVentoFluminense.jpg'
  )
LIMIT 1;

-- =====================================================
-- PRODUTOS INFANTIS
-- =====================================================

-- Kit Infantil Flamengo 2025/26
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Kit Infantil Flamengo%2025/26%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg'
  )
LIMIT 1;

-- Kit Infantil Real Madrid 2025/26
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid1.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Kit Infantil Real Madrid%2025/26%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid1.jpg'
  )
LIMIT 1;

-- Kit Infantil PSG 2024/25
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntosInfantis/InfantilPSG/InfantilPSG.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Kit Infantil PSG%2024/25%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntosInfantis/InfantilPSG/InfantilPSG.png'
  )
LIMIT 1;

-- Kit Infantil Brasil Retrô
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/ConjuntosInfantis/InfantilRetro/IntanfilBrasil1.jpeg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Kit Infantil Brasil%Retrô%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/ConjuntosInfantis/InfantilRetro/IntanfilBrasil1.jpeg'
  )
LIMIT 1;

-- =====================================================
-- PRODUTOS ACESSÓRIOS
-- =====================================================

-- Meia Flamengo
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Acessorios/Meias/MeiaFlamengo.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Meia Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Acessorios/Meias/MeiaFlamengo.jpg'
  )
LIMIT 1;

-- Meia Casual
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Acessorios/Meias/MeiaCasual.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Meia Casual%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Acessorios/Meias/MeiaCasual.jpg'
  )
LIMIT 1;

-- Boné Flamengo
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Acessorios/BonesTime/BoneFlamengo.png', 0, true
FROM public.products p
WHERE p.name ILIKE '%Boné Flamengo%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Acessorios/BonesTime/BoneFlamengo.png'
  )
LIMIT 1;

-- Boné Casual
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/Acessorios/BoneCasual/BoneCasual.jpg', 0, true
FROM public.products p
WHERE p.name ILIKE '%Boné Casual%'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images pi 
    WHERE pi.product_id = p.id 
    AND pi.image_url = '/images/Acessorios/BoneCasual/BoneCasual.jpg'
  )
LIMIT 1;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
-- NOTA: Este script insere imagens para produtos principais.
-- Para produtos adicionais ou imagens secundárias, você pode
-- adicionar mais INSERTs seguindo o mesmo padrão acima.
-- =====================================================
