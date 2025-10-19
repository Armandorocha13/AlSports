#!/usr/bin/env node

/**
 * Script para corrigir caminhos de imagens removidas no código
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';

// Mapeamento de correções para arquivos removidos
const pathCorrections = {
  // PNG removidos -> JPG
  '/images/Futebol/Camisas24-25/BrasilComemorativa24-25.png': '/images/Futebol/Camisas24-25/BrasilComemorativa24-25.jpg',
  '/images/Futebol/Camisas25-26/Barcelona25-26.png': '/images/Futebol/Camisas25-26/Barcelona25-26.jpg',
  '/images/Futebol/Camisas25-26/Bayer25-26.png': '/images/Futebol/Camisas25-26/Bayer25-26.jpg',
  '/images/Futebol/Camisas25-26/Chelsea25-26.png': '/images/Futebol/Camisas25-26/Chelsea25-26.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.png': '/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.jpg',
  '/images/Futebol/CamisasFutebolRetro/Brasil94.png': '/images/Futebol/CamisasFutebolRetro/Brasil94.jpg',
  '/images/Futebol/CamisasFutebolRetro/Parma95.png': '/images/Futebol/CamisasFutebolRetro/Parma95.jpg',
  '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.jpg',
  
  // WEBP removidos -> JPG
  '/images/Futebol/Camisas25-26/Arsenal25-26.webp': '/images/Futebol/Camisas25-26/Arsenal25-26.jpg'
};

/**
 * Corrige caminhos de imagens no arquivo de produtos
 */
function fixImagePaths() {
  console.log('🔧 Corrigindo caminhos de imagens removidas...');
  
  let content = fs.readFileSync(productsFile, 'utf8');
  let fixedCount = 0;
  
  // Aplicar cada correção
  Object.entries(pathCorrections).forEach(([oldPath, newPath]) => {
    const oldPattern = `image: '${oldPath}'`;
    const newPattern = `image: '${newPath}'`;
    
    if (content.includes(oldPattern)) {
      console.log(`✅ Corrigindo: ${oldPath} -> ${newPath}`);
      content = content.replace(oldPattern, newPattern);
      fixedCount++;
    }
  });
  
  // Salvar arquivo atualizado
  if (fixedCount > 0) {
    fs.writeFileSync(productsFile, content);
    console.log(`📝 ${fixedCount} caminhos corrigidos`);
  } else {
    console.log('ℹ️  Nenhuma correção necessária');
  }
  
  return fixedCount;
}

/**
 * Verifica se todos os caminhos estão corretos
 */
function verifyPaths() {
  console.log('\n🔍 Verificando caminhos após correção...');
  
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
 * Função principal
 */
function main() {
  console.log('🔧 Corrigindo caminhos de imagens removidas...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log('-'.repeat(50));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  // Fazer backup
  const backupFile = productsFile + '.backup_format_fix';
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Corrigir caminhos
  const fixedCount = fixImagePaths();
  
  // Verificar resultado
  const result = verifyPaths();

  console.log('\n' + '-'.repeat(50));
  console.log('✅ Correção concluída!');
  console.log(`📊 Caminhos corrigidos: ${fixedCount}`);
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

module.exports = { fixImagePaths, verifyPaths };
