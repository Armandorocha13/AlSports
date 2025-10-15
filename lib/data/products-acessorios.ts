// ========================================================================
// PRODUTOS ACESSÓRIOS
// ========================================================================

export const acessoriosProducts = [
  {
    id: '12',
    name: 'Meia Flamengo',
    price: 25.00, // Preço de varejo
    wholesalePrice: 25.00,
    image: '/images/Acessorios/Meias/MeiaFlamengo.jpg',
    description: 'Meia tailandesa do Flamengo com tecnologia de alta performance.',
    sizes: ['P', 'M', 'G'],
    category: 'acessorios',
    subcategory: 'meias',
    featured: true,
    priceRanges: [
      { min: 1, price: 25.00 }, // 1 MEIA
      { min: 2, max: 4, price: 22.00 }, // 2-4 MEIAS
      { min: 5, price: 20.00 } // 5+ MEIAS
    ]
  },
  {
    id: '13',
    name: 'Meia Casual',
    price: 25.00, // Preço de varejo
    wholesalePrice: 25.00,
    image: '/images/Acessorios/Meias/MeiaCasual.jpg',
    description: 'Meia tailandesa casual com tecnologia de alta performance.',
    sizes: ['P', 'M', 'G'],
    category: 'acessorios',
    subcategory: 'meias',
    featured: true,
    priceRanges: [
      { min: 1, price: 25.00 }, // 1 MEIA
      { min: 2, max: 4, price: 22.00 }, // 2-4 MEIAS
      { min: 5, price: 20.00 } // 5+ MEIAS
    ]
  },
  {
    id: '16',
    name: 'Boné Flamengo',
    price: 45.00, // Preço de varejo
    wholesalePrice: 45.00,
    image: '/images/Acessorios/BonesTime/BoneFlamengo.png',
    description: 'Boné tailandês do Flamengo com ajuste regulável.',
    sizes: ['Único'],
    category: 'acessorios',
    subcategory: 'bones',
    featured: true,
    priceRanges: [
      { min: 1, price: 45.00 }, // 1 BONÉ
      { min: 2, max: 4, price: 40.00 }, // 2-4 BONÉS
      { min: 5, price: 35.00 } // 5+ BONÉS
    ]
  },
  {
    id: '17',
    name: 'Boné Casual',
    price: 40.00, // Preço de varejo
    wholesalePrice: 40.00,
    image: '/images/Acessorios/BoneCasual/BoneCasual.jpg',
    description: 'Boné tailandês casual com design moderno.',
    sizes: ['Único'],
    category: 'acessorios',
    subcategory: 'bones',
    featured: true,
    priceRanges: [
      { min: 1, price: 40.00 }, // 1 BONÉ
      { min: 2, max: 4, price: 35.00 }, // 2-4 BONÉS
      { min: 5, price: 30.00 } // 5+ BONÉS
    ]
  }
];
