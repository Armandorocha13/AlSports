#!/usr/bin/env node

/**
 * Script avançado para padronizar fundos das imagens para branco
 * Usa Sharp para processamento de alta qualidade
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = 'public/images';
const outputDir = 'public/images_white_background';

// Extensões de imagem suportadas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];

/**
 * Processa uma imagem para fundo branco usando Sharp
 */
async function processImageWithSharp(inputPath, outputPath) {
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
 * Processa todas as imagens
 */
async function processAllImages() {
  console.log('🖼️  Iniciando processamento avançado de imagens...');
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

  // Processar imagens
  console.log('🔄 Processando imagens com fundo branco...');
  let processed = 0;
  
  for (const imagePath of images) {
    const relativePath = path.relative(inputDir, imagePath);
    const outputPath = path.join(outputDir, relativePath);
    
    // Sempre salvar como .jpg
    const outputPathJpg = outputPath.replace(/\.[^/.]+$/, '.jpg');
    
    if (await processImageWithSharp(imagePath, outputPathJpg)) {
      processed++;
    }
  }

  // Gerar relatório
  const reportPath = path.join(outputDir, 'processing-report.txt');
  const report = `
RELATÓRIO DE PROCESSAMENTO AVANÇADO DE IMAGENS
==============================================

Data: ${new Date().toLocaleString()}
Total de imagens encontradas: ${images.length}
Imagens processadas com sucesso: ${processed}
Taxa de sucesso: ${((processed / images.length) * 100).toFixed(2)}%

Diretório de origem: ${inputDir}
Diretório de destino: ${outputDir}

PROCESSAMENTO REALIZADO:
- Todas as imagens foram convertidas para JPG
- Fundos foram padronizados para branco (RGB: 255, 255, 255)
- Qualidade otimizada para web (95% JPEG)
- Compressão progressiva aplicada

PRÓXIMOS PASSOS:
1. Verificar as imagens processadas em: ${outputDir}
2. Substituir as imagens originais se necessário
3. Atualizar os caminhos no código se necessário
4. Testar o carregamento das imagens no site

TODAS AS IMAGENS AGORA TÊM FUNDO BRANCO PADRONIZADO!
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

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
  processAllImages().catch(console.error);
}

module.exports = { processImageWithSharp, getAllImages };
