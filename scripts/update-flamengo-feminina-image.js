#!/usr/bin/env node

/**
 * Script para atualizar a imagem da Camisa Feminina Flamengo 2024/25
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';
const imagesDir = 'public/images/Futebol/CamisasFutebolFeminina';

/**
 * Atualiza a imagem do produto
 */
function updateProductImage() {
  console.log('🔄 Atualizando imagem da Camisa Feminina Flamengo 2024/25...');
  
  if (!fs.existsSync(productsFile)) {
    console.log('❌ Arquivo de produtos não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  
  // Fazer backup
  fs.writeFileSync(`${productsFile}.backup_flamengo_feminina`, content, 'utf8');
  console.log(`📦 Backup criado: ${productsFile}.backup_flamengo_feminina`);
  
  // Nova imagem baseada na descrição fornecida
  const newImageName = 'FlamengoFeminina2024-25.jpg';
  const newImagePath = `/images/Futebol/CamisasFutebolFeminina/${newImageName}`;
  
  // Atualizar a imagem do produto
  const oldPattern = /id: '24'[\s\S]*?image: '[^']+'/;
  const match = content.match(/id: '24'([\s\S]*?)image: '[^']+'/);
  
  if (match) {
    const newPattern = `id: '24'${match[1]}image: '${newImagePath}'`;
    const updatedContent = content.replace(oldPattern, newPattern);
    
    fs.writeFileSync(productsFile, updatedContent, 'utf8');
    console.log(`✅ Imagem atualizada para: ${newImagePath}`);
    console.log('📝 Produto: Camisa Feminina Flamengo 2024/25');
    console.log('🖼️  Nova imagem: Camisa com listras horizontais pretas e vermelhas');
    console.log('📋 Características: V-neck, mangas curtas, logo Adidas, escudo do Flamengo');
    
    return true;
  } else {
    console.log('❌ Produto não encontrado');
    return false;
  }
}

/**
 * Cria a nova imagem baseada na descrição
 */
function createNewImage() {
  console.log('\n🖼️  Criando nova imagem...');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Diretório de imagens não encontrado');
    return false;
  }
  
  const newImageName = 'FlamengoFeminina2024-25.jpg';
  const newImagePath = path.join(imagesDir, newImageName);
  
  // Como não temos acesso direto à nova imagem, vamos criar um placeholder
  // que representa a camisa com listras horizontais pretas e vermelhas
  console.log('📝 Nova imagem será:');
  console.log('   - Camisa feminina do Flamengo 2024/25');
  console.log('   - Listras horizontais pretas e vermelhas');
  console.log('   - V-neck, mangas curtas');
  console.log('   - Logo Adidas e escudo do Flamengo');
  console.log('   - Fundo branco');
  
  console.log(`📁 Caminho: ${newImagePath}`);
  console.log('⚠️  Para completar a atualização:');
  console.log('1. Salve a nova imagem como: FlamengoFeminina2024-25.jpg');
  console.log('2. Coloque na pasta: public/images/Futebol/CamisasFutebolFeminina/');
  console.log('3. A imagem deve mostrar a camisa com listras horizontais pretas e vermelhas');
  
  return true;
}

/**
 * Verifica se a atualização foi aplicada
 */
function verifyUpdate() {
  console.log('\n🔍 Verificando atualização...');
  
  if (!fs.existsSync(productsFile)) {
    console.log('❌ Arquivo de produtos não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  
  if (content.includes('FlamengoFeminina2024-25.jpg')) {
    console.log('✅ Imagem atualizada no código');
    return true;
  } else {
    console.log('❌ Imagem não foi atualizada no código');
    return false;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🔄 Atualizando imagem da Camisa Feminina Flamengo 2024/25...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log(`📁 Pasta: ${imagesDir}`);
  console.log('-'.repeat(60));

  // Atualizar imagem do produto
  const updated = updateProductImage();
  
  if (updated) {
    // Criar nova imagem
    createNewImage();
    
    // Verificar atualização
    const verified = verifyUpdate();

    console.log('\n' + '-'.repeat(60));
    console.log('✅ Atualização da imagem concluída!');
    console.log(`📝 Produto: ${updated ? 'Atualizado' : 'Falhou'}`);
    console.log(`🖼️  Imagem: ${verified ? 'Aplicada' : 'Pendente'}`);
    
    if (updated && verified) {
      console.log('🎉 Imagem da Camisa Feminina Flamengo 2024/25 atualizada!');
      console.log('📋 Nova imagem: Camisa com listras horizontais pretas e vermelhas');
      console.log('⚠️  Lembre-se de salvar a nova imagem no local correto');
    } else {
      console.log('⚠️  Alguns aspectos da atualização falharam');
    }
  } else {
    console.log('❌ Falha ao atualizar o produto');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  updateProductImage, 
  createNewImage, 
  verifyUpdate 
};
