#!/usr/bin/env node

/**
 * Script para importar e organizar as novas imagens de futebol
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
  
  const backupDir = 'public/images_backup_futebol_' + new Date().toISOString().slice(0, 10);
  
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
 * Limpar diretório de destino
 */
function cleanTargetDirectory() {
  console.log('🧹 Limpando diretório de destino...');
  
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // Criar diretório limpo
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✅ Diretório limpo e criado');
}

/**
 * Copiar novas imagens
 */
function copyNewImages() {
  console.log('🔄 Importando novas imagens de futebol...');
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Diretório fonte não encontrado: ${sourceDir}`);
    return false;
  }
  
  let totalCopied = 0;
  const categoryStats = {};
  
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
      
      categoryStats[targetFolder] = folderCopied;
      console.log(`  📊 ${folderCopied} arquivos copiados de ${sourceFolder}`);
    } else {
      console.log(`⚠️  Pasta não encontrada: ${sourceFolder}`);
      categoryStats[targetFolder] = 0;
    }
  });
  
  return { totalCopied, categoryStats };
}

/**
 * Verificar estrutura final
 */
function verifyStructure() {
  console.log('🔍 Verificando estrutura final...');
  
  const subfolders = Object.values(folderMapping);
  let totalFiles = 0;
  const structure = {};
  
  subfolders.forEach(folder => {
    const folderPath = path.join(targetDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath, { withFileTypes: true });
      const imageFiles = files.filter(file => file.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name));
      totalFiles += imageFiles.length;
      structure[folder] = imageFiles.length;
      console.log(`  📁 ${folder}: ${imageFiles.length} imagens`);
    } else {
      console.log(`  ❌ ${folder}: pasta não encontrada`);
      structure[folder] = 0;
    }
  });
  
  console.log(`📊 Total de imagens: ${totalFiles}`);
  return { totalFiles, structure };
}

/**
 * Gerar relatório de importação
 */
function generateImportReport(stats, structure) {
  const reportPath = path.join(targetDir, 'import-report.txt');
  const report = `
RELATÓRIO DE IMPORTAÇÃO DE IMAGENS DE FUTEBOL
=============================================

Data: ${new Date().toLocaleString()}
Diretório fonte: ${sourceDir}
Diretório destino: ${targetDir}

ESTATÍSTICAS DE IMPORTAÇÃO:
- Total de imagens importadas: ${stats.totalCopied}
- Categorias processadas: ${Object.keys(stats.categoryStats).length}

DETALHES POR CATEGORIA:
${Object.entries(stats.categoryStats).map(([cat, count]) => `- ${cat}: ${count} imagens`).join('\n')}

ESTRUTURA FINAL:
${Object.entries(structure).map(([cat, count]) => `- ${cat}: ${count} imagens`).join('\n')}

PRÓXIMOS PASSOS:
1. Processar imagens com fundo branco
2. Atualizar caminhos no código
3. Verificar funcionamento no site

IMPORTANTE:
- Backup das imagens antigas foi criado
- Todas as imagens foram organizadas por categoria
- Estrutura de pastas mantida conforme padrão
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);
}

/**
 * Função principal
 */
function main() {
  console.log('⚽ Importando imagens de futebol...');
  console.log(`📁 Fonte: ${sourceDir}`);
  console.log(`📁 Destino: ${targetDir}`);
  console.log('-'.repeat(50));

  // Verificar se o diretório de entrada existe
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Diretório fonte não encontrado: ${sourceDir}`);
    return;
  }

  // Fazer backup
  backupCurrentImages();

  // Limpar diretório de destino
  cleanTargetDirectory();

  // Copiar novas imagens
  const stats = copyNewImages();
  
  if (stats.totalCopied > 0) {
    // Verificar estrutura
    const structure = verifyStructure();
    
    // Gerar relatório
    generateImportReport(stats, structure);
    
    console.log('-'.repeat(50));
    console.log('✅ Importação concluída!');
    console.log(`📊 ${stats.totalCopied} imagens importadas`);
    console.log(`📁 Estrutura verificada: ${structure.totalFiles} imagens totais`);
    console.log('🎉 Imagens de futebol atualizadas com sucesso!');
  } else {
    console.log('❌ Nenhuma imagem foi importada');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { backupCurrentImages, copyNewImages, verifyStructure };
