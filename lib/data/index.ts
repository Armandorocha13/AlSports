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

// Função para buscar produtos em destaque limitados a 2 por subcategoria e máximo 8 produtos
export const getFeaturedProductsLimited = () => {
  const featuredProducts = allProducts.filter(product => product.featured);
  
  // Agrupar por subcategoria
  const productsBySubcategory: { [key: string]: any[] } = {};
  
  featuredProducts.forEach(product => {
    const subcategory = product.subcategory;
    if (!productsBySubcategory[subcategory]) {
      productsBySubcategory[subcategory] = [];
    }
    productsBySubcategory[subcategory].push(product);
  });
  
  // Limitar a 2 produtos por subcategoria
  const limitedProducts: any[] = [];
  Object.values(productsBySubcategory).forEach(subcategoryProducts => {
    limitedProducts.push(...subcategoryProducts.slice(0, 2));
  });
  
  // Limitar o total a 8 produtos
  return limitedProducts.slice(0, 8);
};

// Função para buscar produto por ID
export const getProductById = (id: string) => {
  return allProducts.find(product => product.id === id);
};
