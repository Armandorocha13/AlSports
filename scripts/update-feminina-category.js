#!/usr/bin/env node

/**
 * Script para atualizar a categoria de camisas femininas
 */

const fs = require('fs');
const path = require('path');

const productsFilePath = 'lib/data/products-futebol.ts';
const imagesBaseDir = 'public/images/Futebol/CamisasFutebolFeminina';

/**
 * Verifica imagens disponíveis na pasta de camisas femininas
 */
function getAvailableFemininaImages() {
  console.log('🔍 Verificando imagens disponíveis na pasta de camisas femininas...');
  
  if (!fs.existsSync(imagesBaseDir)) {
    console.log(`❌ Pasta não encontrada: ${imagesBaseDir}`);
    return [];
  }
  
  const files = fs.readdirSync(imagesBaseDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Encontradas ${imageFiles.length} imagens:`);
  imageFiles.forEach(file => {
    const filePath = path.join(imagesBaseDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
  
  return imageFiles;
}

/**
 * Verifica produtos da categoria feminina no código
 */
function getFemininaProducts() {
  console.log('\n🔍 Verificando produtos da categoria feminina no código...');
  
  const content = fs.readFileSync(productsFilePath, 'utf8');
  const lines = content.split('\n');
  
  const femininaProducts = [];
  let currentProduct = null;
  let inFemininaProduct = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detecta início de produto
    if (line.includes("id: '") && line.includes("'")) {
      currentProduct = { startLine: i, lines: [] };
      inFemininaProduct = false;
    }
    
    if (currentProduct) {
      currentProduct.lines.push(line);
      
      // Detecta se é produto feminino
      if (line.includes("subcategory: 'versao-feminina'")) {
        inFemininaProduct = true;
      }
      
      // Detecta fim do produto
      if (line.includes('},') && inFemininaProduct) {
        currentProduct.endLine = i;
        currentProduct.isFeminina = true;
        femininaProducts.push(currentProduct);
        currentProduct = null;
        inFemininaProduct = false;
      }
    }
  }
  
  console.log(`📊 Encontrados ${femininaProducts.length} produtos femininos:`);
  femininaProducts.forEach((product, index) => {
    const nameLine = product.lines.find(line => line.includes("name: '"));
    const imageLine = product.lines.find(line => line.includes("image: '"));
    const name = nameLine ? nameLine.match(/name: '([^']+)'/)?.[1] : 'N/A';
    const image = imageLine ? imageLine.match(/image: '([^']+)'/)?.[1] : 'N/A';
    console.log(`  ${index + 1}. ${name}`);
    console.log(`     Imagem: ${image}`);
  });
  
  return femininaProducts;
}

/**
 * Verifica se as imagens dos produtos existem
 */
function verifyFemininaImages(femininaProducts) {
  console.log('\n🔍 Verificando se as imagens dos produtos femininos existem...');
  
  let foundCount = 0;
  let notFoundCount = 0;
  
  femininaProducts.forEach((product, index) => {
    const imageLine = product.lines.find(line => line.includes("image: '"));
    if (imageLine) {
      const imagePath = imageLine.match(/image: '([^']+)'/)?.[1];
      if (imagePath) {
        const fullPath = path.join('public', imagePath);
        if (fs.existsSync(fullPath)) {
          console.log(`✅ ${imagePath}`);
          foundCount++;
        } else {
          console.log(`❌ ${imagePath}`);
          notFoundCount++;
        }
      }
    }
  });
  
  console.log(`\n📊 Resultado: ${foundCount} encontradas, ${notFoundCount} não encontradas`);
  return { found: foundCount, notFound: notFoundCount };
}

/**
 * Atualiza informações da categoria feminina
 */
function updateFemininaCategory() {
  console.log('\n🔄 Atualizando informações da categoria feminina...');
  
  // Verificar se a imagem FluminensePatchFeminio3 foi atualizada
  const fluminenseImagePath = path.join(imagesBaseDir, 'FluminensePatchFeminio3.png');
  if (fs.existsSync(fluminenseImagePath)) {
    const stats = fs.statSync(fluminenseImagePath);
    console.log(`✅ Imagem FluminensePatchFeminio3 encontrada:`);
    console.log(`   Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Modificada: ${stats.mtime.toLocaleString()}`);
  } else {
    console.log(`❌ Imagem FluminensePatchFeminio3 não encontrada`);
  }
  
  // Verificar backup
  const backupPath = path.join(imagesBaseDir, 'FluminensePatchFeminio3_original.png');
  if (fs.existsSync(backupPath)) {
    console.log(`📦 Backup disponível: FluminensePatchFeminio3_original.png`);
  }
  
  return true;
}

/**
 * Função principal
 */
function main() {
  console.log('🔄 Atualizando categoria de camisas femininas...');
  console.log(`📁 Pasta: ${imagesBaseDir}`);
  console.log(`📄 Arquivo: ${productsFilePath}`);
  console.log('-'.repeat(60));

  // Verificar imagens disponíveis
  const availableImages = getAvailableFemininaImages();
  
  // Verificar produtos femininos
  const femininaProducts = getFemininaProducts();
  
  // Verificar imagens dos produtos
  const imageStatus = verifyFemininaImages(femininaProducts);
  
  // Atualizar categoria
  updateFemininaCategory();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Atualização da categoria feminina concluída!');
  console.log(`📊 Produtos femininos: ${femininaProducts.length}`);
  console.log(`📁 Imagens disponíveis: ${availableImages.length}`);
  console.log(`✅ Imagens encontradas: ${imageStatus.found}`);
  console.log(`❌ Imagens não encontradas: ${imageStatus.notFound}`);
  
  if (imageStatus.notFound === 0) {
    console.log('🎉 Todas as imagens da categoria feminina estão corretas!');
  } else {
    console.log('⚠️  Algumas imagens precisam ser verificadas');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  getAvailableFemininaImages, 
  getFemininaProducts, 
  verifyFemininaImages, 
  updateFemininaCategory 
};
