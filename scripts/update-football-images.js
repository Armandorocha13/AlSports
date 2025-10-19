#!/usr/bin/env node

/**
 * Script para atualizar as imagens de futebol com as novas fotos
 */

const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Users/mando/OneDrive/Área de Trabalho/Futebol';
const targetDir = 'public/images/Futebol';

// Mapeamento das subpastas
const folderMapping = {
  'CamisaJogador': 'CamisaJogador',
  'Camisas23-24': 'Camisas23-24',
  'Camisas24-25': 'Camisas24-25',
  'Camisas25-26': 'Camisas25-26',
  'CamisasFutebolFeminina': 'CamisasFutebolFeminina',
  'CamisasFutebolRegatas': 'CamisasFutebolRegatas',
  'CamisasFutebolRetro': 'CamisasFutebolRetro',
  'ShortsFutebolMasculino': 'ShortsFutebolMasculino'
};

/**
 * Fazer backup das imagens atuais
 */
function backupCurrentImages() {
  console.log('📦 Fazendo backup das imagens atuais de futebol...');
  
  const backupDir = 'public/images_backup_futebol';
  
  if (fs.existsSync(targetDir)) {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copiar estrutura atual
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
    
    copyDirectory(targetDir, backupDir);
    console.log(`✅ Backup salvo em: ${backupDir}`);
  } else {
    console.log('ℹ️  Nenhuma imagem atual para fazer backup');
  }
}

/**
 * Copiar novas imagens
 */
function copyNewImages() {
  console.log('🔄 Copiando novas imagens de futebol...');
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Diretório fonte não encontrado: ${sourceDir}`);
    return false;
  }
  
  // Criar diretório de destino se não existir
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  let totalCopied = 0;
  
  // Processar cada subpasta
  Object.entries(folderMapping).forEach(([sourceFolder, targetFolder]) => {
    const sourcePath = path.join(sourceDir, sourceFolder);
    const targetPath = path.join(targetDir, targetFolder);
    
    if (fs.existsSync(sourcePath)) {
      console.log(`📁 Processando: ${sourceFolder} -> ${targetFolder}`);
      
      // Criar diretório de destino
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Copiar arquivos
      const files = fs.readdirSync(sourcePath, { withFileTypes: true });
      let folderCopied = 0;
      
      files.forEach(file => {
        if (file.isFile()) {
          const sourceFile = path.join(sourcePath, file.name);
          const targetFile = path.join(targetPath, file.name);
          
          try {
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`  ✅ ${file.name}`);
            folderCopied++;
            totalCopied++;
          } catch (error) {
            console.log(`  ❌ Erro ao copiar ${file.name}: ${error.message}`);
          }
        }
      });
      
      console.log(`  📊 ${folderCopied} arquivos copiados de ${sourceFolder}`);
    } else {
      console.log(`⚠️  Pasta não encontrada: ${sourceFolder}`);
    }
  });
  
  return totalCopied;
}

/**
 * Verificar estrutura final
 */
function verifyStructure() {
  console.log('🔍 Verificando estrutura final...');
  
  const subfolders = Object.values(folderMapping);
  let totalFiles = 0;
  
  subfolders.forEach(folder => {
    const folderPath = path.join(targetDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath, { withFileTypes: true });
      const imageFiles = files.filter(file => file.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name));
      totalFiles += imageFiles.length;
      console.log(`  📁 ${folder}: ${imageFiles.length} imagens`);
    } else {
      console.log(`  ❌ ${folder}: pasta não encontrada`);
    }
  });
  
  console.log(`📊 Total de imagens: ${totalFiles}`);
  return totalFiles;
}

/**
 * Função principal
 */
function main() {
  console.log('⚽ Atualizando imagens de futebol...');
  console.log(`📁 Fonte: ${sourceDir}`);
  console.log(`📁 Destino: ${targetDir}`);
  console.log('-'.repeat(50));

  // Fazer backup
  backupCurrentImages();

  // Copiar novas imagens
  const copied = copyNewImages();
  
  if (copied > 0) {
    // Verificar estrutura
    const totalFiles = verifyStructure();
    
    console.log('-'.repeat(50));
    console.log('✅ Atualização concluída!');
    console.log(`📊 ${copied} imagens copiadas`);
    console.log(`📁 Estrutura verificada: ${totalFiles} imagens totais`);
    console.log('🎉 Imagens de futebol atualizadas com sucesso!');
  } else {
    console.log('❌ Nenhuma imagem foi copiada');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { backupCurrentImages, copyNewImages, verifyStructure };
