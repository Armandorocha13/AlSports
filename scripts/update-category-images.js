#!/usr/bin/env node

/**
 * Script para atualizar imagens das categorias e subcategorias
 */

const fs = require('fs');
const path = require('path');

const categoriesFile = 'lib/data/categories.ts';
const imagesBaseDir = 'public/images';

/**
 * Encontra a melhor imagem para uma categoria
 */
function findBestImage(categoryName, subcategoryName = null) {
  console.log(`🔍 Procurando imagem para: ${categoryName}${subcategoryName ? ` - ${subcategoryName}` : ''}`);
  
  let searchDir = imagesBaseDir;
  
  // Determinar diretório baseado na categoria
  switch (categoryName.toLowerCase()) {
    case 'futebol':
      searchDir = path.join(imagesBaseDir, 'Futebol');
      break;
    case 'infantil':
      searchDir = path.join(imagesBaseDir, 'ConjuntosInfantis');
      break;
    case 'treino':
      searchDir = path.join(imagesBaseDir, 'ConjuntoTreino');
      break;
    case 'nba':
      searchDir = path.join(imagesBaseDir, 'NBA');
      break;
    case 'nfl':
      searchDir = path.join(imagesBaseDir, 'NFL');
      break;
    case 'acessorios':
      searchDir = path.join(imagesBaseDir, 'Acessorios');
      break;
  }
  
  if (!fs.existsSync(searchDir)) {
    console.log(`❌ Diretório não encontrado: ${searchDir}`);
    return null;
  }
  
  // Procurar por imagens
  const images = findImagesInDirectory(searchDir);
  
  if (images.length === 0) {
    console.log(`❌ Nenhuma imagem encontrada em: ${searchDir}`);
    return null;
  }
  
  // Selecionar a melhor imagem
  let bestImage = images[0];
  
  // Priorizar imagens com nomes específicos
  const priorityNames = [
    'flamengo', 'brasil', 'principal', 'destaque', 'featured'
  ];
  
  for (const priorityName of priorityNames) {
    const found = images.find(img => 
      img.toLowerCase().includes(priorityName)
    );
    if (found) {
      bestImage = found;
      break;
    }
  }
  
  const relativePath = '/' + path.relative('public', bestImage).replace(/\\/g, '/');
  console.log(`✅ Imagem selecionada: ${relativePath}`);
  
  return relativePath;
}

/**
 * Encontra todas as imagens em um diretório
 */
function findImagesInDirectory(dir) {
  let images = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Procurar em subdiretórios
        images = images.concat(findImagesInDirectory(itemPath));
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          images.push(itemPath);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️  Erro ao ler diretório ${dir}: ${error.message}`);
  }
  
  return images;
}

/**
 * Atualiza as imagens das categorias
 */
function updateCategoryImages() {
  console.log('🔄 Atualizando imagens das categorias...');
  
  if (!fs.existsSync(categoriesFile)) {
    console.log('❌ Arquivo de categorias não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(categoriesFile, 'utf8');
  let updatedContent = content;
  let updatedCount = 0;
  
  // Fazer backup
  fs.writeFileSync(`${categoriesFile}.backup_images`, content, 'utf8');
  console.log(`📦 Backup criado: ${categoriesFile}.backup_images`);
  
  // Atualizar imagem principal da categoria Futebol
  const newFutebolImage = findBestImage('futebol');
  if (newFutebolImage) {
    const oldPattern = /image: '\/images\/Futebol\/[^']+'/;
    const newImage = `image: '${newFutebolImage}'`;
    updatedContent = updatedContent.replace(oldPattern, newImage);
    console.log(`✅ Imagem principal do Futebol atualizada`);
    updatedCount++;
  }
  
  // Atualizar subcategorias do Futebol
  const subcategoryUpdates = [
    { name: 'versao-jogador', searchName: 'CamisaJogador' },
    { name: 'versao-feminina', searchName: 'CamisasFutebolFeminina' },
    { name: 'regatas', searchName: 'CamisasFutebolRegatas' },
    { name: 'retro', searchName: 'CamisasFutebolRetro' },
    { name: 'shorts-masculino', searchName: 'ShortsFutebolMasculino' },
    { name: 'shorts-feminino', searchName: 'ShortFutebolFeminino' }
  ];
  
  for (const subcat of subcategoryUpdates) {
    const newImage = findBestImage('futebol', subcat.searchName);
    if (newImage) {
      const oldPattern = new RegExp(`id: '${subcat.name}'[\\s\\S]*?image: '[^']+'`, 'g');
      const newPattern = `id: '${subcat.name}'` + 
        content.match(new RegExp(`id: '${subcat.name}'([\\s\\S]*?)image: '[^']+'`))?.[1] + 
        `image: '${newImage}'`;
      updatedContent = updatedContent.replace(oldPattern, newPattern);
      console.log(`✅ Subcategoria ${subcat.name} atualizada`);
      updatedCount++;
    }
  }
  
  if (updatedCount > 0) {
    fs.writeFileSync(categoriesFile, updatedContent, 'utf8');
    console.log(`📝 Arquivo atualizado com ${updatedCount} mudanças`);
  } else {
    console.log('ℹ️  Nenhuma atualização necessária');
  }
  
  return updatedCount > 0;
}

/**
 * Atualiza o componente CategoryCard para melhor exibição
 */
function updateCategoryCard() {
  console.log('\n🔄 Atualizando componente CategoryCard...');
  
  const cardFile = 'components/CategoryCard.tsx';
  
  if (!fs.existsSync(cardFile)) {
    console.log('❌ Arquivo CategoryCard não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(cardFile, 'utf8');
  
  // Fazer backup
  fs.writeFileSync(`${cardFile}.backup_images`, content, 'utf8');
  console.log(`📦 Backup criado: ${cardFile}.backup_images`);
  
  let updatedContent = content;
  
  // Aumentar altura do card para não cortar imagens
  updatedContent = updatedContent.replace(
    'className="h-64 relative"',
    'className="h-80 relative"'
  );
  
  // Melhorar o object-fit para mostrar mais da imagem
  updatedContent = updatedContent.replace(
    'className="object-cover group-hover:scale-105 transition-transform duration-300"',
    'className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-100"'
  );
  
  // Adicionar padding para não cortar as imagens
  updatedContent = updatedContent.replace(
    'className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-100"',
    'className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-100 p-2"'
  );
  
  fs.writeFileSync(cardFile, updatedContent, 'utf8');
  console.log('✅ CategoryCard atualizado para melhor exibição de imagens');
  
  return true;
}

/**
 * Função principal
 */
function main() {
  console.log('🔄 Atualizando imagens das categorias...');
  console.log(`📁 Base: ${imagesBaseDir}`);
  console.log(`📄 Arquivo: ${categoriesFile}`);
  console.log('-'.repeat(60));

  // Atualizar imagens das categorias
  const categoriesUpdated = updateCategoryImages();
  
  // Atualizar componente CategoryCard
  const cardUpdated = updateCategoryCard();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Atualização de imagens concluída!');
  console.log(`📁 Categorias: ${categoriesUpdated ? 'Atualizadas' : 'Sem mudanças'}`);
  console.log(`🎨 Cards: ${cardUpdated ? 'Atualizados' : 'Sem mudanças'}`);
  
  if (categoriesUpdated || cardUpdated) {
    console.log('🎉 Imagens das categorias foram atualizadas!');
    console.log('📋 As imagens agora são exibidas sem cortes');
  } else {
    console.log('ℹ️  Nenhuma atualização foi necessária');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  findBestImage, 
  updateCategoryImages, 
  updateCategoryCard 
};
