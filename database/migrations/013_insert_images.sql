-- =====================================================
-- MIGRATION: Inserir imagens na tabela images
-- =====================================================
-- Este script insere todas as imagens dos produtos hardcoded
-- na tabela images. Depois, podemos referenciar essas imagens
-- nos produtos usando os IDs.
-- =====================================================

BEGIN;

-- =====================================================
-- INSERIR IMAGENS (apenas URLs únicas)
-- =====================================================

-- Imagens de Futebol
INSERT INTO public.images (image_url) VALUES
('/images/Futebol/CamisaJogador/FlamengoJogador.png'),
('/images/Futebol/CamisasFutebolRetro/Flamengo2009.png'),
('/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg'),
('/images/Futebol/CamisaJogador/FlamengoJogador3.jpg'),
('/images/Futebol/CamisaJogador/(G).png'),
('/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2024-25.png'),
('/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png'),
('/images/Futebol/CamisasFutebolRegatas/RegataInterMiami.jpg'),
('/images/Futebol/CamisasFutebolRegatas/RegataRealMadrid.jpg'),
('/images/Futebol/CamisasFutebolRetro/Parma95.png'),
('/images/Futebol/CamisasFutebolRetro/PSG2021.jpg'),
('/images/Futebol/CamisasFutebolFeminina/BrasilComemorativa.jpg'),
('/images/Futebol/CamisasFutebolFeminina/BrasilFeminina1.jpg'),
('/images/Futebol/CamisasFutebolFeminina/BrasilFeminina2.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FemininaFlamengoTreino.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino3.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino4.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FlamengoRosaFeminino.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino1.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino2.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino.jpg'),
('/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.png'),
('/images/Futebol/CamisasFutebolRetro/Brasil2018.png'),
('/images/Futebol/CamisasFutebolRetro/Brasil2019.png'),
('/images/Futebol/CamisasFutebolRetro/Brasil22.jpg'),
('/images/Futebol/CamisasFutebolRetro/Brasil94.png'),
('/images/Futebol/CamisasFutebolRetro/BrasilRetro.png'),
('/images/Futebol/CamisasFutebolRetro/BrasilTreino2021.jpg'),
('/images/Futebol/CamisasFutebolRetro/BrasilTreino2011.png'),
('/images/Futebol/CamisasFutebolRetro/Flamengo2019.jpg'),
('/images/Futebol/CamisasFutebolRetro/ManUnited2021.png'),
('/images/Futebol/CamisasFutebolRetro/ManUnited2022.png'),
('/images/Futebol/CamisasFutebolRetro/PSG2021Camisa2.png'),
('/images/Futebol/CamisasFutebolRetro/Amarela2021.jpg'),
('/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png'),
('/images/Futebol/ShortsFutebolMasculino/ShortFlamengo2.png'),
('/images/Futebol/ShortsFutebolMasculino/ShortFlamengoTreino.png'),
('/images/Futebol/Camisas25-26/Arsenal25-26.webp'),
('/images/Futebol/Camisas25-26/Barcelona25-26.png'),
('/images/Futebol/Camisas25-26/Bayer25-26.png'),
('/images/Futebol/Camisas25-26/Botafogo25-26.jpg'),
('/images/Futebol/Camisas25-26/Botafogo2-25-26.jpg'),
('/images/Futebol/Camisas25-26/FlamengoMasculina2.png'),
('/images/Futebol/Camisas25-26/FlamengoMasculina3.png'),
('/images/Futebol/Camisas25-26/FlamengoGoleiro25-26.jpg'),
('/images/Futebol/Camisas25-26/FlamengoGoleiro2-25-26.jpg'),
('/images/Futebol/Camisas25-26/FlamengoTreino25-26.jpg'),
('/images/Futebol/Camisas25-26/FlamengoTreino2.png'),
('/images/Futebol/Camisas25-26/Fluminense25-26.jpg'),
('/images/Futebol/Camisas25-26/Inter25-26.jpg'),
('/images/Futebol/Camisas25-26/Milan25-26.jpg'),
('/images/Futebol/Camisas25-26/Portugal25-26.jpg'),
('/images/Futebol/Camisas23-24/Colombia23-24.jpg'),
('/images/Futebol/Camisas23-24/Flamengo23-24.jpg'),
('/images/Futebol/Camisas23-24/FlamengoTreino23-24.jpg'),
('/images/Futebol/Camisas23-24/Palmeiras23-24.jpg'),
('/images/Futebol/Camisas24-25/Alnasser24-25.jpg'),
('/images/Futebol/Camisas24-25/Brasil24-25.jpg'),
('/images/Futebol/Camisas24-25/BrasilComemorativa24-25.png'),
('/images/Futebol/Camisas24-25/City24-25.jpg'),
('/images/Futebol/Camisas24-25/Flamengo2-2425.jpg'),
('/images/Futebol/Camisas24-25/Flamengo24-25.jpg'),
('/images/Futebol/Camisas24-25/FlamengoComissao24-25.jpg'),
('/images/Futebol/Camisas24-25/Fluminense24-25.jpg'),
('/images/Futebol/Camisas24-25/FluminensePatch24-25.jpg'),
('/images/Futebol/Camisas24-25/Franca24-25.jpg'),
('/images/Futebol/Camisas24-25/Inter24-25.jpg'),
('/images/Futebol/Camisas24-25/ManCity24-25.jpg'),
('/images/Futebol/Camisas24-25/RealMadrid24-25.jpg'),
('/images/Futebol/Camisas24-25/RealMadridTreino24-25.jpg'),
('/images/Futebol/Camisas24-25/RealMadridTreinio2-24-25.jpg'),
('/images/Futebol/Camisas24-25/Sport24-25.jpg'),
('/images/Futebol/Camisas24-25/Vasco2-2425.jpg'),
('/images/Futebol/Camisas24-25/Vasco24-25.jpg'),
('/images/Futebol/Camisas24-25/VascoComemorativa.jpg'),
('/images/Futebol/Camisas24-25/VascoComissao24-25.jpg')
ON CONFLICT (image_url) DO NOTHING;

