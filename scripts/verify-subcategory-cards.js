#!/usr/bin/env node

/**
 * Script para verificar as melhorias nos cards das subcategorias
 */

const fs = require('fs');
const path = require('path');

const categoryPageFile = 'app/categoria/[slug]/page.tsx';
const subcategoryPageFile = 'app/categoria/[slug]/[subcategory]/page.tsx';

/**
 * Verifica melhorias na página de categoria
 */
function verifyCategoryPage() {
  console.log('🔍 Verificando melhorias na página de categoria...');
  
  if (!fs.existsSync(categoryPageFile)) {
    console.log('❌ Arquivo não encontrado: ' + categoryPageFile);
    return false;
  }
  
  const content = fs.readFileSync(categoryPageFile, 'utf8');
  
  const improvements = {
    'Altura aumentada': content.includes('h-64 relative'),
    'Object-contain': content.includes('object-contain'),
    'Background cinza': content.includes('bg-gray-100'),
    'Padding nas imagens': content.includes('p-4'),
    'Gap aumentado': content.includes('gap-8'),
    'Bordas nos cards': content.includes('border border-gray-700'),
    'Padding aumentado': content.includes('p-8 text-center')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  const allApplied = Object.values(improvements).every(Boolean);
  return allApplied;
}

/**
 * Verifica melhorias na página de subcategoria
 */
function verifySubcategoryPage() {
  console.log('\n🔍 Verificando melhorias na página de subcategoria...');
  
  if (!fs.existsSync(subcategoryPageFile)) {
    console.log('❌ Arquivo não encontrado: ' + subcategoryPageFile);
    return false;
  }
  
  const content = fs.readFileSync(subcategoryPageFile, 'utf8');
  
  const improvements = {
    'Gap aumentado': content.includes('gap-6'),
    'Padding aumentado': content.includes('p-6'),
    'Hover scale': content.includes('hover:scale-105'),
    'Ícones maiores': content.includes('w-16 h-16'),
    'Margin bottom aumentada': content.includes('mb-3')
  };
  
  console.log('📋 Melhorias aplicadas:');
  for (const [improvement, applied] of Object.entries(improvements)) {
    console.log(`  ${applied ? '✅' : '❌'} ${improvement}`);
  }
  
  const allApplied = Object.values(improvements).every(Boolean);
  return allApplied;
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Verificando melhorias nos cards das subcategorias...');
  console.log('-'.repeat(60));

  // Verificar página de categoria
  const categoryImproved = verifyCategoryPage();
  
  // Verificar página de subcategoria
  const subcategoryImproved = verifySubcategoryPage();

  console.log('\n' + '-'.repeat(60));
  console.log('🔍 Resultado da verificação:');
  console.log(`📁 Página de categoria: ${categoryImproved ? 'Melhorada' : 'Parcial'}`);
  console.log(`📁 Página de subcategoria: ${subcategoryImproved ? 'Melhorada' : 'Parcial'}`);
  
  const allImproved = categoryImproved && subcategoryImproved;
  
  if (allImproved) {
    console.log('\n🎉 Todos os cards das subcategorias foram melhorados!');
    console.log('✅ Cards maiores e com melhor exibição de imagens');
    console.log('✅ Imagens sem cortes e com padding adequado');
    console.log('✅ Espaçamento e bordas melhorados');
  } else {
    console.log('\n⚠️  Algumas melhorias ainda precisam ser aplicadas');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  verifyCategoryPage, 
  verifySubcategoryPage 
};
