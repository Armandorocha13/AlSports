#!/usr/bin/env node

/**
 * Script para atualizar caminhos das imagens de futebol com formatos corretos
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';
const footballDir = 'public/images/Futebol';

/**
 * Lista todas as imagens disponíveis na pasta futebol
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
          const relativePath = path.relative('public', fullPath).replace(/\\/g, '/');
          const baseName = path.basename(file.name, ext);
          images.push({
            path: fullPath,
            relativePath: relativePath,
            name: file.name,
            baseName: baseName,
            ext: ext
          });
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
 * Encontra a imagem correta baseada no nome
 */
function findCorrectImage(targetPath, availableImages) {
  const targetName = path.basename(targetPath, path.extname(targetPath));
  const targetDir = path.dirname(targetPath);
  
  // Procurar por arquivo com nome similar
  for (const image of availableImages) {
    if (image.relativePath.startsWith(targetDir + '/')) {
      if (image.baseName === targetName) {
        return image.relativePath;
      }
    }
  }
  
  return null;
}

/**
 * Atualiza os caminhos das imagens no arquivo de produtos
 */
function updateImagePaths() {
  console.log('🔄 Atualizando caminhos das imagens de futebol...');
  
  const availableImages = getAllAvailableImages();
  const content = fs.readFileSync(productsFile, 'utf8');
  const imagePaths = extractImagePathsFromProducts();
  
  let updatedCount = 0;
  let contentToUpdate = content;
  
  console.log(`📊 Encontrados ${imagePaths.length} caminhos de imagens de futebol`);
  console.log(`📊 Encontradas ${availableImages.length} imagens disponíveis`);
  
  for (const imagePath of imagePaths) {
    const fullPath = path.join('public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${imagePath}`);
      
      // Tentar encontrar arquivo correto
      const correctPath = findCorrectImage(imagePath, availableImages);
      if (correctPath) {
        console.log(`✅ Encontrado arquivo correto: ${correctPath}`);
        
        // Substituir no conteúdo
        const oldPattern = `image: '${imagePath}'`;
        const newPattern = `image: '${correctPath}'`;
        contentToUpdate = contentToUpdate.replace(oldPattern, newPattern);
        updatedCount++;
      } else {
        console.log(`⚠️  Nenhum arquivo correspondente encontrado para: ${imagePath}`);
      }
    } else {
      console.log(`✅ Arquivo existe: ${imagePath}`);
    }
  }
  
  // Salvar arquivo atualizado se houver mudanças
  if (updatedCount > 0) {
    fs.writeFileSync(productsFile, contentToUpdate);
    console.log(`📝 Arquivo atualizado com ${updatedCount} correções`);
  } else {
    console.log('ℹ️  Nenhuma correção necessária');
  }
  
  return updatedCount;
}

/**
 * Verifica se todos os caminhos estão corretos
 */
function verifyAllPaths() {
  console.log('\n🔍 Verificando todos os caminhos...');
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const regex = /image:\s*['"`]([^'"`]+)['"`]/g;
  let match;
  let foundCount = 0;
  let notFoundCount = 0;
  
  while ((match = regex.exec(content)) !== null) {
    if (match[1].includes('/images/Futebol/')) {
      const fullPath = path.join('public', match[1]);
      if (fs.existsSync(fullPath)) {
        foundCount++;
        console.log(`✅ ${match[1]}`);
      } else {
        notFoundCount++;
        console.log(`❌ ${match[1]}`);
      }
    }
  }
  
  console.log(`\n📊 Resultado: ${foundCount} encontrados, ${notFoundCount} não encontrados`);
  return { foundCount, notFoundCount };
}

/**
 * Lista imagens por categoria
 */
function listImagesByCategory() {
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
  console.log('⚽ Atualizando caminhos das imagens de futebol...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log(`📁 Diretório: ${footballDir}`);
  console.log('-'.repeat(60));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  if (!fs.existsSync(footballDir)) {
    console.log(`❌ Diretório não encontrado: ${footballDir}`);
    return;
  }

  // Fazer backup
  const backupFile = productsFile + '.backup_' + new Date().toISOString().slice(0, 10);
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Atualizar caminhos
  const updatedCount = updateImagePaths();
  
  // Verificar resultado
  const result = verifyAllPaths();
  
  // Listar imagens disponíveis
  listImagesByCategory();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Atualização concluída!');
  console.log(`📊 Caminhos atualizados: ${updatedCount}`);
  console.log(`✅ Arquivos encontrados: ${result.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.notFoundCount === 0) {
    console.log('🎉 Todos os caminhos estão corretos!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  getAllAvailableImages, 
  extractImagePathsFromProducts, 
  updateImagePaths, 
  verifyAllPaths 
};
