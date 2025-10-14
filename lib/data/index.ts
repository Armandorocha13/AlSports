// ========================================================================
// ARQUIVO PRINCIPAL DE DADOS - IMPORTA TODAS AS CATEGORIAS E PRODUTOS
// ========================================================================

// Importar categorias
export { categories } from './categories';

// Importar produtos por categoria
export { futebolProducts } from './products-futebol';
export { roupasTreinoProducts } from './products-roupas-treino';
export { nbaProducts } from './products-nba';
export { nflProducts } from './products-nfl';
export { infantisProducts } from './products-infantis';
export { acessoriosProducts } from './products-acessorios';

// Combinar todos os produtos em um array único
import { futebolProducts } from './products-futebol';
import { roupasTreinoProducts } from './products-roupas-treino';
import { nbaProducts } from './products-nba';
import { nflProducts } from './products-nfl';
import { infantisProducts } from './products-infantis';
import { acessoriosProducts } from './products-acessorios';

export const allProducts = [
  ...futebolProducts,
  ...roupasTreinoProducts,
  ...nbaProducts,
  ...nflProducts,
  ...infantisProducts,
  ...acessoriosProducts
];

// Função para buscar produtos por categoria
export const getProductsByCategory = (category: string) => {
  return allProducts.filter(product => product.category === category);
};

// Função para buscar produtos em destaque
export const getFeaturedProducts = () => {
  return allProducts.filter(product => product.featured);
};

// Função para buscar produto por ID
export const getProductById = (id: string) => {
  return allProducts.find(product => product.id === id);
};
