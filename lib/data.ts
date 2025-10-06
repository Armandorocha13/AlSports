export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
  subcategory: string;
  featured?: boolean;
  onSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'futebol',
    name: 'FUTEBOL',
    slug: 'futebol',
    subcategories: [
      { id: 'lancamento-25-26', name: 'Lançamento (25/26)', slug: 'lancamento-25-26', image: '/images/futebol/lancamento.jpg' },
      { id: 'temporada-24-25', name: 'Temporada 24/25', slug: 'temporada-24-25', image: '/images/futebol/temporada-24-25.jpg' },
      { id: 'temporada-23-24', name: 'Temporada 23/24', slug: 'temporada-23-24', image: '/images/futebol/temporada-23-24.jpg' },
      { id: 'versao-jogador', name: 'Versão Jogador', slug: 'versao-jogador', image: '/images/futebol/versao-jogador.jpg' },
      { id: 'retro', name: 'Retrô', slug: 'retro', image: '/images/futebol/retro.jpg' },
      { id: 'versao-feminina', name: 'Versão Feminina', slug: 'versao-feminina', image: '/images/futebol/versao-feminina.jpg' },
      { id: 'regatas', name: 'Regatas', slug: 'regatas', image: '/images/futebol/regatas.jpg' },
      { id: 'promocao', name: 'Promoção', slug: 'promocao', image: '/images/futebol/promocao.jpg' },
      { id: 'pedido-extra', name: 'Pedido Extra (R$1,00)', slug: 'pedido-extra', image: '/images/futebol/pedido-extra.jpg' }
    ]
  },
  {
    id: 'roupas-treino',
    name: 'ROUPAS DE TREINO',
    slug: 'roupas-treino',
    subcategories: [
      { id: 'agasalho-completo', name: 'Agasalho Completo', slug: 'agasalho-completo', image: '/images/treino/agasalho-completo.jpg' },
      { id: 'calca', name: 'Calça', slug: 'calca', image: '/images/treino/calca.jpg' },
      { id: 'casaco', name: 'Casaco', slug: 'casaco', image: '/images/treino/casaco.jpg' },
      { id: 'camisa-short', name: 'Camisa + Short', slug: 'camisa-short', image: '/images/treino/camisa-short.jpg' },
      { id: 'regata-short', name: 'Regata + Short', slug: 'regata-short', image: '/images/treino/regata-short.jpg' },
      { id: 'corta-vento', name: 'Corta Vento', slug: 'corta-vento', image: '/images/treino/corta-vento.jpg' },
      { id: 'promocao', name: 'Promoção', slug: 'promocao', image: '/images/treino/promocao.jpg' },
      { id: 'conjunto-time-chines', name: 'Conjunto Time Chinês (Kit Europeu/Brasileiro)', slug: 'conjunto-time-chines', image: '/images/treino/conjunto-time-chines.jpg' }
    ]
  },
  {
    id: 'nba',
    name: 'NBA',
    slug: 'nba',
    subcategories: [
      { id: 'nba-silk', name: 'NBA Silk', slug: 'nba-silk', image: '/images/nba/nba-silk.jpg' },
      { id: 'nba-bordada', name: 'NBA Bordada', slug: 'nba-bordada', image: '/images/nba/nba-bordada.jpg' }
    ]
  },
  {
    id: 'conjuntos-infantis',
    name: 'CONJUNTOS INFANTIS',
    slug: 'conjuntos-infantis',
    subcategories: [
      { id: 'kit-infantil-25-26', name: 'Kit Infantil 25/26', slug: 'kit-infantil-25-26', image: '/images/infantil/kit-25-26.jpg' },
      { id: 'kit-infantil-24-25', name: 'Kit Infantil 24/25', slug: 'kit-infantil-24-25', image: '/images/infantil/kit-24-25.jpg' },
      { id: 'kit-infantil-retro', name: 'Kit Infantil Retrô', slug: 'kit-infantil-retro', image: '/images/infantil/kit-retro.jpg' },
      { id: 'kit-infantil-23-24', name: 'Kit Infantil 23/24', slug: 'kit-infantil-23-24', image: '/images/infantil/kit-23-24.jpg' },
      { id: 'promocao', name: 'Promoção', slug: 'promocao', image: '/images/infantil/promocao.jpg' }
    ]
  },
  {
    id: 'acessorios',
    name: 'ACESSÓRIOS',
    slug: 'acessorios',
    subcategories: [
      { id: 'nfl-camisas', name: 'NFL (Camisas)', slug: 'nfl-camisas', image: '/images/acessorios/nfl-camisas.jpg' },
      { id: 'bones-times', name: 'Bonés Times', slug: 'bones-times', image: '/images/acessorios/bones-times.jpg' },
      { id: 'bones-casuais', name: 'Bonés Casuais', slug: 'bones-casuais', image: '/images/acessorios/bones-casuais.jpg' },
      { id: 'meias-times', name: 'Meias Times', slug: 'meias-times', image: '/images/acessorios/meias-times.jpg' },
      { id: 'meias-casuais', name: 'Meias Casuais', slug: 'meias-casuais', image: '/images/acessorios/meias-casuais.jpg' }
    ]
  },
  {
    id: 'bermudas-shorts',
    name: 'BERMUDAS & SHORTS',
    slug: 'bermudas-shorts',
    subcategories: [
      { id: 'short-masculino', name: 'Short Masculino', slug: 'short-masculino', image: '/images/shorts/short-masculino.jpg' },
      { id: 'short-feminino', name: 'Short Feminino', slug: 'short-feminino', image: '/images/shorts/short-feminino.jpg' }
    ]
  }
];

