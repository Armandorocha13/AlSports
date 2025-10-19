#!/usr/bin/env node

/**
 * Script para atualizar as imagens da subcategoria Camisas24-25
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';

// Mapeamento manual dos produtos com as imagens disponíveis
const imageMappings = {
  // Produto: Imagem disponível
  'Camisa Al Nassr 2024/25': 'Alnasser24-25.jpg',
  'Camisa Brasil 2024/25': 'BrasilComemorativa24-25.jpg', // Usando a comemorativa como principal
  'Camisa Brasil Comemorativa 2024/25': 'BrasilComemorativa24-25.png',
  'Camisa Manchester City 2024/25': 'City24-25.jpg',
  'Camisa Flamengo 2ª Versão 2024/25': 'Flamengo2-2425.jpg',
  'Camisa Flamengo 2024/25': 'Flamengo24-25.jpg',
  'Camisa Flamengo Comissão 2024/25': 'FlamengoComissao24-25.jpg',
  'Camisa Fluminense 2024/25': 'Fluminense24-25.jpg',
  'Camisa Fluminense Patch 2024/25': 'FluminensePatch24-25.jpg',
  'Camisa França 2024/25': 'Franca24-25.jpg',
  'Camisa Internacional 2024/25': 'Inter24-25.jpg',
  'Camisa Manchester City 2ª Versão 2024/25': 'ManCity24-25.jpg',
  'Camisa Real Madrid 2024/25': 'RealMadrid24-25.jpg',
  'Camisa Real Madrid Treino 2024/25': 'RealMadridTreino24-25.jpg',
  'Camisa Real Madrid Treino 2ª Versão 2024/25': 'RealMadridTreinio2-24-25.jpg',
  'Camisa Sport 2024/25': 'Sport24-25.jpg',
  'Camisa Vasco 2ª Versão 2024/25': 'Vasco2-2425.jpg',
  'Camisa Vasco 2024/25': 'Vasco24-25.jpg',
  'Camisa Vasco Comemorativa 2024/25': 'VascoComemorativa.jpg',
  'Camisa Vasco Comissão 2024/25': 'VascoComissao24-25.jpg'
};

/**
 * Atualiza as imagens da subcategoria Camisas24-25
 */
function updateCamisas24_25() {
  console.log('🔄 Atualizando imagens da subcategoria Camisas24-25...');
  
  let content = fs.readFileSync(productsFile, 'utf8');
  let updatedCount = 0;
  
  // Processar cada mapeamento
  Object.entries(imageMappings).forEach(([productName, imageFile]) => {
    const newImagePath = `/images/Futebol/Camisas24-25/${imageFile}`;
    
    // Encontrar o produto pelo nome
    const productRegex = new RegExp(`name:\\s*['"]${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    let match;
    
    while ((match = productRegex.exec(content)) !== null) {
      // Encontrar o bloco do produto
      const startIndex = content.lastIndexOf('{', match.index);
      const endIndex = content.indexOf('}', match.index) + 1;
      
      if (startIndex !== -1 && endIndex !== -1) {
        const productBlock = content.substring(startIndex, endIndex);
        
        // Encontrar a imagem atual
        const imageMatch = productBlock.match(/image:\s*['"]([^'"]+)['"]/);
        
        if (imageMatch) {
          const currentImage = imageMatch[1];
          
          if (currentImage !== newImagePath) {
            console.log(`✅ ${productName}: ${currentImage} -> ${newImagePath}`);
            
            // Substituir no conteúdo
            content = content.replace(currentImage, newImagePath);
            updatedCount++;
          } else {
            console.log(`✅ ${productName}: já está correto`);
          }
        }
      }
    }
  });
  
  // Salvar arquivo atualizado
  if (updatedCount > 0) {
    fs.writeFileSync(productsFile, content);
    console.log(`📝 ${updatedCount} produtos atualizados`);
  } else {
    console.log('ℹ️  Nenhuma atualização necessária');
  }
  
  return updatedCount;
}

/**
 * Verifica se os arquivos existem
 */
function verifyImages() {
  console.log('\n🔍 Verificando imagens da subcategoria Camisas24-25...');
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const regex = /subcategory:\s*['"]temporada-24-25['"]/g;
  let match;
  let foundCount = 0;
  let notFoundCount = 0;
  
  while ((match = regex.exec(content)) !== null) {
    // Encontrar o bloco do produto
    const startIndex = content.lastIndexOf('{', match.index);
    const endIndex = content.indexOf('}', match.index) + 1;
    
    if (startIndex !== -1 && endIndex !== -1) {
      const productBlock = content.substring(startIndex, endIndex);
      
      // Extrair nome e imagem
      const nameMatch = productBlock.match(/name:\s*['"]([^'"]+)['"]/);
      const imageMatch = productBlock.match(/image:\s*['"]([^'"]+)['"]/);
      
      if (nameMatch && imageMatch) {
        const productName = nameMatch[1];
        const imagePath = imageMatch[1];
        const fullPath = path.join('public', imagePath);
        
        if (fs.existsSync(fullPath)) {
          console.log(`✅ ${productName}: ${imagePath}`);
          foundCount++;
        } else {
          console.log(`❌ ${productName}: ${imagePath}`);
          notFoundCount++;
        }
      }
    }
  }
  
  console.log(`\n📊 Resultado: ${foundCount} encontrados, ${notFoundCount} não encontrados`);
  return { foundCount, notFoundCount };
}

/**
 * Lista imagens disponíveis
 */
function listAvailableImages() {
  console.log('\n📁 Imagens disponíveis em Camisas24-25:');
  
  const folderPath = 'public/images/Futebol/Camisas24-25';
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );
    
    imageFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

/**
 * Função principal
 */
function main() {
  console.log('⚽ Atualizando imagens da subcategoria Camisas24-25...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log('-'.repeat(50));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  // Fazer backup
  const backupFile = productsFile + '.backup_camisas24-25';
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Atualizar imagens
  const updatedCount = updateCamisas24_25();
  
  // Verificar resultado
  const result = verifyImages();
  
  // Listar imagens disponíveis
  listAvailableImages();

  console.log('\n' + '-'.repeat(50));
  console.log('✅ Atualização concluída!');
  console.log(`📊 Produtos atualizados: ${updatedCount}`);
  console.log(`✅ Arquivos encontrados: ${result.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.notFoundCount === 0) {
    console.log('🎉 Todas as imagens da subcategoria Camisas24-25 estão corretas!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { updateCamisas24_25, verifyImages };
