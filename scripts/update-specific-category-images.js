#!/usr/bin/env node

/**
 * Script para atualizar imagens específicas das categorias
 */

const fs = require('fs');
const path = require('path');

const categoriesFile = 'lib/data/categories.ts';

/**
 * Atualiza imagens específicas das categorias
 */
function updateSpecificImages() {
  console.log('🔄 Atualizando imagens específicas das categorias...');
  
  if (!fs.existsSync(categoriesFile)) {
    console.log('❌ Arquivo de categorias não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(categoriesFile, 'utf8');
  let updatedContent = content;
  let updatedCount = 0;
  
  // Fazer backup
  fs.writeFileSync(`${categoriesFile}.backup_specific`, content, 'utf8');
  console.log(`📦 Backup criado: ${categoriesFile}.backup_specific`);
  
  // Mapeamento de imagens específicas
  const imageMappings = {
    // Categoria principal Futebol
    'futebol': '/images/Futebol/Camisas24-25/Flamengo24-25.jpg',
    
    // Subcategorias do Futebol
    'versao-jogador': '/images/Futebol/CamisaJogador/FlamengoJogador.png',
    'versao-feminina': '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino1.jpg',
    'regatas': '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png',
    'retro': '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png',
    'shorts-masculino': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png',
    'shorts-feminino': '/images/Futebol/ShortFutebolFeminino/ShortFemininoFlamengo.jpg',
    
    // Temporadas
    'temporada-25-26': '/images/Futebol/Camisas25-26/Flamengo25-26.jpg',
    'temporada-24-25': '/images/Futebol/Camisas24-25/Flamengo24-25.jpg',
    'temporada-23-24': '/images/Futebol/Camisas23-24/Flamengo23-24.jpg',
    
    // Outras categorias
    'infantil': '/images/ConjuntosInfantis/InfantilFlamengo/InfantilFlamengo.jpg',
    'treino': '/images/ConjuntoTreino/Regata-shorts/RegataFlamengoShorts.png',
    'nba': '/images/NBA/bullsJordan.jpg',
    'nfl': '/images/NFL/kelce.jpg',
    'acessorios': '/images/Acessorios/BoneCasual/BoneCasual.jpg'
  };
  
  // Atualizar imagem principal da categoria Futebol
  if (imageMappings.futebol) {
    const oldPattern = /image: '\/images\/Futebol\/[^']+'/;
    const newImage = `image: '${imageMappings.futebol}'`;
    updatedContent = updatedContent.replace(oldPattern, newImage);
    console.log(`✅ Imagem principal do Futebol: ${imageMappings.futebol}`);
    updatedCount++;
  }
  
  // Atualizar subcategorias
  for (const [subcatId, imagePath] of Object.entries(imageMappings)) {
    if (subcatId === 'futebol') continue; // Já processado acima
    
    const oldPattern = new RegExp(`id: '${subcatId}'[\\s\\S]*?image: '[^']+'`, 'g');
    const match = updatedContent.match(new RegExp(`id: '${subcatId}'([\\s\\S]*?)image: '[^']+'`));
    
    if (match) {
      const newPattern = `id: '${subcatId}'${match[1]}image: '${imagePath}'`;
      updatedContent = updatedContent.replace(oldPattern, newPattern);
      console.log(`✅ ${subcatId}: ${imagePath}`);
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
 * Melhora o componente CategoryCard para melhor exibição
 */
function improveCategoryCard() {
  console.log('\n🔄 Melhorando componente CategoryCard...');
  
  const cardFile = 'components/CategoryCard.tsx';
  
  if (!fs.existsSync(cardFile)) {
    console.log('❌ Arquivo CategoryCard não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(cardFile, 'utf8');
  
  // Fazer backup
  fs.writeFileSync(`${cardFile}.backup_improve`, content, 'utf8');
  console.log(`📦 Backup criado: ${cardFile}.backup_improve`);
  
  let updatedContent = content;
  
  // Aumentar altura do card
  updatedContent = updatedContent.replace(
    'className="h-64 relative"',
    'className="h-80 relative"'
  );
  
  // Melhorar exibição da imagem
  updatedContent = updatedContent.replace(
    'className="object-cover group-hover:scale-105 transition-transform duration-300"',
    'className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-100 p-4"'
  );
  
  // Adicionar sombra e bordas
  updatedContent = updatedContent.replace(
    'className="card group hover:shadow-xl transition-all duration-300"',
    'className="card group hover:shadow-xl transition-all duration-300 border border-gray-700"'
  );
  
  fs.writeFileSync(cardFile, updatedContent, 'utf8');
  console.log('✅ CategoryCard melhorado para melhor exibição');
  
  return true;
}

/**
 * Verifica se as imagens existem
 */
function verifyImages() {
  console.log('\n🔍 Verificando se as imagens existem...');
  
  const imageMappings = {
    'futebol': '/images/Futebol/Camisas24-25/Flamengo24-25.jpg',
    'versao-jogador': '/images/Futebol/CamisaJogador/FlamengoJogador.png',
    'versao-feminina': '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino1.jpg',
    'regatas': '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png',
    'retro': '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png',
    'shorts-masculino': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png',
    'shorts-feminino': '/images/Futebol/ShortFutebolFeminino/ShortFemininoFlamengo.jpg'
  };
  
  let allExist = true;
  
  for (const [name, imagePath] of Object.entries(imageMappings)) {
    const fullPath = path.join('public', imagePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${name}: ${imagePath}`);
    } else {
      console.log(`❌ ${name}: ${imagePath} (não encontrado)`);
      allExist = false;
    }
  }
  
  return allExist;
}

/**
 * Função principal
 */
function main() {
  console.log('🔄 Atualizando imagens específicas das categorias...');
  console.log(`📄 Arquivo: ${categoriesFile}`);
  console.log('-'.repeat(60));

  // Verificar imagens
  const imagesExist = verifyImages();
  
  if (!imagesExist) {
    console.log('⚠️  Algumas imagens não foram encontradas');
  }
  
  // Atualizar imagens específicas
  const imagesUpdated = updateSpecificImages();
  
  // Melhorar CategoryCard
  const cardImproved = improveCategoryCard();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Atualização específica concluída!');
  console.log(`🖼️  Imagens: ${imagesUpdated ? 'Atualizadas' : 'Sem mudanças'}`);
  console.log(`🎨 Cards: ${cardImproved ? 'Melhorados' : 'Sem mudanças'}`);
  console.log(`📁 Verificação: ${imagesExist ? 'OK' : 'Algumas imagens não encontradas'}`);
  
  if (imagesUpdated || cardImproved) {
    console.log('🎉 Categorias atualizadas com imagens específicas!');
    console.log('📋 Cards agora exibem imagens sem cortes');
  } else {
    console.log('ℹ️  Nenhuma atualização foi necessária');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  updateSpecificImages, 
  improveCategoryCard, 
  verifyImages 
};