// Dados de exemplo para produtos
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Camisa Flamengo 2024/25 - Versão Jogador',
    price: 299.90,
    wholesalePrice: 89.90,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop',
    description: 'Camisa oficial do Flamengo temporada 2024/25, versão jogador com tecnologia de alta performance.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'futebol',
    subcategory: 'versao-jogador',
    featured: true
  },
  {
    id: '2',
    name: 'Conjunto Nike Dri-FIT Training',
    price: 199.90,
    wholesalePrice: 59.90,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    description: 'Conjunto completo para treino com tecnologia Dri-FIT que mantém o corpo seco durante o exercício.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'roupas-treino',
    subcategory: 'camisa-short',
    featured: true
  },
  {
    id: '3',
    name: 'Camisa Lakers LeBron James',
    price: 249.90,
    wholesalePrice: 79.90,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    description: 'Camisa oficial do Los Angeles Lakers com o número 23 do LeBron James.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'nba',
    subcategory: 'nba-silk',
    featured: true
  },
  {
    id: '4',
    name: 'Kit Infantil Barcelona 2024/25',
    price: 149.90,
    wholesalePrice: 49.90,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
    description: 'Kit completo infantil do Barcelona temporada 2024/25, ideal para os pequenos torcedores.',
    sizes: ['4', '6', '8', '10', '12'],
    category: 'conjuntos-infantis',
    subcategory: 'kit-infantil-24-25',
    featured: true
  },
  {
    id: '5',
    name: 'Boné New Era Yankees',
    price: 89.90,
    wholesalePrice: 29.90,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    description: 'Boné oficial New Era do New York Yankees, modelo 59FIFTY.',
    sizes: ['Único'],
    category: 'acessorios',
    subcategory: 'bones-times',
    featured: true
  },
  {
    id: '6',
    name: 'Short Nike Dri-FIT Masculino',
    price: 79.90,
    wholesalePrice: 24.90,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    description: 'Short masculino Nike com tecnologia Dri-FIT, ideal para treinos e atividades físicas.',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'bermudas-shorts',
    subcategory: 'short-masculino',
    featured: true
  }
];
