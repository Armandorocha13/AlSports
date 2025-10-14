// ========================================================================
// PRODUTOS NBA
// ========================================================================

export const nbaProducts = [
  {
    id: '3',
    name: 'Camisa Lakers LeBron James',
    price: 120.00, // Preço de varejo
    wholesalePrice: 120.00,
    image: '/images/NBA/CamisasNBA/(G).jpg',
    description: 'Camisa tailandesa do Lakers com LeBron James, versão jogador.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'nba',
    subcategory: 'camisas-nba',
    featured: true,
    priceRanges: [
      { min: 1, price: 120.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 110.00 }, // 2-4 CAMISAS
      { min: 5, price: 100.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '4',
    name: 'Camisa Warriors Stephen Curry',
    price: 120.00, // Preço de varejo
    wholesalePrice: 120.00,
    image: '/images/NBA/CamisasNBA/(M).jpg',
    description: 'Camisa tailandesa do Warriors com Stephen Curry, versão jogador.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'nba',
    subcategory: 'camisas-nba',
    featured: true,
    priceRanges: [
      { min: 1, price: 120.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 110.00 }, // 2-4 CAMISAS
      { min: 5, price: 100.00 } // 5+ CAMISAS
    ]
  }
];
