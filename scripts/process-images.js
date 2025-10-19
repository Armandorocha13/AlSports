#!/usr/bin/env node

/**
 * Script para padronizar fundos das imagens para branco
 * Usa sharp para processamento de imagens
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Verificar se sharp está instalado
try {
  require.resolve('sharp');
} catch (e) {
  console.log('❌ Sharp não está instalado. Instalando...');
  console.log('Execute: npm install sharp');
  process.exit(1);
}

const inputDir = 'public/images';
const outputDir = 'public/images_processed';

// Extensões de imagem suportadas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];

/**
 * Processa uma imagem para fundo branco
 */
async function processImage(inputPath, outputPath) {
  try {
    // Criar diretório de saída se necessário
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Processar a imagem
    await sharp(inputPath)
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // Fundo branco
      .jpeg({ quality: 95, progressive: true })
      .toFile(outputPath);

    console.log(`✅ Processado: ${path.basename(inputPath)}`);
    return true;
  } catch (error) {
    console.log(`❌ Erro ao processar ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

/**
 * Processa recursivamente um diretório
 */
async function processDirectory(dir) {
  let processed = 0;
  let total = 0;

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Processar subdiretório recursivamente
      const subResult = await processDirectory(fullPath);
      processed += subResult.processed;
      total += subResult.total;
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      
      if (imageExtensions.includes(ext)) {
        total++;
        
        // Calcular caminho de saída
        const relativePath = path.relative(inputDir, fullPath);
        const outputPath = path.join(outputDir, relativePath);
        
        // Sempre salvar como .jpg
        const outputPathJpg = outputPath.replace(/\.[^/.]+$/, '.jpg');
        
        if (await processImage(fullPath, outputPathJpg)) {
          processed++;
        }
      }
    }
  }

  return { processed, total };
}

/**
 * Função principal
 */
async function main() {
  console.log('🖼️  Iniciando processamento de imagens...');
  console.log(`📁 Diretório de entrada: ${inputDir}`);
  console.log(`📁 Diretório de saída: ${outputDir}`);
  console.log('-'.repeat(50));

  // Verificar se o diretório de entrada existe
  if (!fs.existsSync(inputDir)) {
    console.log(`❌ Diretório não encontrado: ${inputDir}`);
    return;
  }

  // Processar todas as imagens
  const result = await processDirectory(inputDir);

  console.log('-'.repeat(50));
  console.log(`✅ Processamento concluído!`);
  console.log(`📊 Imagens processadas: ${result.processed}/${result.total}`);
  console.log(`📁 Resultado salvo em: ${outputDir}`);

  if (result.processed < result.total) {
    console.log(`⚠️  ${result.total - result.processed} imagens não puderam ser processadas`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processImage, processDirectory };
