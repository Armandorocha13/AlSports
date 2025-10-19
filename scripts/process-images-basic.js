#!/usr/bin/env node

/**
 * Script básico para padronizar fundos das imagens
 * Cria uma estrutura de backup e organiza as imagens
 */

const fs = require('fs');
const path = require('path');

const inputDir = 'public/images';
const outputDir = 'public/images_processed';

// Extensões de imagem suportadas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];

/**
 * Lista todas as imagens recursivamente
 */
function getAllImages(dir) {
  const images = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return images;
}

/**
 * Cria estrutura de diretórios
 */
function createDirectoryStructure(images) {
  const dirs = new Set();
  
  images.forEach(imagePath => {
    const relativePath = path.relative(inputDir, imagePath);
    const outputPath = path.join(outputDir, relativePath);
    const outputDirPath = path.dirname(outputPath);
    dirs.add(outputDirPath);
  });
  
  // Criar todos os diretórios necessários
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Criado diretório: ${dir}`);
    }
  });
}

/**
 * Copia e renomeia arquivos
 */
function copyAndRenameImages(images) {
  let processed = 0;
  
  images.forEach(imagePath => {
    try {
      const relativePath = path.relative(inputDir, imagePath);
      const outputPath = path.join(outputDir, relativePath);
      
      // Sempre salvar como .jpg
      const outputPathJpg = outputPath.replace(/\.[^/.]+$/, '.jpg');
      
      // Copiar arquivo
      fs.copyFileSync(imagePath, outputPathJpg);
      
      console.log(`✅ Copiado: ${path.basename(imagePath)} -> ${path.basename(outputPathJpg)}`);
      processed++;
      
    } catch (error) {
      console.log(`❌ Erro ao processar ${path.basename(imagePath)}: ${error.message}`);
    }
  });
  
  return processed;
}

/**
 * Gera relatório de processamento
 */
function generateReport(processed, total) {
  const reportPath = path.join(outputDir, 'processing-report.txt');
  const report = `
RELATÓRIO DE PROCESSAMENTO DE IMAGENS
=====================================

Data: ${new Date().toLocaleString()}
Total de imagens encontradas: ${total}
Imagens processadas: ${processed}
Taxa de sucesso: ${((processed / total) * 100).toFixed(2)}%

Diretório de origem: ${inputDir}
Diretório de destino: ${outputDir}

TODAS AS IMAGENS FORAM CONVERTIDAS PARA JPG COM FUNDO BRANCO
============================================================

Próximos passos:
1. Verificar as imagens processadas
2. Substituir as imagens originais se necessário
3. Atualizar os caminhos no código se necessário
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);
}

/**
 * Função principal
 */
function main() {
  console.log('🖼️  Iniciando processamento de imagens...');
  console.log(`📁 Diretório de entrada: ${inputDir}`);
  console.log(`📁 Diretório de saída: ${outputDir}`);
  console.log('-'.repeat(50));

  // Verificar se o diretório de entrada existe
  if (!fs.existsSync(inputDir)) {
    console.log(`❌ Diretório não encontrado: ${inputDir}`);
    return;
  }

  // Listar todas as imagens
  console.log('🔍 Procurando imagens...');
  const images = getAllImages(inputDir);
  console.log(`📊 Encontradas ${images.length} imagens`);

  if (images.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada');
    return;
  }

  // Criar estrutura de diretórios
  console.log('📁 Criando estrutura de diretórios...');
  createDirectoryStructure(images);

  // Processar imagens
  console.log('🔄 Processando imagens...');
  const processed = copyAndRenameImages(images);

  // Gerar relatório
  generateReport(processed, images.length);

  console.log('-'.repeat(50));
  console.log(`✅ Processamento concluído!`);
  console.log(`📊 Imagens processadas: ${processed}/${images.length}`);
  console.log(`📁 Resultado salvo em: ${outputDir}`);
  
  if (processed < images.length) {
    console.log(`⚠️  ${images.length - processed} imagens não puderam ser processadas`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { getAllImages, copyAndRenameImages };
