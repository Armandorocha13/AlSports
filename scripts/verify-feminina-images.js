#!/usr/bin/env node

/**
 * Script para verificar se todas as imagens femininas estão funcionando
 */

const fs = require('fs');
const path = require('path');

const imagesDir = 'public/images/Futebol/CamisasFutebolFeminina';
const productsFile = 'lib/data/products-futebol.ts';

/**
 * Verifica se todas as imagens existem
 */
function verifyAllImages() {
  console.log('🔍 Verificando todas as imagens femininas...');
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`❌ Pasta não encontrada: ${imagesDir}`);
    return false;
  }
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Total de imagens: ${imageFiles.length}`);
  
  let allOk = true;
  
  imageFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
  
  return allOk;
}

/**
 * Verifica se todas as imagens estão sendo usadas no código
 */
function verifyCodeUsage() {
  console.log('\n📝 Verificando uso no código...');
  
  if (!fs.existsSync(productsFile)) {
    console.log('❌ Arquivo de produtos não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  let allUsed = true;
  
  imageFiles.forEach(file => {
    const imagePath = `/images/Futebol/CamisasFutebolFeminina/${file}`;
    if (content.includes(imagePath)) {
      console.log(`✅ Usado: ${file}`);
    } else {
      console.log(`❌ Não usado: ${file}`);
      allUsed = false;
    }
  });
  
  return allUsed;
}

/**
 * Verifica se há nomes inconsistentes
 */
function verifyNamingConsistency() {
  console.log('\n🔍 Verificando consistência de nomes...');
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  let isConsistent = true;
  
  imageFiles.forEach(file => {
    // Verificar se há nomes inconsistentes
    if (file.includes('Feminio') && !file.includes('Treino') && !file.includes('Patch')) {
      console.log(`⚠️  Nome inconsistente: ${file}`);
      isConsistent = false;
    }
  });
  
  if (isConsistent) {
    console.log('✅ Todos os nomes estão consistentes!');
  }
  
  return isConsistent;
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Verificando imagens femininas...');
  console.log(`📁 Pasta: ${imagesDir}`);
  console.log('-'.repeat(60));

  // Verificar todas as imagens
  const imagesOk = verifyAllImages();
  
  // Verificar uso no código
  const codeOk = verifyCodeUsage();
  
  // Verificar consistência de nomes
  const namingOk = verifyNamingConsistency();

  console.log('\n' + '-'.repeat(60));
  console.log('🔍 Resultado da verificação:');
  console.log(`📁 Imagens: ${imagesOk ? 'OK' : 'Falhou'}`);
  console.log(`📝 Código: ${codeOk ? 'OK' : 'Falhou'}`);
  console.log(`🔤 Nomes: ${namingOk ? 'OK' : 'Falhou'}`);
  
  const allOk = imagesOk && codeOk && namingOk;
  
  if (allOk) {
    console.log('\n🎉 Todas as verificações passaram!');
    console.log('✅ As imagens femininas estão funcionando corretamente');
  } else {
    console.log('\n⚠️  Algumas verificações falharam');
    console.log('📋 Verifique os itens que falharam acima');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  verifyAllImages, 
  verifyCodeUsage, 
  verifyNamingConsistency 
};
