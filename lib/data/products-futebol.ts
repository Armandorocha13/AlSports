// ========================================================================
// PRODUTOS DE FUTEBOL
// ========================================================================

export const futebolProducts = [
  {
    id: '1',
    name: 'Camisa Flamengo 2024/25 - Versão Jogador',
    price: 100.00, // Preço de varejo
    wholesalePrice: 100.00,
    image: '/images/Futebol/Camisas24-25/(G).jpg',
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
    name: 'Camisa Retrô Flamengo 1995',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/2021- (GG).jpg',
    description: 'Camisa retrô do Flamengo de 1995, relembrando os tempos dourados do clube.',
    sizes: ['P', 'M', 'G', 'GG'],
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
    name: 'Camisa Corinthians 2024/25',
    price: 100.00, // Preço de varejo
    wholesalePrice: 100.00,
    image: '/images/Futebol/Camisas24-25/(M).jpg',
    description: 'Camisa tailandesa do Corinthians temporada 2024/25, versão jogador.',
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
    name: 'Camisa São Paulo 2024/25',
    price: 100.00, // Preço de varejo
    wholesalePrice: 100.00,
    image: '/images/Futebol/Camisas24-25/(GG).jpg',
    description: 'Camisa tailandesa do São Paulo temporada 2024/25, versão jogador.',
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
    name: 'Camisa Manchester City 2024/25',
    price: 100.00, // Preço de varejo
    wholesalePrice: 100.00,
    image: '/images/Futebol/Camisas24-25/CITY- G.jpg',
    description: 'Camisa tailandesa do Manchester City temporada 2024/25, versão jogador.',
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
    id: '24',
    name: 'Camisa Feminina Flamengo 2024/25',
    price: 95.00, // Preço de varejo
    wholesalePrice: 95.00,
    image: '/images/Futebol/CamisasFutebolFeminina/(G).jpg',
    description: 'Camisa tailandesa feminina do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-feminina',
    featured: true,
    priceRanges: [
      { min: 1, price: 95.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 85.00 }, // 2-4 CAMISAS
      { min: 5, price: 80.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '25',
    name: 'Regata Flamengo 2024/25',
    price: 80.00, // Preço de varejo
    wholesalePrice: 80.00,
    image: '/images/Futebol/CamisasFutebolRegatas/(G)_.jpg',
    description: 'Regata tailandesa do Flamengo temporada 2024/25.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'regatas',
    featured: true,
    priceRanges: [
      { min: 1, price: 80.00 }, // 1 REGATA (VAREJO)
      { min: 2, max: 4, price: 75.00 }, // 2-4 REGATAS
      { min: 5, price: 70.00 } // 5+ REGATAS
    ]
  },
  {
    id: '26',
    name: 'Camisa Retrô Parma 1995',
    price: 130.00, // Preço de varejo
    wholesalePrice: 130.00,
    image: '/images/Futebol/CamisasFutebolRetro/1995- PARMA- GG.png',
    description: 'Camisa retrô do Parma de 1995, relembrando os tempos dourados do clube italiano.',
    sizes: ['P', 'M', 'G', 'GG'],
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
    image: '/images/Futebol/CamisasFutebolRetro/1998 PSG - GG.png',
    description: 'Camisa retrô do PSG de 1998, relembrando os tempos dourados do clube francês.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'retro',
    featured: true,
    priceRanges: [
      { min: 1, price: 130.00 }, // 1 CAMISA
      { min: 2, max: 4, price: 120.00 }, // 2-4 CAMISAS
      { min: 5, price: 110.00 } // 5+ CAMISAS
    ]
  }
];
