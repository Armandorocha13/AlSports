#!/usr/bin/env node

/**
 * Script para atualizar todas as subcategorias de futebol
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';
const footballDir = 'public/images/Futebol';

// Mapeamento das subcategorias
const subcategories = {
  'temporada-23-24': 'Camisas23-24',
  'temporada-24-25': 'Camisas24-25', 
  'temporada-25-26': 'Camisas25-26',
  'versao-feminina': 'CamisasFutebolFeminina',
  'regatas': 'CamisasFutebolRegatas',
  'retro': 'CamisasFutebolRetro',
  'shorts': 'ShortsFutebolMasculino',
  'jogador': 'CamisaJogador'
};

/**
 * Lista todas as imagens disponíveis em uma pasta
 */
function getAvailableImages(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  return files
    .filter(file => file.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
    .map(file => file.name);
}

/**
 * Encontra arquivo correspondente baseado no nome
 */
function findMatchingFile(targetName, availableImages) {
  const normalizedTarget = targetName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const availableImage of availableImages) {
    const availableName = path.basename(availableImage, path.extname(availableImage));
    const normalizedAvailable = availableName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (normalizedTarget === normalizedAvailable) {
      return availableImage;
    }
  }
  
  return null;
}

/**
 * Atualiza uma subcategoria específica
 */
function updateSubcategory(subcategory, folderName) {
  console.log(`\n📁 Atualizando subcategoria: ${subcategory} -> ${folderName}`);
  
  const folderPath = path.join(footballDir, folderName);
  const availableImages = getAvailableImages(folderPath);
  
  if (availableImages.length === 0) {
    console.log(`⚠️  Nenhuma imagem encontrada em ${folderName}`);
    return { updated: 0, notFound: 0 };
  }
  
  console.log(`📊 ${availableImages.length} imagens disponíveis em ${folderName}`);
  
  // Ler arquivo de produtos
  let content = fs.readFileSync(productsFile, 'utf8');
  let updated = 0;
  let notFound = 0;
  
  // Encontrar produtos desta subcategoria
  const regex = new RegExp(`subcategory:\\s*['"]${subcategory}['"]`, 'g');
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    // Encontrar o bloco do produto
    const startIndex = content.lastIndexOf('{', match.index);
    const endIndex = content.indexOf('}', match.index) + 1;
    
    if (startIndex !== -1 && endIndex !== -1) {
      const productBlock = content.substring(startIndex, endIndex);
      
      // Extrair nome e imagem atual
      const nameMatch = productBlock.match(/name:\s*['"]([^'"]+)['"]/);
      const imageMatch = productBlock.match(/image:\s*['"]([^'"]+)['"]/);
      
      if (nameMatch && imageMatch) {
        const productName = nameMatch[1];
        const currentImage = imageMatch[1];
        
        // Encontrar arquivo correspondente
        const matchingFile = findMatchingFile(productName, availableImages);
        
        if (matchingFile) {
          const newImagePath = `/images/Futebol/${folderName}/${matchingFile}`;
          
          if (currentImage !== newImagePath) {
            console.log(`  ✅ ${productName}: ${currentImage} -> ${newImagePath}`);
            
            // Substituir no conteúdo
            content = content.replace(currentImage, newImagePath);
            updated++;
          } else {
            console.log(`  ✅ ${productName}: já está correto`);
          }
        } else {
          console.log(`  ❌ ${productName}: nenhum arquivo correspondente encontrado`);
          notFound++;
        }
      }
    }
  }
  
  // Salvar arquivo atualizado
  if (updated > 0) {
    fs.writeFileSync(productsFile, content);
    console.log(`📝 ${updated} produtos atualizados`);
  }
  
  return { updated, notFound };
}

/**
 * Verifica se todos os caminhos estão corretos
 */
function verifyAllPaths() {
  console.log('\n🔍 Verificando todos os caminhos...');
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const regex = /image:\s*['"]([^'"]+)['"]/g;
  let match;
  let foundCount = 0;
  let notFoundCount = 0;
  
  while ((match = regex.exec(content)) !== null) {
    if (match[1].includes('/images/Futebol/')) {
      const fullPath = path.join('public', match[1]);
      if (fs.existsSync(fullPath)) {
        foundCount++;
      } else {
        notFoundCount++;
        console.log(`❌ ${match[1]}`);
      }
    }
  }
  
  console.log(`📊 Resultado: ${foundCount} encontrados, ${notFoundCount} não encontrados`);
  return { foundCount, notFoundCount };
}

/**
 * Lista imagens por subcategoria
 */
function listImagesBySubcategory() {
  console.log('\n📁 Imagens disponíveis por subcategoria:');
  
  Object.entries(subcategories).forEach(([subcategory, folderName]) => {
    const folderPath = path.join(footballDir, folderName);
    const images = getAvailableImages(folderPath);
    
    console.log(`\n📂 ${subcategory} (${folderName}):`);
    images.forEach(image => {
      console.log(`  - ${image}`);
    });
  });
}

/**
 * Função principal
 */
function main() {
  console.log('⚽ Atualizando todas as subcategorias de futebol...');
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

  let totalUpdated = 0;
  let totalNotFound = 0;

  // Atualizar cada subcategoria
  Object.entries(subcategories).forEach(([subcategory, folderName]) => {
    const result = updateSubcategory(subcategory, folderName);
    totalUpdated += result.updated;
    totalNotFound += result.notFound;
  });

  // Verificar resultado
  const verification = verifyAllPaths();
  
  // Listar imagens disponíveis
  listImagesBySubcategory();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Atualização concluída!');
  console.log(`📊 Total de produtos atualizados: ${totalUpdated}`);
  console.log(`❌ Produtos não encontrados: ${totalNotFound}`);
  console.log(`✅ Arquivos encontrados: ${verification.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${verification.notFoundCount}`);
  
  if (verification.notFoundCount === 0) {
    console.log('🎉 Todas as subcategorias estão atualizadas!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { updateSubcategory, verifyAllPaths };
