// ========================================================================
// PRODUTOS DE FUTEBOL
// ========================================================================

export const futebolProducts = [
  {
    id: '1',
    name: 'Camisa Flamengo 2024/25 - Versão Jogador',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisaJogador/FlamengoJogador.png',
    description: 'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador com tecnologia de alta performance.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-jogador',
    featured: true,
    onSale: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '5',
    name: 'Camisa Retrô Flamengo 2009',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png',
    description: 'Camisa retrô do Flamengo de 2009, relembrando os tempos dourados do clube.',
    sizes: ['P', 'M', 'G', '2XL', '3XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '7',
    name: 'Camisa 2 do Flamengo versão jogador 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg',
    description: 'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-jogador',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '8',
    name: 'Camisa 3 do Flamengo versão jogador 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisaJogador/FlamengoJogador3.jpg',
    description: 'Camisa tailandesa do Flamengo temporada 2024/25, versão jogador.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-jogador',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '23',
    name: 'Camisa da selecao da inglaterra versão jogador 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisaJogador/(G).png',
    description: 'Camisa tailandesa da selecao da inglaterra temporada 2024/25, versão jogador.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'versao-jogador',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '24',
    name: 'Camisa Feminina Flamengo 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2024-25.png',
    description: 'Camisa tailandesa feminina do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '25',
    name: 'Regata Flamengo 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png',
    description: 'Regata tailandesa do Flamengo temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'regatas',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 REGATA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 REGATAS
      { min: 5, price: 85.00 } // 5+ REGATAS
    ]
  },
  {
    id: '34',
    name: 'Regata Inter Miami 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolRegatas/RegataInterMiami.jpg',
    description: 'Regata tailandesa do Inter Miami temporada 2024/25.',
    sizes: ['P'],
    category: 'futebol',
    subcategory: 'regatas',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 REGATA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 REGATAS
      { min: 5, price: 85.00 } // 5+ REGATAS
    ]
  },
  {
    id: '40',
    name: 'Regata Real Madrid 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolRegatas/RegataRealMadrid.jpg',
    description: 'Regata tailandesa do Real Madrid temporada 2024/25.',
    sizes: ['M', 'G'],
    category: 'futebol',
    subcategory: 'regatas',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 REGATA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 REGATAS
      { min: 5, price: 85.00 } // 5+ REGATAS
    ]
  },
  {
    id: '26',
    name: 'Camisa Retrô Parma 1995',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Parma95.png',
    description: 'Camisa retrô do Parma de 1995, relembrando os tempos dourados do clube italiano.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
 
  {
    id: '27',
    name: 'Camisa Retrô PSG 1998',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg',
    description: 'Camisa retrô do PSG de 1998, relembrando os tempos dourados do clube francês.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '28',
    name: 'Camisa Feminina Brasil Comemorativa 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/BrasilComemorativa.jpg',
    description: 'Camisa tailandesa feminina da Seleção Brasileira comemorativa temporada 2024/25.',
    sizes: ['P'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '29',
    name: 'Camisa Feminina Brasil 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/BrasilFeminina1.jpg',
    description: 'Camisa tailandesa feminina da Seleção Brasileira temporada 2024/25.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '30',
    name: 'Camisa Feminina Brasil 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/BrasilFeminina2.jpg',
    description: 'Camisa tailandesa feminina da Seleção Brasileira 2ª versão temporada 2024/25.',
    sizes: ['M', 'G'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '31',
    name: 'Camisa Feminina Flamengo Treino 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FemininaFlamengoTreino.jpg',
    description: 'Camisa tailandesa feminina de treino do Flamengo temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '32',
    name: 'Camisa Feminina Flamengo 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2.jpg',
    description: 'Camisa tailandesa feminina do Flamengo 2ª versão temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '33',
    name: 'Camisa Feminina Flamengo 3ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino3.jpg',
    description: 'Camisa tailandesa feminina do Flamengo 3ª versão temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '34',
    name: 'Camisa Feminina Flamengo 4ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino4.jpg',
    description: 'Camisa tailandesa feminina do Flamengo 4ª versão temporada 2024/25.',
    sizes: ['P'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '35',
    name: 'Camisa Feminina Flamengo Rosa 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FlamengoRosaFeminino.jpg',
    description: 'Camisa tailandesa feminina do Flamengo rosa temporada 2024/25.',
    sizes: ['M', 'G'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '36',
    name: 'Camisa Feminina Fluminense 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino1.jpg',
    description: 'Camisa tailandesa feminina do Fluminense temporada 2024/25.',
    sizes: ['P', 'M', 'G'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '37',
    name: 'Camisa Feminina Fluminense 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino2.jpg',
    description: 'Camisa tailandesa feminina do Fluminense 2ª versão temporada 2024/25.',
    sizes: ['P', 'M'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '38',
    name: 'Camisa Feminina Fluminense 3ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino.jpg',
    description: 'Camisa tailandesa feminina do Fluminense 3ª versão temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '39',
    name: 'Camisa Feminina Fluminense Patch 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.png',
    description: 'Camisa tailandesa feminina do Fluminense com patch temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '41',
    name: 'Camisa Retrô Brasil 2018',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Brasil2018.png',
    description: 'Camisa retrô da Seleção Brasileira de 2018, relembrando a Copa do Mundo.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '42',
    name: 'Camisa Retrô Brasil 2019',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Brasil2019.png',
    description: 'Camisa retrô da Seleção Brasileira de 2019.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '43',
    name: 'Camisa Retrô Brasil 2022',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Brasil22.jpg',
    description: 'Camisa retrô da Seleção Brasileira de 2022.',
    sizes: ['G', 'GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '44',
    name: 'Camisa Retrô Brasil 1994',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Brasil94.png',
    description: 'Camisa retrô da Seleção Brasileira de 1994, relembrando o tetra.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '45',
    name: 'Camisa Retrô Brasil Clássica',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/BrasilRetro.png',
    description: 'Camisa retrô clássica da Seleção Brasileira.',
    sizes: ['2XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '46',
    name: 'Camisa Retrô Brasil Treino 2021',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/BrasilTreino2021.jpg',
    description: 'Camisa retrô de treino da Seleção Brasileira 2021.',
    sizes: ['G', '2XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '47',
    name: 'Camisa Retrô Brasil Treino 2021 2ª Versão',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/BrasilTreino2011.png',
    description: 'Camisa retrô de treino da Seleção Brasileira 2021 2ª versão.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '48',
    name: 'Camisa Retrô Flamengo 2019',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Flamengo2019.jpg',
    description: 'Camisa retrô do Flamengo de 2019.',
    sizes: ['P', 'G'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '49',
    name: 'Camisa Retrô Manchester United 2021',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/ManUnited2021.png',
    description: 'Camisa retrô do Manchester United de 2021.',
    sizes: ['G', '2XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '50',
    name: 'Camisa Retrô Manchester United 2022',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/ManUnited2022.png',
    description: 'Camisa retrô do Manchester United de 2022.',
    sizes: ['G', 'GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
 
  {
    id: '52',
    name: 'Camisa Retrô PSG 2021',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg',
    description: 'Camisa retrô do PSG de 2021.',
    sizes: ['2XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '53',
    name: 'Camisa Retrô PSG 2021 2ª Versão',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/PSG2021Camisa2.png',
    description: 'Camisa retrô do PSG de 2021 2ª versão.',
    sizes: ['GG', '2XL'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '54',
    name: 'Camisa Derby County FC',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/Amarela2021.jpg',
    description: 'Camisa retrô amarela da Seleção Brasileira de 2021.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '55',
    name: 'Short Flamengo 1 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png',
    description: 'Short tailandês do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'shorts-masculino',
    featured: true,
    priceRanges: [
      { min: 1, price: 95.00 }, // 1 SHORT (VAREJO)
      { min: 2, max: 4, price: 85.00 }, // 2-4 SHORTS
      { min: 5, price: 80.00 } // 5+ SHORTS
    ]
  },
  {
    id: '56',
    name: 'Short Flamengo 2 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo2.png',
    description: 'Short tailandês do Flamengo 2ª versão temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'shorts-masculino',
    featured: true,
    priceRanges: [
      { min: 1, price: 95.00 }, // 1 SHORT (VAREJO)
      { min: 2, max: 4, price: 85.00 }, // 2-4 SHORTS
      { min: 5, price: 80.00 } // 5+ SHORTS
    ]
  },
  {
    id: '57',
    name: 'Short Flamengo Treino 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/ShortsFutebolMasculino/ShortFlamengoTreino.png',
    description: 'Short tailandês de treino do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'shorts-masculino',
    featured: true,
    priceRanges: [
      { min: 1, price: 95.00 }, // 1 SHORT (VAREJO)
      { min: 2, max: 4, price: 85.00 }, // 2-4 SHORTS
      { min: 5, price: 80.00 } // 5+ SHORTS
    ]
  },
  {
    id: '58',
    name: 'Short Feminino Flamengo 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png',
    description: 'Short tailandês feminino do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'shorts-feminino',
    featured: true,
    priceRanges: [
      { min: 1, price: 95.00 }, // 1 SHORT (VAREJO)
      { min: 2, max: 4, price: 85.00 }, // 2-4 SHORTS
      { min: 5, price: 80.00 } // 5+ SHORTS
    ]
  },
  {
    id: '59',
    name: 'Camisa Arsenal 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Arsenal25-26.webp',
    description: 'Camisa tailandesa do Arsenal temporada 2025/26.',
    sizes: ['P' ],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '60',
    name: 'Camisa Barcelona 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Barcelona25-26.png',
    description: 'Camisa tailandesa do Barcelona temporada 2025/26.',
    sizes: ['GG', '2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '61',
    name: 'Camisa Bayer Munich 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Bayer25-26.png',
    description: 'Camisa tailandesa do Bayer Leverkusen temporada 2025/26.',
    sizes: ['M', 'G'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '62',
    name: 'Camisa Botafogo 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Botafogo25-26.jpg',
    description: 'Camisa tailandesa do Botafogo temporada 2025/26.',
    sizes: ['2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '63',
    name: 'Camisa Botafogo 2ª Versão 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Botafogo2-25-26.jpg',
    description: 'Camisa tailandesa do Botafogo 2ª versão temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '64',
    name: 'Camisa Chelsea 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Chelsea25-26.png',
    description: 'Camisa tailandesa do Chelsea temporada 2025/26.',
    sizes: ['G', 'GG', '2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '65',
    name: 'Camisa Flamengo 2ª Versão 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoMasculina2.png',
    description: 'Camisa tailandesa do Flamengo 2ª versão temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG', '2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '66',
    name: 'Camisa Flamengo 3ª Versão 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoMasculina3.png',
    description: 'Camisa tailandesa do Flamengo 3ª versão temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG', '2XL','3XL','4XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '67',
    name: 'Camisa Flamengo Goleiro 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoGoleiro25-26.jpg',
    description: 'Camisa tailandesa de goleiro do Flamengo temporada 2025/26.',
    sizes: ['P', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '68',
    name: 'Camisa Flamengo Goleiro 2ª Versão 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoGoleiro2-25-26.jpg',
    description: 'Camisa tailandesa de goleiro do Flamengo 2ª versão temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG','2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '69',
    name: 'Camisa Flamengo Treino 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoTreino25-26.jpg',
    description: 'Camisa tailandesa de treino do Flamengo temporada 2025/26.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '70',
    name: 'Camisa Flamengo Treino 2ª Versão 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/FlamengoTreino2.png',
    description: 'Camisa tailandesa de treino do Flamengo 2ª versão temporada 2025/26.',
    sizes: ['M', 'G'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '71',
    name: 'Camisa Fluminense 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Fluminense25-26.jpg',
    description: 'Camisa tailandesa do Fluminense temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG','2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '72',
    name: 'Camisa Internacional 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Inter25-26.jpg',
    description: 'Camisa tailandesa do Internacional temporada 2025/26.',
    sizes: ['P', 'M', 'G', 'GG','2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '73',
    name: 'Camisa Milan 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Milan25-26.jpg',
    description: 'Camisa tailandesa do Milan temporada 2025/26.',
    sizes: ['2XL'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '74',
    name: 'Camisa Portugal 2025/26',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas25-26/Portugal25-26.jpg',
    description: 'Camisa tailandesa da Seleção Portuguesa temporada 2025/26.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-25-26',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '75',
    name: 'Camisa Colômbia 2023/24',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas23-24/Colombia23-24.jpg',
    description: 'Camisa tailandesa da Seleção da Colômbia temporada 2023/24.',
    sizes: ['M', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-23-24',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '76',
    name: 'Camisa Flamengo 2023/24',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas23-24/Flamengo23-24.jpg',
    description: 'Camisa tailandesa do Flamengo temporada 2023/24.',
    sizes: ['P'],
    category: 'futebol',
    subcategory: 'temporada-23-24',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '77',
    name: 'Camisa Flamengo Treino 2023/24',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas23-24/FlamengoTreino23-24.jpg',
    description: 'Camisa tailandesa de treino do Flamengo temporada 2023/24.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-23-24',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '78',
    name: 'Camisa Palmeiras 2023/24',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas23-24/Palmeiras23-24.jpg',
    description: 'Camisa tailandesa do Palmeiras temporada 2023/24.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'temporada-23-24',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '79',
    name: 'Camisa Al Nassr 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Alnasser24-25.jpg',
    description: 'Camisa tailandesa do Al Nassr temporada 2024/25.',
    sizes: [ 'G', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '80',
    name: 'Camisa Brasil  2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Brasil24-25.jpg',
    description: 'Camisa tailandesa da Seleção Brasileira temporada 2024/25.',
    sizes: ['2XL','4XL'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '81',
    name: 'Camisa Brasil Comemorativa 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/BrasilComemorativa24-25.png',
    description: 'Camisa tailandesa comemorativa da Seleção Brasileira temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '82',
    name: 'Camisa Manchester City 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/City24-25.jpg',
    description: 'Camisa tailandesa do Manchester City temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '83',
    name: 'Camisa Flamengo 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Flamengo2-2425.jpg',
    description: 'Camisa tailandesa do Flamengo 2ª versão temporada 2024/25.',
    sizes: ['P', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '84',
    name: 'Camisa Flamengo 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Flamengo24-25.jpg',
    description: 'Camisa tailandesa do Flamengo temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '85',
    name: 'Camisa Flamengo Comissão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/FlamengoComissao24-25.jpg',
    description: 'Camisa tailandesa de comissão do Flamengo temporada 2024/25.',
    sizes: ['GG','2XL'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '86',
    name: 'Camisa Fluminense 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Fluminense24-25.jpg',
    description: 'Camisa tailandesa do Fluminense temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '87',
    name: 'Camisa Fluminense Patch 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/FluminensePatch24-25.jpg',
    description: 'Camisa tailandesa do Fluminense com patch temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '88',
    name: 'Camisa França 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Franca24-25.jpg',
    description: 'Camisa tailandesa da Seleção da França temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '89',
    name: 'Camisa Internacional 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Inter24-25.jpg',
    description: 'Camisa tailandesa do Internacional temporada 2024/25.',
    sizes: ['G'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '90',
    name: 'Camisa Manchester City 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/ManCity24-25.jpg',
    description: 'Camisa tailandesa do Manchester City 2ª versão temporada 2024/25.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '91',
    name: 'Camisa Real Madrid 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/RealMadrid24-25.jpg',
    description: 'Camisa tailandesa do Real Madrid temporada 2024/25.',
    sizes: ['5XL'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '92',
    name: 'Camisa Real Madrid Treino 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/RealMadridTreino24-25.jpg',
    description: 'Camisa tailandesa de treino do Real Madrid temporada 2024/25.',
    sizes: ['G', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '93',
    name: 'Camisa Real Madrid Treino 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/RealMadridTreinio2-24-25.jpg',
    description: 'Camisa tailandesa de treino do Real Madrid 2ª versão temporada 2024/25.',
    sizes: ['M', 'G', '2XL'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '94',
    name: 'Camisa Sport 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Sport24-25.jpg',
    description: 'Camisa tailandesa do Sport temporada 2024/25.',
    sizes: ['G', 'GG', 'XL'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '95',
    name: 'Camisa Vasco 2ª Versão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Vasco2-2425.jpg',
    description: 'Camisa tailandesa do Vasco 2ª versão temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '96',
    name: 'Camisa Vasco 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/Vasco24-25.jpg',
    description: 'Camisa tailandesa do Vasco temporada 2024/25.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '97',
    name: 'Camisa Vasco Comemorativa 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/VascoComemorativa.jpg',
    description: 'Camisa tailandesa comemorativa do Vasco temporada 2024/25.',
    sizes: ['M'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '98',
    name: 'Camisa Vasco Comissão 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/Camisas24-25/VascoComissao24-25.jpg',
    description: 'Camisa tailandesa de comissão do Vasco temporada 2024/25.',
    sizes: ['GG'],
    category: 'futebol',
    subcategory: 'temporada-24-25',
    featured: true,
    priceRanges: [
      { min: 1, price: 100.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 90.00 }, // 2-4 CAMISAS
      { min: 5, price: 85.00 } // 5+ CAMISAS
    ]
  }
];
