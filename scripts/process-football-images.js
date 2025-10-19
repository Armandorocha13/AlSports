#!/usr/bin/env node

/**
 * Script para processar as novas imagens de futebol com fundo branco
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const footballDir = 'public/images/Futebol';

// Extensões de imagem suportadas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];

/**
 * Processa uma imagem para fundo branco
 */
async function processImageWithWhiteBackground(inputPath, outputPath) {
  try {
    // Criar diretório de saída se necessário
    const outputDirPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    // Processar a imagem com Sharp
    await sharp(inputPath)
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // Fundo branco
      .jpeg({ 
        quality: 95, 
        progressive: true,
        mozjpeg: true 
      })
      .toFile(outputPath);

    console.log(`✅ Processado: ${path.basename(inputPath)}`);
    return true;
  } catch (error) {
    console.log(`❌ Erro ao processar ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

/**
 * Lista todas as imagens de futebol recursivamente
 */
function getAllFootballImages(dir) {
  const images = [];
  
  function scanDirectory(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
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
 * Processa todas as imagens de futebol
 */
async function processAllFootballImages() {
  console.log('⚽ Processando imagens de futebol com fundo branco...');
  console.log(`📁 Diretório: ${footballDir}`);
  console.log('-'.repeat(50));

  // Verificar se o diretório existe
  if (!fs.existsSync(footballDir)) {
    console.log(`❌ Diretório não encontrado: ${footballDir}`);
    return;
  }

  // Listar todas as imagens
  console.log('🔍 Procurando imagens de futebol...');
  const images = getAllFootballImages(footballDir);
  console.log(`📊 Encontradas ${images.length} imagens`);

  if (images.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada');
    return;
  }

  // Processar imagens
  console.log('🔄 Processando imagens com fundo branco...');
  let processed = 0;
  
  for (const imagePath of images) {
    // Processar no mesmo local (substituir)
    const outputPath = imagePath.replace(/\.[^/.]+$/, '.jpg');
    
    if (await processImageWithWhiteBackground(imagePath, outputPath)) {
      processed++;
    }
  }

  // Gerar relatório
  const reportPath = path.join(footballDir, 'processing-report.txt');
  const report = `
RELATÓRIO DE PROCESSAMENTO DE IMAGENS DE FUTEBOL
================================================

Data: ${new Date().toLocaleString()}
Total de imagens encontradas: ${images.length}
Imagens processadas com sucesso: ${processed}
Taxa de sucesso: ${((processed / images.length) * 100).toFixed(2)}%

Diretório processado: ${footballDir}

PROCESSAMENTO REALIZADO:
- Todas as imagens foram convertidas para JPG
- Fundos foram padronizados para branco (RGB: 255, 255, 255)
- Qualidade otimizada para web (95% JPEG)
- Compressão progressiva aplicada

IMAGENS DE FUTEBOL AGORA TÊM FUNDO BRANCO PADRONIZADO!
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log('-'.repeat(50));
  console.log(`✅ Processamento concluído!`);
  console.log(`📊 Imagens processadas: ${processed}/${images.length}`);
  console.log('🎉 Imagens de futebol com fundo branco padronizado!');
  
  if (processed < images.length) {
    console.log(`⚠️  ${images.length - processed} imagens não puderam ser processadas`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  processAllFootballImages().catch(console.error);
}

module.exports = { processImageWithWhiteBackground, getAllFootballImages };
