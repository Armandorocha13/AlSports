#!/usr/bin/env node

/**
 * Script para substituir as imagens originais pelas processadas com fundo branco
 */

const fs = require('fs');
const path = require('path');

const originalDir = 'public/images';
const processedDir = 'public/images_white_background';
const backupDir = 'public/images_backup';

/**
 * Fazer backup das imagens originais
 */
function backupOriginalImages() {
  console.log('📦 Fazendo backup das imagens originais...');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Copiar estrutura completa
  function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src, { withFileTypes: true });
    
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      
      if (file.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyDirectory(originalDir, backupDir);
  console.log(`✅ Backup salvo em: ${backupDir}`);
}

/**
 * Substituir imagens originais pelas processadas
 */
function replaceImages() {
  console.log('🔄 Substituindo imagens originais pelas processadas...');
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        processDirectory(fullPath);
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          // Calcular caminho da imagem processada
          const relativePath = path.relative(originalDir, fullPath);
          const processedPath = path.join(processedDir, relativePath);
          
          // Sempre procurar por .jpg (formato final)
          const processedPathJpg = processedPath.replace(/\.[^/.]+$/, '.jpg');
          
          if (fs.existsSync(processedPathJpg)) {
            // Substituir a imagem original
            fs.copyFileSync(processedPathJpg, fullPath);
            console.log(`✅ Substituído: ${path.basename(fullPath)}`);
          } else {
            console.log(`⚠️  Imagem processada não encontrada: ${path.basename(fullPath)}`);
          }
        }
      }
    }
  }
  
  processDirectory(originalDir);
}

/**
 * Função principal
 */
function main() {
  console.log('🖼️  Substituindo imagens por versões com fundo branco...');
  console.log(`📁 Imagens originais: ${originalDir}`);
  console.log(`📁 Imagens processadas: ${processedDir}`);
  console.log(`📁 Backup: ${backupDir}`);
  console.log('-'.repeat(50));

  // Verificar se os diretórios existem
  if (!fs.existsSync(originalDir)) {
    console.log(`❌ Diretório original não encontrado: ${originalDir}`);
    return;
  }

  if (!fs.existsSync(processedDir)) {
    console.log(`❌ Diretório processado não encontrado: ${processedDir}`);
    console.log('💡 Execute primeiro: node scripts/process-images-advanced.js');
    return;
  }

  // Fazer backup
  backupOriginalImages();

  // Substituir imagens
  replaceImages();

  console.log('-'.repeat(50));
  console.log('✅ Substituição concluída!');
  console.log(`📦 Backup das imagens originais em: ${backupDir}`);
  console.log('🎉 Todas as imagens agora têm fundo branco padronizado!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { backupOriginalImages, replaceImages };
