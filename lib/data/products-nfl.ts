// ========================================================================
// PRODUTOS NFL
// ========================================================================

export const nflProducts = [
  {
    id: '9',
    name: 'Camisa NFL MAHOMES',
    price: 120.00, // Preço de varejo
    wholesalePrice: 120.00,
    image: '/images/NFL/CamisasNFL/(G).jpg',
    description: 'Camisa tailandesa do Kansas City Chiefs com Patrick Mahomes.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'nfl',
    subcategory: 'camisas-nfl',
    featured: true,
    priceRanges: [
      { min: 1, price: 120.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 110.00 }, // 2-4 CAMISAS
      { min: 5, price: 100.00 } // 5+ CAMISAS
    ]
  },
  {
    id: '11',
    name: 'Camisa NFL KELCE',
    price: 120.00, // Preço de varejo
    wholesalePrice: 120.00,
    image: '/images/NFL/CamisasNFL/(M).jpg',
    description: 'Camisa tailandesa do Kansas City Chiefs com Travis Kelce.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'nfl',
    subcategory: 'camisas-nfl',
    featured: true,
    priceRanges: [
      { min: 1, price: 120.00 }, // 1 CAMISA (VAREJO)
      { min: 2, max: 4, price: 110.00 }, // 2-4 CAMISAS
      { min: 5, price: 100.00 } // 5+ CAMISAS
    ]
  }
];