-- Imagens NBA
INSERT INTO public.images (image_url) VALUES
('/images/NBA/LebronJames.jpg'),
('/images/NBA/bullsJordan.jpg')
ON CONFLICT (image_url) DO NOTHING;

-- Imagens NFL
INSERT INTO public.images (image_url) VALUES
('/images/NFL/mahomes.jpg'),
('/images/NFL/kelce.jpg')
ON CONFLICT (image_url) DO NOTHING;

-- Imagens Roupas de Treino
INSERT INTO public.images (image_url) VALUES
('/images/ConjuntoTreino/camisa-shorts/BermudaShortsFamengo.png'),
('/images/ConjuntoTreino/camisa-shorts/BermudaShortsInterMiami.png'),
('/images/ConjuntoTreino/Regata-shorts/RegataFlamengoShorts.png'),
('/images/ConjuntoTreino/Regata-shorts/RegataInterMiamiShorts.png'),
('/images/ConjuntoTreino/calças/CalçaFlamengo.jpg'),
('/images/ConjuntoTreino/Casacos/CasacoFlamengo.jpg'),
('/images/ConjuntoTreino/CortaVento/CortaVentoFluminense.jpg')
ON CONFLICT (image_url) DO NOTHING;

-- Imagens Infantis
INSERT INTO public.images (image_url) VALUES
('/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg'),
('/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo2.jpg'),
('/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo3.jpg'),
('/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid1.jpg'),
('/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid2.jpg'),
('/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid3.jpg'),
('/images/ConjuntosInfantis/InfantilPSG/InfantilPSG.png'),
('/images/ConjuntosInfantis/InfantilRetro/IntanfilBrasil1.jpeg'),
('/images/ConjuntosInfantis/InfantilRetro/InfantilBrasl2.jpeg'),
('/images/ConjuntosInfantis/InfanilFluminense/InfantilFlu.jpg'),
('/images/ConjuntosInfantis/InfantilSantos/InfantilSantos.webp'),
('/images/ConjuntosInfantis/InfantilVasco/InfantilVasco.jpg'),
('/images/ConjuntosInfantis/InfantilMilan/InfantilMilan1.png'),
('/images/ConjuntosInfantis/IntantilUSA/InfantilUSA.jpg')
ON CONFLICT (image_url) DO NOTHING;

-- Imagens Acessórios
INSERT INTO public.images (image_url) VALUES
('/images/Acessorios/Meias/MeiaFlamengo.jpg'),
('/images/Acessorios/Meias/MeiaCasual.jpg'),
('/images/Acessorios/BonesTime/BoneFlamengo.png'),
('/images/Acessorios/BoneCasual/BoneCasual.jpg')
ON CONFLICT (image_url) DO NOTHING;

COMMIT;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

