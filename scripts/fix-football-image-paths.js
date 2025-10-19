#!/usr/bin/env node

/**
 * Script para verificar e corrigir caminhos das imagens de futebol
 */

const fs = require('fs');
const path = require('path');

const footballDir = 'public/images/Futebol';
const productsFile = 'lib/data/products-futebol.ts';

/**
 * Lista todas as imagens disponíveis na pasta Futebol
 */
function getAllAvailableImages() {
  const images = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          // Converter para caminho relativo
          const relativePath = path.relative('public', fullPath).replace(/\\/g, '/');
          images.push(relativePath);
        }
      }
    }
  }
  
  scanDirectory(footballDir);
  return images;
}

/**
 * Extrai caminhos de imagens do arquivo de produtos
 */
function extractImagePathsFromProducts() {
  const content = fs.readFileSync(productsFile, 'utf8');
  const imagePaths = [];
  
  // Encontrar todos os caminhos de imagem
  const regex = /image:\s*['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    if (match[1].includes('/images/Futebol/')) {
      imagePaths.push(match[1]);
    }
  }
  
  return imagePaths;
}

/**
 * Verifica se um arquivo existe
 */
function fileExists(imagePath) {
  const fullPath = path.join('public', imagePath);
  return fs.existsSync(fullPath);
}

/**
 * Encontra arquivo similar (mesmo nome, extensão diferente)
 */
function findSimilarFile(targetPath) {
  const dir = path.dirname(targetPath);
  const nameWithoutExt = path.basename(targetPath, path.extname(targetPath));
  const availableImages = getAllAvailableImages();
  
  // Procurar por arquivo com mesmo nome mas extensão diferente
  for (const availableImage of availableImages) {
    if (availableImage.startsWith(dir + '/')) {
      const availableName = path.basename(availableImage, path.extname(availableImage));
      if (availableName === nameWithoutExt) {
        return availableImage;
      }
    }
  }
  
  return null;
}

/**
 * Corrige caminhos de imagens no arquivo de produtos
 */
function fixImagePaths() {
  console.log('🔍 Verificando caminhos das imagens de futebol...');
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const imagePaths = extractImagePathsFromProducts();
  
  let fixedCount = 0;
  let notFoundCount = 0;
  let contentToUpdate = content;
  
  console.log(`📊 Encontrados ${imagePaths.length} caminhos de imagens de futebol`);
  
  for (const imagePath of imagePaths) {
    if (!fileExists(imagePath)) {
      console.log(`❌ Arquivo não encontrado: ${imagePath}`);
      notFoundCount++;
      
      // Tentar encontrar arquivo similar
      const similarFile = findSimilarFile(imagePath);
      if (similarFile) {
        console.log(`✅ Encontrado arquivo similar: ${similarFile}`);
        
        // Substituir no conteúdo
        const oldPattern = `image: '${imagePath}'`;
        const newPattern = `image: '${similarFile}'`;
        contentToUpdate = contentToUpdate.replace(oldPattern, newPattern);
        fixedCount++;
      } else {
        console.log(`⚠️  Nenhum arquivo similar encontrado para: ${imagePath}`);
      }
    } else {
      console.log(`✅ Arquivo existe: ${imagePath}`);
    }
  }
  
  // Salvar arquivo atualizado se houver mudanças
  if (fixedCount > 0) {
    fs.writeFileSync(productsFile, contentToUpdate);
    console.log(`📝 Arquivo atualizado com ${fixedCount} correções`);
  }
  
  return { fixedCount, notFoundCount };
}

/**
 * Lista imagens disponíveis por categoria
 */
function listAvailableImagesByCategory() {
  console.log('\n📁 Imagens disponíveis por categoria:');
  
  const categories = [
    'CamisaJogador',
    'Camisas23-24', 
    'Camisas24-25',
    'Camisas25-26',
    'CamisasFutebolFeminina',
    'CamisasFutebolRegatas',
    'CamisasFutebolRetro',
    'ShortsFutebolMasculino'
  ];
  
  categories.forEach(category => {
    const categoryPath = path.join(footballDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
      );
      
      console.log(`\n📂 ${category}:`);
      imageFiles.forEach(file => {
        console.log(`  - ${file}`);
      });
    }
  });
}

/**
 * Função principal
 */
function main() {
  console.log('⚽ Verificando e corrigindo caminhos das imagens de futebol...');
  console.log(`📁 Diretório: ${footballDir}`);
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log('-'.repeat(50));

  // Verificar se os diretórios existem
  if (!fs.existsSync(footballDir)) {
    console.log(`❌ Diretório não encontrado: ${footballDir}`);
    return;
  }

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  // Corrigir caminhos
  const result = fixImagePaths();
  
  // Listar imagens disponíveis
  listAvailableImagesByCategory();

  console.log('\n' + '-'.repeat(50));
  console.log('✅ Verificação concluída!');
  console.log(`📊 Caminhos corrigidos: ${result.fixedCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.fixedCount > 0) {
    console.log('🎉 Caminhos das imagens atualizados!');
  } else if (result.notFoundCount > 0) {
    console.log('⚠️  Alguns arquivos não foram encontrados. Verifique os nomes das imagens.');
  } else {
    console.log('✅ Todos os caminhos estão corretos!');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  getAllAvailableImages, 
  extractImagePathsFromProducts, 
  fixImagePaths 
};
