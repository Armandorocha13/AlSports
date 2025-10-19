#!/usr/bin/env node

/**
 * Script para padronizar nomes de imagens
 */

const fs = require('fs');
const path = require('path');

const imagesDir = 'public/images/Futebol/CamisasFutebolFeminina';
const productsFile = 'lib/data/products-futebol.ts';

/**
 * Padroniza nomes de arquivos
 */
function standardizeFileNames() {
  console.log('🔧 Padronizando nomes de arquivos...');
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`❌ Pasta não encontrada: ${imagesDir}`);
    return;
  }
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Total de imagens: ${imageFiles.length}`);
  
  // Mapeamento de correções
  const corrections = {
    'FlamengoFeminio2.jpg': 'FlamengoFeminino2.jpg',
    'FlamengoFeminio3.jpg': 'FlamengoFeminino3.jpg',
    'FlamengoRosaFeminio.jpg': 'FlamengoRosaFeminino.jpg',
    'FlamengoFeminioTreino4.png': 'FlamengoFemininoTreino4.png'
  };
  
  let correctedCount = 0;
  
  for (const [oldName, newName] of Object.entries(corrections)) {
    const oldPath = path.join(imagesDir, oldName);
    const newPath = path.join(imagesDir, newName);
    
    if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renomeado: ${oldName} -> ${newName}`);
        correctedCount++;
      } catch (error) {
        console.log(`❌ Erro ao renomear ${oldName}: ${error.message}`);
      }
    } else if (fs.existsSync(oldPath) && fs.existsSync(newPath)) {
      console.log(`⚠️  Arquivo já existe: ${newName}`);
    } else if (!fs.existsSync(oldPath)) {
      console.log(`⚠️  Arquivo não encontrado: ${oldName}`);
    }
  }
  
  return correctedCount;
}

/**
 * Atualiza referências no código
 */
function updateCodeReferences() {
  console.log('\n📝 Atualizando referências no código...');
  
  if (!fs.existsSync(productsFile)) {
    console.log('❌ Arquivo de produtos não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  let updatedContent = content;
  let updatedCount = 0;
  
  // Mapeamento de correções
  const corrections = {
    'FlamengoFeminio2.jpg': 'FlamengoFeminino2.jpg',
    'FlamengoFeminio3.jpg': 'FlamengoFeminino3.jpg',
    'FlamengoRosaFeminio.jpg': 'FlamengoRosaFeminino.jpg',
    'FlamengoFeminioTreino4.png': 'FlamengoFemininoTreino4.png'
  };
  
  for (const [oldName, newName] of Object.entries(corrections)) {
    const oldPath = `/images/Futebol/CamisasFutebolFeminina/${oldName}`;
    const newPath = `/images/Futebol/CamisasFutebolFeminina/${newName}`;
    
    if (updatedContent.includes(oldPath)) {
      updatedContent = updatedContent.replace(new RegExp(oldPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), newPath);
      console.log(`✅ Atualizado no código: ${oldName} -> ${newName}`);
      updatedCount++;
    }
  }
  
  if (updatedCount > 0) {
    // Fazer backup
    fs.writeFileSync(`${productsFile}.backup_standardize`, content, 'utf8');
    console.log(`📦 Backup criado: ${productsFile}.backup_standardize`);
    
    // Salvar arquivo atualizado
    fs.writeFileSync(productsFile, updatedContent, 'utf8');
    console.log(`📝 Arquivo atualizado com ${updatedCount} correções`);
  } else {
    console.log('ℹ️  Nenhuma correção necessária no código');
  }
  
  return updatedCount > 0;
}

/**
 * Verifica se as correções foram aplicadas
 */
function verifyCorrections() {
  console.log('\n🔍 Verificando correções...');
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Total de imagens: ${imageFiles.length}`);
  console.log('📋 Imagens disponíveis:');
  imageFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
  
  // Verificar se ainda há nomes inconsistentes
  const inconsistentFiles = imageFiles.filter(file => 
    file.includes('Feminio') && !file.includes('Treino')
  );
  
  if (inconsistentFiles.length > 0) {
    console.log(`⚠️  Ainda há ${inconsistentFiles.length} arquivos com nomes inconsistentes:`);
    inconsistentFiles.forEach(file => console.log(`  - ${file}`));
    return false;
  } else {
    console.log('✅ Todos os nomes estão padronizados!');
    return true;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🔧 Padronizando nomes de imagens...');
  console.log(`📁 Pasta: ${imagesDir}`);
  console.log('-'.repeat(60));

  // Padronizar nomes de arquivos
  const correctedFiles = standardizeFileNames();
  
  // Atualizar referências no código
  const updatedCode = updateCodeReferences();
  
  // Verificar correções
  const isStandardized = verifyCorrections();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Padronização concluída!');
  console.log(`📁 Arquivos renomeados: ${correctedFiles}`);
  console.log(`📝 Código atualizado: ${updatedCode ? 'Sim' : 'Não'}`);
  console.log(`🧹 Padronização: ${isStandardized ? 'Completa' : 'Parcial'}`);
  
  if (isStandardized) {
    console.log('🎉 Todos os nomes estão padronizados!');
  } else {
    console.log('⚠️  Alguns nomes ainda precisam ser verificados');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  standardizeFileNames, 
  updateCodeReferences, 
  verifyCorrections 
};
