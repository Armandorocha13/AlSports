#!/usr/bin/env node

/**
 * Script para limpeza dos diretórios temporários
 */

const fs = require('fs');
const path = require('path');

const tempDirs = [
  'public/images_processed',
  'public/images_white_background'
];

/**
 * Remover diretório recursivamente
 */
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🗑️  Removido: ${dir}`);
    return true;
  }
  return false;
}

/**
 * Função principal
 */
function main() {
  console.log('🧹 Limpando diretórios temporários...');
  console.log('-'.repeat(50));

  let removed = 0;
  
  tempDirs.forEach(dir => {
    if (removeDirectory(dir)) {
      removed++;
    }
  });

  console.log('-'.repeat(50));
  console.log(`✅ Limpeza concluída! ${removed} diretórios removidos`);
  console.log('📦 Backup das imagens originais mantido em: public/images_backup');
  console.log('🎉 Projeto limpo e organizado!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { removeDirectory };
