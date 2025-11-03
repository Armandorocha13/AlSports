-- =====================================================
-- SQL para inserção de produtos
-- Gerado em: 2025-11-02T23:48:17.039Z
-- Total de produtos: 109
-- =====================================================

BEGIN;


-- Produto 1: Camisa Flamengo 2024/25 - Versão Jogador
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 2024/25 - Versão Jogador',
  'camisa-flamengo-202425-versao-jogador',
  'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador com tecnologia de alta performance.',
  100,
  95,
  '1',
  NULL,
  'SKU-1',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 2: Camisa Retrô Flamengo 2009
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Flamengo 2009',
  'camisa-retro-flamengo-2009',
  'Camisa retrô do Flamengo de 2009, relembrando os tempos dourados do clube.',
  130,
  NULL,
  '1',
  '5',
  'SKU-5',
  ARRAY['P', 'M', 'G', '2XL', '3XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 3: Camisa 2 do Flamengo versão jogador 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa 2 do Flamengo versão jogador 2024/25',
  'camisa-2-do-flamengo-versao-jogador-202425',
  'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador.',
  100,
  95,
  '1',
  NULL,
  'SKU-7',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 4: Camisa 3 do Flamengo versão jogador 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa 3 do Flamengo versão jogador 2024/25',
  'camisa-3-do-flamengo-versao-jogador-202425',
  'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador.',
  100,
  95,
  '1',
  NULL,
  'SKU-8',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 5: Camisa da selecao da inglaterra versão jogador 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa da selecao da inglaterra versão jogador 2024/25',
  'camisa-da-selecao-da-inglaterra-versao-jogador-202425',
  'Camisa tailandesa da selecao da inglaterra temporada 2024/25, versão jogador.',
  100,
  95,
  '1',
  NULL,
  'SKU-23',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 6: Camisa Feminina Flamengo 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo 2024/25',
  'camisa-feminina-flamengo-202425',
  'Camisa tailandesa feminina do Flamengo temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-24',
  ARRAY['P', 'M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 7: Regata Flamengo 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Regata Flamengo 2024/25',
  'regata-flamengo-202425',
  'Regata tailandesa do Flamengo temporada 2024/25.',
  100,
  95,
  '1',
  '7',
  'SKU-25',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 8: Regata Inter Miami 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Regata Inter Miami 2024/25',
  'regata-inter-miami-202425',
  'Regata tailandesa do Inter Miami temporada 2024/25.',
  100,
  95,
  '1',
  '7',
  'SKU-34',
  ARRAY['P'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 9: Regata Real Madrid 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Regata Real Madrid 2024/25',
  'regata-real-madrid-202425',
  'Regata tailandesa do Real Madrid temporada 2024/25.',
  100,
  95,
  '1',
  '7',
  'SKU-40',
  ARRAY['M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 10: Camisa Retrô Parma 1995
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Parma 1995',
  'camisa-retro-parma-1995',
  'Camisa retrô do Parma de 1995, relembrando os tempos dourados do clube italiano.',
  130,
  NULL,
  '1',
  '5',
  'SKU-26',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 11: Camisa Retrô PSG 1998
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô PSG 1998',
  'camisa-retro-psg-1998',
  'Camisa retrô do PSG de 1998, relembrando os tempos dourados do clube francês.',
  130,
  NULL,
  '1',
  '5',
  'SKU-27',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 12: Camisa Feminina Brasil Comemorativa 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Brasil Comemorativa 2024/25',
  'camisa-feminina-brasil-comemorativa-202425',
  'Camisa tailandesa feminina da Seleção Brasileira comemorativa temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-28',
  ARRAY['P'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 13: Camisa Feminina Brasil 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Brasil 2024/25',
  'camisa-feminina-brasil-202425',
  'Camisa tailandesa feminina da Seleção Brasileira temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-29',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 14: Camisa Feminina Brasil 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Brasil 2ª Versão 2024/25',
  'camisa-feminina-brasil-2-versao-202425',
  'Camisa tailandesa feminina da Seleção Brasileira 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-30',
  ARRAY['M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 15: Camisa Feminina Flamengo Treino 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo Treino 2024/25',
  'camisa-feminina-flamengo-treino-202425',
  'Camisa tailandesa feminina de treino do Flamengo temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-31',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 16: Camisa Feminina Flamengo 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo 2ª Versão 2024/25',
  'camisa-feminina-flamengo-2-versao-202425',
  'Camisa tailandesa feminina do Flamengo 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-32',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 17: Camisa Feminina Flamengo 3ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo 3ª Versão 2024/25',
  'camisa-feminina-flamengo-3-versao-202425',
  'Camisa tailandesa feminina do Flamengo 3ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-33',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 18: Camisa Feminina Flamengo 4ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo 4ª Versão 2024/25',
  'camisa-feminina-flamengo-4-versao-202425',
  'Camisa tailandesa feminina do Flamengo 4ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-34',
  ARRAY['P'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 19: Camisa Feminina Flamengo Rosa 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Flamengo Rosa 2024/25',
  'camisa-feminina-flamengo-rosa-202425',
  'Camisa tailandesa feminina do Flamengo rosa temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-35',
  ARRAY['M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 20: Camisa Feminina Fluminense 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Fluminense 2024/25',
  'camisa-feminina-fluminense-202425',
  'Camisa tailandesa feminina do Fluminense temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-36',
  ARRAY['P', 'M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 21: Camisa Feminina Fluminense 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Fluminense 2ª Versão 2024/25',
  'camisa-feminina-fluminense-2-versao-202425',
  'Camisa tailandesa feminina do Fluminense 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-37',
  ARRAY['P', 'M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 22: Camisa Feminina Fluminense 3ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Fluminense 3ª Versão 2024/25',
  'camisa-feminina-fluminense-3-versao-202425',
  'Camisa tailandesa feminina do Fluminense 3ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-38',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 23: Camisa Feminina Fluminense Patch 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Feminina Fluminense Patch 2024/25',
  'camisa-feminina-fluminense-patch-202425',
  'Camisa tailandesa feminina do Fluminense com patch temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-39',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 24: Camisa Retrô Brasil 2018
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil 2018',
  'camisa-retro-brasil-2018',
  'Camisa retrô da Seleção Brasileira de 2018, relembrando a Copa do Mundo.',
  130,
  NULL,
  '1',
  '5',
  'SKU-41',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 25: Camisa Retrô Brasil 2019
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil 2019',
  'camisa-retro-brasil-2019',
  'Camisa retrô da Seleção Brasileira de 2019.',
  130,
  NULL,
  '1',
  '5',
  'SKU-42',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 26: Camisa Retrô Brasil 2022
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil 2022',
  'camisa-retro-brasil-2022',
  'Camisa retrô da Seleção Brasileira de 2022.',
  130,
  NULL,
  '1',
  '5',
  'SKU-43',
  ARRAY['G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 27: Camisa Retrô Brasil 1994
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil 1994',
  'camisa-retro-brasil-1994',
  'Camisa retrô da Seleção Brasileira de 1994, relembrando o tetra.',
  130,
  NULL,
  '1',
  '5',
  'SKU-44',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 28: Camisa Retrô Brasil Clássica
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil Clássica',
  'camisa-retro-brasil-classica',
  'Camisa retrô clássica da Seleção Brasileira.',
  130,
  NULL,
  '1',
  '5',
  'SKU-45',
  ARRAY['2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 29: Camisa Retrô Brasil Treino 2021
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil Treino 2021',
  'camisa-retro-brasil-treino-2021',
  'Camisa retrô de treino da Seleção Brasileira 2021.',
  130,
  NULL,
  '1',
  '5',
  'SKU-46',
  ARRAY['G', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 30: Camisa Retrô Brasil Treino 2021 2ª Versão
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Brasil Treino 2021 2ª Versão',
  'camisa-retro-brasil-treino-2021-2-versao',
  'Camisa retrô de treino da Seleção Brasileira 2021 2ª versão.',
  130,
  NULL,
  '1',
  '5',
  'SKU-47',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 31: Camisa Retrô Flamengo 2019
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Flamengo 2019',
  'camisa-retro-flamengo-2019',
  'Camisa retrô do Flamengo de 2019.',
  130,
  NULL,
  '1',
  '5',
  'SKU-48',
  ARRAY['P', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 32: Camisa Retrô Manchester United 2021
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Manchester United 2021',
  'camisa-retro-manchester-united-2021',
  'Camisa retrô do Manchester United de 2021.',
  130,
  NULL,
  '1',
  '5',
  'SKU-49',
  ARRAY['G', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 33: Camisa Retrô Manchester United 2022
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô Manchester United 2022',
  'camisa-retro-manchester-united-2022',
  'Camisa retrô do Manchester United de 2022.',
  130,
  NULL,
  '1',
  '5',
  'SKU-50',
  ARRAY['G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 34: Camisa Retrô PSG 2021
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô PSG 2021',
  'camisa-retro-psg-2021',
  'Camisa retrô do PSG de 2021.',
  130,
  NULL,
  '1',
  '5',
  'SKU-52',
  ARRAY['2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 35: Camisa Retrô PSG 2021 2ª Versão
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Retrô PSG 2021 2ª Versão',
  'camisa-retro-psg-2021-2-versao',
  'Camisa retrô do PSG de 2021 2ª versão.',
  130,
  NULL,
  '1',
  '5',
  'SKU-53',
  ARRAY['GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 36: Camisa Derby County FC
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Derby County FC',
  'camisa-derby-county-fc',
  'Camisa retrô amarela da Seleção Brasileira de 2021.',
  130,
  NULL,
  '1',
  '5',
  'SKU-54',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 37: Short Flamengo 1 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Short Flamengo 1 2024/25',
  'short-flamengo-1-202425',
  'Short tailandês do Flamengo temporada 2024/25.',
  95,
  NULL,
  '1',
  NULL,
  'SKU-55',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 38: Short Flamengo 2 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Short Flamengo 2 2024/25',
  'short-flamengo-2-202425',
  'Short tailandês do Flamengo 2ª versão temporada 2024/25.',
  95,
  NULL,
  '1',
  NULL,
  'SKU-56',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 39: Short Flamengo Treino 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Short Flamengo Treino 2024/25',
  'short-flamengo-treino-202425',
  'Short tailandês de treino do Flamengo temporada 2024/25.',
  95,
  NULL,
  '1',
  NULL,
  'SKU-57',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 40: Short Feminino Flamengo 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Short Feminino Flamengo 2024/25',
  'short-feminino-flamengo-202425',
  'Short tailandês feminino do Flamengo temporada 2024/25.',
  95,
  NULL,
  '1',
  NULL,
  'SKU-58',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 41: Camisa Arsenal 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Arsenal 2025/26',
  'camisa-arsenal-202526',
  'Camisa tailandesa do Arsenal temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-59',
  ARRAY['P'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 42: Camisa Barcelona 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Barcelona 2025/26',
  'camisa-barcelona-202526',
  'Camisa tailandesa do Barcelona temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-60',
  ARRAY['GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 43: Camisa Bayer Munich 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Bayer Munich 2025/26',
  'camisa-bayer-munich-202526',
  'Camisa tailandesa do Bayer Leverkusen temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-61',
  ARRAY['M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 44: Camisa Botafogo 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Botafogo 2025/26',
  'camisa-botafogo-202526',
  'Camisa tailandesa do Botafogo temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-62',
  ARRAY['2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 45: Camisa Botafogo 2ª Versão 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Botafogo 2ª Versão 2025/26',
  'camisa-botafogo-2-versao-202526',
  'Camisa tailandesa do Botafogo 2ª versão temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-63',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 46: Camisa Chelsea 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Chelsea 2025/26',
  'camisa-chelsea-202526',
  'Camisa tailandesa do Chelsea temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-64',
  ARRAY['G', 'GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 47: Camisa Flamengo 2ª Versão 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 2ª Versão 2025/26',
  'camisa-flamengo-2-versao-202526',
  'Camisa tailandesa do Flamengo 2ª versão temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-65',
  ARRAY['P', 'M', 'G', 'GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 48: Camisa Flamengo 3ª Versão 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 3ª Versão 2025/26',
  'camisa-flamengo-3-versao-202526',
  'Camisa tailandesa do Flamengo 3ª versão temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-66',
  ARRAY['P', 'M', 'G', 'GG', '2XL', '3XL', '4XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 49: Camisa Flamengo Goleiro 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Goleiro 2025/26',
  'camisa-flamengo-goleiro-202526',
  'Camisa tailandesa de goleiro do Flamengo temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-67',
  ARRAY['P', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 50: Camisa Flamengo Goleiro 2ª Versão 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Goleiro 2ª Versão 2025/26',
  'camisa-flamengo-goleiro-2-versao-202526',
  'Camisa tailandesa de goleiro do Flamengo 2ª versão temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-68',
  ARRAY['P', 'M', 'G', 'GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 51: Camisa Flamengo Treino 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Treino 2025/26',
  'camisa-flamengo-treino-202526',
  'Camisa tailandesa de treino do Flamengo temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-69',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 52: Camisa Flamengo Treino 2ª Versão 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Treino 2ª Versão 2025/26',
  'camisa-flamengo-treino-2-versao-202526',
  'Camisa tailandesa de treino do Flamengo 2ª versão temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-70',
  ARRAY['M', 'G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 53: Camisa Fluminense 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Fluminense 2025/26',
  'camisa-fluminense-202526',
  'Camisa tailandesa do Fluminense temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-71',
  ARRAY['P', 'M', 'G', 'GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 54: Camisa Internacional 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Internacional 2025/26',
  'camisa-internacional-202526',
  'Camisa tailandesa do Internacional temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-72',
  ARRAY['P', 'M', 'G', 'GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 55: Camisa Milan 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Milan 2025/26',
  'camisa-milan-202526',
  'Camisa tailandesa do Milan temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-73',
  ARRAY['2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 56: Camisa Portugal 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Portugal 2025/26',
  'camisa-portugal-202526',
  'Camisa tailandesa da Seleção Portuguesa temporada 2025/26.',
  100,
  95,
  '1',
  NULL,
  'SKU-74',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 57: Camisa Colômbia 2023/24
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Colômbia 2023/24',
  'camisa-colombia-202324',
  'Camisa tailandesa da Seleção da Colômbia temporada 2023/24.',
  100,
  95,
  '1',
  NULL,
  'SKU-75',
  ARRAY['M', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 58: Camisa Flamengo 2023/24
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 2023/24',
  'camisa-flamengo-202324',
  'Camisa tailandesa do Flamengo temporada 2023/24.',
  100,
  95,
  '1',
  NULL,
  'SKU-76',
  ARRAY['P'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 59: Camisa Flamengo Treino 2023/24
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Treino 2023/24',
  'camisa-flamengo-treino-202324',
  'Camisa tailandesa de treino do Flamengo temporada 2023/24.',
  100,
  95,
  '1',
  NULL,
  'SKU-77',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 60: Camisa Palmeiras 2023/24
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Palmeiras 2023/24',
  'camisa-palmeiras-202324',
  'Camisa tailandesa do Palmeiras temporada 2023/24.',
  100,
  95,
  '1',
  NULL,
  'SKU-78',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 61: Camisa Al Nassr 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Al Nassr 2024/25',
  'camisa-al-nassr-202425',
  'Camisa tailandesa do Al Nassr temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-79',
  ARRAY['G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 62: Camisa Brasil  2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Brasil  2024/25',
  'camisa-brasil-202425',
  'Camisa tailandesa da Seleção Brasileira temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-80',
  ARRAY['2XL', '4XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 63: Camisa Brasil Comemorativa 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Brasil Comemorativa 2024/25',
  'camisa-brasil-comemorativa-202425',
  'Camisa tailandesa comemorativa da Seleção Brasileira temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-81',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 64: Camisa Manchester City 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Manchester City 2024/25',
  'camisa-manchester-city-202425',
  'Camisa tailandesa do Manchester City temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-82',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 65: Camisa Flamengo 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 2ª Versão 2024/25',
  'camisa-flamengo-2-versao-202425',
  'Camisa tailandesa do Flamengo 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-83',
  ARRAY['P', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 66: Camisa Flamengo 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo 2024/25',
  'camisa-flamengo-202425',
  'Camisa tailandesa do Flamengo temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-84',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 67: Camisa Flamengo Comissão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Flamengo Comissão 2024/25',
  'camisa-flamengo-comissao-202425',
  'Camisa tailandesa de comissão do Flamengo temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-85',
  ARRAY['GG', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 68: Camisa Fluminense 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Fluminense 2024/25',
  'camisa-fluminense-202425',
  'Camisa tailandesa do Fluminense temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-86',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 69: Camisa Fluminense Patch 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Fluminense Patch 2024/25',
  'camisa-fluminense-patch-202425',
  'Camisa tailandesa do Fluminense com patch temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-87',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 70: Camisa França 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa França 2024/25',
  'camisa-franca-202425',
  'Camisa tailandesa da Seleção da França temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-88',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 71: Camisa Internacional 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Internacional 2024/25',
  'camisa-internacional-202425',
  'Camisa tailandesa do Internacional temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-89',
  ARRAY['G'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 72: Camisa Manchester City 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Manchester City 2ª Versão 2024/25',
  'camisa-manchester-city-2-versao-202425',
  'Camisa tailandesa do Manchester City 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-90',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 73: Camisa Real Madrid 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Real Madrid 2024/25',
  'camisa-real-madrid-202425',
  'Camisa tailandesa do Real Madrid temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-91',
  ARRAY['5XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 74: Camisa Real Madrid Treino 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Real Madrid Treino 2024/25',
  'camisa-real-madrid-treino-202425',
  'Camisa tailandesa de treino do Real Madrid temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-92',
  ARRAY['G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 75: Camisa Real Madrid Treino 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Real Madrid Treino 2ª Versão 2024/25',
  'camisa-real-madrid-treino-2-versao-202425',
  'Camisa tailandesa de treino do Real Madrid 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-93',
  ARRAY['M', 'G', '2XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 76: Camisa Sport 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Sport 2024/25',
  'camisa-sport-202425',
  'Camisa tailandesa do Sport temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-94',
  ARRAY['G', 'GG', 'XL'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 77: Camisa Vasco 2ª Versão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Vasco 2ª Versão 2024/25',
  'camisa-vasco-2-versao-202425',
  'Camisa tailandesa do Vasco 2ª versão temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-95',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 78: Camisa Vasco 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Vasco 2024/25',
  'camisa-vasco-202425',
  'Camisa tailandesa do Vasco temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-96',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 79: Camisa Vasco Comemorativa 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Vasco Comemorativa 2024/25',
  'camisa-vasco-comemorativa-202425',
  'Camisa tailandesa comemorativa do Vasco temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-97',
  ARRAY['M'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 80: Camisa Vasco Comissão 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Vasco Comissão 2024/25',
  'camisa-vasco-comissao-202425',
  'Camisa tailandesa de comissão do Vasco temporada 2024/25.',
  100,
  95,
  '1',
  NULL,
  'SKU-98',
  ARRAY['GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 81: Conjunto de treino Flamengo Camisa + Short
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Conjunto de treino Flamengo Camisa + Short',
  'conjunto-de-treino-flamengo-camisa-short',
  'Conjunto tailandês completo para treino com camisa + short.',
  160,
  NULL,
  '2',
  '13',
  'SKU-2',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 82: Conjunto de treino Inter Miami Camisa + Short
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Conjunto de treino Inter Miami Camisa + Short',
  'conjunto-de-treino-inter-miami-camisa-short',
  'Conjunto tailandês completo do Inter Miami para treino com camisa + short.',
  160,
  NULL,
  '2',
  '13',
  'SKU-28',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 83: Regata + Short de treino Flamengo
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Regata + Short de treino Flamengo',
  'regata-short-de-treino-flamengo',
  'Conjunto tailandês de regata + short do Flamengo para treino com regata + short.',
  160,
  NULL,
  '2',
  '14',
  'SKU-29',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 84: Regata + Short de treino Inter Miami
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Regata + Short de treino Inter Miami',
  'regata-short-de-treino-inter-miami',
  'Conjunto tailandês de regata + short do Inter Miami para treino.',
  160,
  NULL,
  '2',
  '14',
  'SKU-30',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 85: Calça de treino Flamengo
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Calça de treino Flamengo',
  'calca-de-treino-flamengo',
  'Calça qualidade tailandesa do Flamengo para treino.',
  80,
  NULL,
  '2',
  NULL,
  'SKU-31',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 86: Casaco de treino Flamengo
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Casaco de treino Flamengo',
  'casaco-de-treino-flamengo',
  'Casaco qualidade tailandesa do Flamengo para treino.',
  120,
  NULL,
  '2',
  '12',
  'SKU-32',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 87: Corta Vento de treino Fluminense
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Corta Vento de treino Fluminense',
  'corta-vento-de-treino-fluminense',
  'Corta vento tailandês do Fluminense para treino com proteção contra vento.',
  100,
  NULL,
  '2',
  '15',
  'SKU-33',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 88: Kit Infantil Flamengo 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Flamengo 2025/26',
  'kit-infantil-flamengo-202526',
  'Kit tailandês completo infantil do Flamengo temporada 2025/26.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-10',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 89: Kit Infantil Flamengo 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Flamengo 2025/26',
  'kit-infantil-flamengo-202526-1',
  'Kit tailandês completo infantil do Flamengo temporada 2025/26.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-12',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 90: Kit Infantil Real Madrid 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Real Madrid 2025/26',
  'kit-infantil-real-madrid-202526',
  'Kit tailandês completo infantil do Real Madrid temporada 2025/26.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-13',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 91: Kit Infantil PSG 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil PSG 2024/25',
  'kit-infantil-psg-202425',
  'Kit tailandês completo infantil do PSG temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-14',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 92: Kit Infantil Brasil Retrô
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Brasil Retrô',
  'kit-infantil-brasil-retro',
  'Kit tailandês retrô infantil da Seleção Brasileira.',
  100,
  NULL,
  '4',
  '22',
  'SKU-15',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 93: Kit Infantil Brasil retrô
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Brasil retrô',
  'kit-infantil-brasil-retro-1',
  'Kit tailandês completo infantil da Seleção Brasileira retrô.',
  100,
  NULL,
  '4',
  '22',
  'SKU-17',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 94: Kit Infantil Fluminense 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Fluminense 2024/25',
  'kit-infantil-fluminense-202425',
  'Kit tailandês completo infantil do Fluminense temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-18',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 95: Kit Infantil Santos 2025/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Santos 2025/26',
  'kit-infantil-santos-202526',
  'Kit tailandês completo infantil do Santos temporada 2025/26.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-19',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 96: Kit Infantil Vasco 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Vasco 2024/25',
  'kit-infantil-vasco-202425',
  'Kit tailandês completo infantil do Vasco temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-20',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 97: Kit Infantil Milan 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Milan 2024/25',
  'kit-infantil-milan-202425',
  'Kit tailandês completo infantil do Milan temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-21',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 98: Kit Infantil USA 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil USA 2024/25',
  'kit-infantil-usa-202425',
  'Kit tailandês completo infantil da Seleção dos EUA temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-22',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 99: Kit Infantil Real Madrid 2024/26
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Real Madrid 2024/26',
  'kit-infantil-real-madrid-202426',
  'Kit tailandês completo infantil do Real Madrid temporada 2024/26.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-23',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 100: Kit Infantil Real Madrid 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Real Madrid 2024/25',
  'kit-infantil-real-madrid-202425',
  'Kit tailandês completo infantil do Real Madrid temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-24',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 101: Kit Infantil Flamengo 2024/25
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Kit Infantil Flamengo 2024/25',
  'kit-infantil-flamengo-202425',
  'Kit tailandês completo infantil do Flamengo temporada 2024/25.',
  100,
  NULL,
  '4',
  NULL,
  'SKU-25',
  ARRAY['3-4 anos', '4-5 anos', '5-6 anos', '6-7 anos', '8-9 anos', '10-11 anos', '12-13 anos'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 102: Camisa Lakers LeBron James
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Lakers LeBron James',
  'camisa-lakers-lebron-james',
  'Camisa tailandesa do Lakers com LeBron James, versão jogador.',
  130,
  NULL,
  '3',
  NULL,
  'SKU-3',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 103: Camisa Chicago Bulls Jordan
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa Chicago Bulls Jordan',
  'camisa-chicago-bulls-jordan',
  'Camisa tailandesa do Chicago Bulls com Jordan, versão jogador.',
  130,
  NULL,
  '3',
  NULL,
  'SKU-4',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 104: Camisa NFL MAHOMES
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa NFL MAHOMES',
  'camisa-nfl-mahomes',
  'Camisa tailandesa do Kansas City Chiefs com Patrick Mahomes.',
  130,
  NULL,
  '8',
  NULL,
  'SKU-9',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 105: Camisa NFL KELCE
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Camisa NFL KELCE',
  'camisa-nfl-kelce',
  'Camisa tailandesa do Kansas City Chiefs com Travis Kelce.',
  130,
  NULL,
  '8',
  NULL,
  'SKU-11',
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 106: Meia Flamengo
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Meia Flamengo',
  'meia-flamengo',
  'Meia tailandesa do Flamengo com tecnologia de alta performance.',
  25,
  NULL,
  '5',
  '29',
  'SKU-12',
  ARRAY['Único'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 107: Meia Casual
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Meia Casual',
  'meia-casual',
  'Meia tailandesa casual com tecnologia de alta performance.',
  25,
  NULL,
  '5',
  '29',
  'SKU-13',
  ARRAY['Único'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 108: Boné Flamengo
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Boné Flamengo',
  'bone-flamengo',
  'Boné tailandês do Flamengo com ajuste regulável.',
  45,
  NULL,
  '5',
  NULL,
  'SKU-16',
  ARRAY['Único'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;


-- Produto 109: Boné Casual
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  'Boné Casual',
  'bone-casual',
  'Boné tailandês casual com design moderno.',
  40,
  NULL,
  '5',
  NULL,
  'SKU-17',
  ARRAY['Único'],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  false,
  100,
  10
) ON CONFLICT (sku) DO NOTHING;

COMMIT;