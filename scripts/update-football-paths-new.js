#!/usr/bin/env node

/**
 * Script para atualizar os caminhos das imagens de futebol com base nos novos arquivos
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';
const footballDir = 'public/images/Futebol';

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
 * Encontra arquivo correspondente baseado no nome
 */
function findMatchingFile(targetPath, availableImages) {
  const targetName = path.basename(targetPath, path.extname(targetPath));
  const targetDir = path.dirname(targetPath);
  
  // Procurar por arquivo com nome similar
  for (const availableImage of availableImages) {
    if (availableImage.startsWith(targetDir + '/')) {
      const availableName = path.basename(availableImage, path.extname(availableImage));
      
      // Verificar se os nomes são similares (ignorando diferenças de capitalização e caracteres especiais)
      const normalizedTarget = targetName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedAvailable = availableName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (normalizedTarget === normalizedAvailable) {
        return availableImage;
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
      
      // Tentar encontrar arquivo correspondente
      const matchingFile = findMatchingFile(imagePath, availableImages);
      if (matchingFile) {
        console.log(`✅ Encontrado arquivo correspondente: ${matchingFile}`);
        
        // Substituir no conteúdo
        const oldPattern = `image: '${imagePath}'`;
        const newPattern = `image: '${matchingFile}'`;
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
 * Verifica se os arquivos existem após a atualização
 */
function verifyUpdatedPaths() {
  console.log('\n🔍 Verificando caminhos após atualização...');
  
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
  console.log('⚽ Atualizando caminhos das imagens de futebol...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log(`📁 Diretório: ${footballDir}`);
  console.log('-'.repeat(50));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  if (!fs.existsSync(footballDir)) {
    console.log(`❌ Diretório não encontrado: ${footballDir}`);
    return;
  }

  // Fazer backup do arquivo original
  const backupFile = productsFile + '.backup';
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Atualizar caminhos
  const updatedCount = updateImagePaths();
  
  // Verificar resultado
  const result = verifyUpdatedPaths();
  
  // Listar imagens disponíveis
  listAvailableImagesByCategory();

  console.log('\n' + '-'.repeat(50));
  console.log('✅ Atualização concluída!');
  console.log(`📊 Caminhos atualizados: ${updatedCount}`);
  console.log(`✅ Arquivos encontrados: ${result.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.notFoundCount === 0) {
    console.log('🎉 Todos os caminhos estão corretos!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados. Verifique manualmente.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { updateImagePaths, verifyUpdatedPaths };
