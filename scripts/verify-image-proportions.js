#!/usr/bin/env node

/**
 * Script para verificar as melhorias nas proporções das imagens
 */

const fs = require('fs');
const path = require('path');

/**
 * Verifica melhorias no CategoryCard
 */
function verifyCategoryCard() {
  console.log('🔍 Verificando melhorias no CategoryCard...');
  
  const cardFile = 'components/CategoryCard.tsx';
  if (!fs.existsSync(cardFile)) {
    console.log('❌ Arquivo CategoryCard não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(cardFile, 'utf8');
  
  const improvements = {
    'Altura aumentada': content.includes('h-96 relative'),
    'Padding reduzido': content.includes('p-2'),
    'Background cinza': content.includes('bg-gray-100'),
    'Object-contain': content.includes('object-contain')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  return Object.values(improvements).every(Boolean);
}

/**
 * Verifica melhorias no ProductCard
 */
function verifyProductCard() {
  console.log('\n🔍 Verificando melhorias no ProductCard...');
  
  const cardFile = 'components/ProductCard.tsx';
  if (!fs.existsSync(cardFile)) {
    console.log('❌ Arquivo ProductCard não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(cardFile, 'utf8');
  
  const improvements = {
    'Altura aumentada': content.includes('h-96'),
    'Padding reduzido': content.includes('p-2'),
    'Background cinza': content.includes('bg-gray-100'),
    'Object-contain': content.includes('object-contain')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  return Object.values(improvements).every(Boolean);
}

/**
 * Verifica melhorias na página de categoria
 */
function verifyCategoryPage() {
  console.log('\n🔍 Verificando melhorias na página de categoria...');
  
  const pageFile = 'app/categoria/[slug]/page.tsx';
  if (!fs.existsSync(pageFile)) {
    console.log('❌ Arquivo da página de categoria não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(pageFile, 'utf8');
  
  const improvements = {
    'Altura aumentada': content.includes('h-80 relative'),
    'Padding reduzido': content.includes('p-2'),
    'Background cinza': content.includes('bg-gray-100'),
    'Object-contain': content.includes('object-contain')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  return Object.values(improvements).every(Boolean);
}

/**
 * Verifica melhorias na página do produto
 */
function verifyProductPage() {
  console.log('\n🔍 Verificando melhorias na página do produto...');
  
  const pageFile = 'app/produto/[id]/page.tsx';
  if (!fs.existsSync(pageFile)) {
    console.log('❌ Arquivo da página do produto não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(pageFile, 'utf8');
  
  const improvements = {
    'Altura aumentada': content.includes('h-[600px]'),
    'Padding adicionado': content.includes('p-4'),
    'Background cinza': content.includes('bg-gray-100'),
    'Object-contain': content.includes('object-contain')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  return Object.values(improvements).every(Boolean);
}

/**
 * Verifica melhorias no ProductViewModal
 */
function verifyProductModal() {
  console.log('\n🔍 Verificando melhorias no ProductViewModal...');
  
  const modalFile = 'components/ProductViewModal.tsx';
  if (!fs.existsSync(modalFile)) {
    console.log('❌ Arquivo ProductViewModal não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(modalFile, 'utf8');
  
  const improvements = {
    'Padding adicionado': content.includes('p-4'),
    'Background cinza': content.includes('bg-gray-100'),
    'Object-contain': content.includes('object-contain')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  return Object.values(improvements).every(Boolean);
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Verificando melhorias nas proporções das imagens...');
  console.log('-'.repeat(60));

  // Verificar todos os componentes
  const categoryCardOk = verifyCategoryCard();
  const productCardOk = verifyProductCard();
  const categoryPageOk = verifyCategoryPage();
  const productPageOk = verifyProductPage();
  const productModalOk = verifyProductModal();

  console.log('\n' + '-'.repeat(60));
  console.log('🔍 Resultado da verificação:');
  console.log(`📁 CategoryCard: ${categoryCardOk ? 'Melhorado' : 'Parcial'}`);
  console.log(`🛍️  ProductCard: ${productCardOk ? 'Melhorado' : 'Parcial'}`);
  console.log(`📂 Página de categoria: ${categoryPageOk ? 'Melhorada' : 'Parcial'}`);
  console.log(`📄 Página do produto: ${productPageOk ? 'Melhorada' : 'Parcial'}`);
  console.log(`🔍 ProductModal: ${productModalOk ? 'Melhorado' : 'Parcial'}`);
  
  const allImproved = categoryCardOk && productCardOk && categoryPageOk && productPageOk && productModalOk;
  
  if (allImproved) {
    console.log('\n🎉 Todas as proporções das imagens foram melhoradas!');
    console.log('✅ Imagens maiores e com melhor exibição');
    console.log('✅ Padding reduzido para maximizar espaço');
    console.log('✅ Background cinza para melhor contraste');
  } else {
    console.log('\n⚠️  Algumas melhorias ainda precisam ser aplicadas');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  verifyCategoryCard, 
  verifyProductCard, 
  verifyCategoryPage, 
  verifyProductPage, 
  verifyProductModal 
};
