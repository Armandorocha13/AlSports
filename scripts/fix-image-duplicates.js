#!/usr/bin/env node

/**
 * Script para identificar e corrigir duplicidades de imagens
 */

const fs = require('fs');
const path = require('path');

const imagesDir = 'public/images/Futebol/CamisasFutebolFeminina';
const productsFile = 'lib/data/products-futebol.ts';

/**
 * Identifica duplicidades de imagens
 */
function identifyDuplicates() {
  console.log('🔍 Identificando duplicidades de imagens...');
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`❌ Pasta não encontrada: ${imagesDir}`);
    return [];
  }
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Total de imagens: ${imageFiles.length}`);
  
  // Identificar possíveis duplicidades por nome similar
  const duplicates = [];
  const processed = new Set();
  
  for (let i = 0; i < imageFiles.length; i++) {
    const file1 = imageFiles[i];
    if (processed.has(file1)) continue;
    
    const name1 = path.basename(file1, path.extname(file1)).toLowerCase();
    const similarFiles = [file1];
    
    for (let j = i + 1; j < imageFiles.length; j++) {
      const file2 = imageFiles[j];
      if (processed.has(file2)) continue;
      
      const name2 = path.basename(file2, path.extname(file2)).toLowerCase();
      
      // Verificar se os nomes são similares
      if (areNamesSimilar(name1, name2)) {
        similarFiles.push(file2);
        processed.add(file2);
      }
    }
    
    if (similarFiles.length > 1) {
      duplicates.push(similarFiles);
      similarFiles.forEach(file => processed.add(file));
    }
  }
  
  console.log(`🔍 Duplicidades encontradas: ${duplicates.length}`);
  duplicates.forEach((group, index) => {
    console.log(`\n📋 Grupo ${index + 1}:`);
    group.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  });
  
  return duplicates;
}

/**
 * Verifica se dois nomes são similares
 */
function areNamesSimilar(name1, name2) {
  // Remover números e caracteres especiais para comparação
  const clean1 = name1.replace(/[0-9_-]/g, '').replace(/\s+/g, '');
  const clean2 = name2.replace(/[0-9_-]/g, '').replace(/\s+/g, '');
  
  // Verificar se um nome contém o outro
  if (clean1.includes(clean2) || clean2.includes(clean1)) {
    return true;
  }
  
  // Verificar diferenças mínimas (1-2 caracteres)
  const diff = Math.abs(clean1.length - clean2.length);
  if (diff <= 2) {
    const commonChars = countCommonChars(clean1, clean2);
    const similarity = commonChars / Math.max(clean1.length, clean2.length);
    return similarity > 0.8;
  }
  
  return false;
}

/**
 * Conta caracteres comuns entre duas strings
 */
function countCommonChars(str1, str2) {
  let count = 0;
  const minLength = Math.min(str1.length, str2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) {
      count++;
    }
  }
  
  return count;
}

/**
 * Verifica qual arquivo está sendo usado no código
 */
function checkCodeUsage(duplicateGroup) {
  console.log('\n📝 Verificando uso no código...');
  
  if (!fs.existsSync(productsFile)) {
    console.log('❌ Arquivo de produtos não encontrado');
    return null;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const usedFiles = [];
  
  duplicateGroup.forEach(file => {
    const imagePath = `/images/Futebol/CamisasFutebolFeminina/${file}`;
    if (content.includes(imagePath)) {
      usedFiles.push(file);
      console.log(`✅ Usado no código: ${file}`);
    } else {
      console.log(`❌ Não usado no código: ${file}`);
    }
  });
  
  return usedFiles;
}

/**
 * Remove arquivos duplicados não utilizados
 */
function removeUnusedDuplicates(duplicates) {
  console.log('\n🗑️  Removendo arquivos duplicados não utilizados...');
  
  let removedCount = 0;
  
  duplicates.forEach((group, index) => {
    console.log(`\n📋 Processando grupo ${index + 1}:`);
    
    const usedFiles = checkCodeUsage(group);
    
    if (usedFiles.length === 0) {
      console.log('⚠️  Nenhum arquivo do grupo está sendo usado no código');
      return;
    }
    
    if (usedFiles.length === 1) {
      console.log(`✅ Mantendo: ${usedFiles[0]}`);
      
      // Remover os outros arquivos do grupo
      group.forEach(file => {
        if (!usedFiles.includes(file)) {
          const filePath = path.join(imagesDir, file);
          try {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Removido: ${file}`);
            removedCount++;
          } catch (error) {
            console.log(`❌ Erro ao remover ${file}: ${error.message}`);
          }
        }
      });
    } else {
      console.log(`⚠️  Múltiplos arquivos do grupo estão sendo usados no código`);
      console.log('📋 Arquivos usados:');
      usedFiles.forEach(file => console.log(`  - ${file}`));
    }
  });
  
  return removedCount;
}

/**
 * Verifica se ainda há duplicidades após limpeza
 */
function verifyCleanup() {
  console.log('\n🔍 Verificando se ainda há duplicidades...');
  
  const duplicates = identifyDuplicates();
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma duplicidade encontrada!');
    return true;
  } else {
    console.log(`⚠️  Ainda há ${duplicates.length} grupos de duplicidades`);
    return false;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🔧 Corrigindo duplicidades de imagens...');
  console.log(`📁 Pasta: ${imagesDir}`);
  console.log('-'.repeat(60));

  // Identificar duplicidades
  const duplicates = identifyDuplicates();
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma duplicidade encontrada!');
    return;
  }
  
  // Remover duplicatas não utilizadas
  const removedCount = removeUnusedDuplicates(duplicates);
  
  // Verificar limpeza
  const isClean = verifyCleanup();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Correção de duplicidades concluída!');
  console.log(`🗑️  Arquivos removidos: ${removedCount}`);
  console.log(`🧹 Limpeza: ${isClean ? 'Completa' : 'Parcial'}`);
  
  if (isClean) {
    console.log('🎉 Todas as duplicidades foram corrigidas!');
  } else {
    console.log('⚠️  Algumas duplicidades ainda precisam ser verificadas manualmente');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  identifyDuplicates, 
  checkCodeUsage, 
  removeUnusedDuplicates, 
  verifyCleanup 
};
