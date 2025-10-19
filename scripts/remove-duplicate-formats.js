#!/usr/bin/env node

/**
 * Script para remover imagens duplicadas por formato (mantendo apenas JPG)
 */

const fs = require('fs');
const path = require('path');

const footballDir = 'public/images/Futebol';

/**
 * Lista todas as imagens em uma pasta
 */
function getAllImages(dir) {
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
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          const baseName = path.basename(file.name, ext);
          images.push({
            path: fullPath,
            name: file.name,
            baseName: baseName,
            ext: ext,
            size: fs.statSync(fullPath).size,
            relativePath: path.relative('public', fullPath).replace(/\\/g, '/')
          });
        }
      }
    }
  }
  
  scanDirectory(dir);
  return images;
}

/**
 * Agrupa imagens por nome base
 */
function groupImagesByName(images) {
  const groups = new Map();
  
  for (const image of images) {
    if (!groups.has(image.baseName)) {
      groups.set(image.baseName, []);
    }
    groups.get(image.baseName).push(image);
  }
  
  return groups;
}

/**
 * Remove duplicatas mantendo apenas JPG
 */
function removeDuplicateFormats(groups) {
  console.log('🗑️  Removendo formatos duplicados (mantendo apenas JPG)...');
  
  let removedCount = 0;
  const removedFiles = [];
  const keptFiles = [];
  
  for (const [baseName, images] of groups) {
    if (images.length > 1) {
      console.log(`\n📝 Processando: ${baseName}`);
      
      // Ordenar por prioridade: JPG > JPEG > PNG > WEBP > GIF
      const priority = { '.jpg': 1, '.jpeg': 2, '.png': 3, '.webp': 4, '.gif': 5 };
      images.sort((a, b) => (priority[a.ext] || 999) - (priority[b.ext] || 999));
      
      const toKeep = images[0];
      const toRemove = images.slice(1);
      
      console.log(`  ✅ Mantendo: ${toKeep.name} (${toKeep.ext})`);
      keptFiles.push(toKeep);
      
      for (const file of toRemove) {
        try {
          console.log(`  🗑️  Removendo: ${file.name} (${file.ext})`);
          fs.unlinkSync(file.path);
          removedFiles.push(file);
          removedCount++;
        } catch (error) {
          console.log(`  ❌ Erro ao remover ${file.name}: ${error.message}`);
        }
      }
    } else {
      keptFiles.push(images[0]);
    }
  }
  
  return { removedCount, removedFiles, keptFiles };
}

/**
 * Verifica se há conflitos de caminhos no código
 */
function checkCodeConflicts(removedFiles) {
  console.log('\n🔍 Verificando conflitos no código...');
  
  const productsFile = 'lib/data/products-futebol.ts';
  if (!fs.existsSync(productsFile)) {
    console.log('⚠️  Arquivo de produtos não encontrado');
    return;
  }
  
  const content = fs.readFileSync(productsFile, 'utf8');
  let conflicts = 0;
  
  for (const file of removedFiles) {
    const imagePath = `/images/Futebol/${file.relativePath.split('/').slice(2).join('/')}`;
    
    if (content.includes(imagePath)) {
      console.log(`⚠️  Conflito encontrado: ${imagePath} (arquivo removido)`);
      conflicts++;
    }
  }
  
  if (conflicts === 0) {
    console.log('✅ Nenhum conflito encontrado no código');
  } else {
    console.log(`⚠️  ${conflicts} conflitos encontrados no código`);
  }
}

/**
 * Gera relatório de limpeza
 */
function generateReport(removedFiles, keptFiles) {
  const reportPath = path.join(footballDir, 'format-cleanup-report.txt');
  
  const report = `
RELATÓRIO DE LIMPEZA DE FORMATOS DE IMAGENS
==========================================

Data: ${new Date().toLocaleString()}
Diretório: ${footballDir}

ARQUIVOS REMOVIDOS (${removedFiles.length}):
${removedFiles.map(file => `- ${file.name} (${file.ext}) - ${file.size} bytes`).join('\n')}

ARQUIVOS MANTIDOS (${keptFiles.length}):
${keptFiles.map(file => `- ${file.name} (${file.ext}) - ${file.size} bytes`).join('\n')}

ESTATÍSTICAS:
- Total removido: ${removedFiles.length} arquivos
- Total mantido: ${keptFiles.length} arquivos
- Espaço liberado: ${removedFiles.reduce((total, file) => total + file.size, 0)} bytes
- Formato preferido: JPG

PRÓXIMOS PASSOS:
1. Verificar se o site carrega corretamente
2. Fazer commit das mudanças
3. Testar todas as funcionalidades
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);
}

/**
 * Função principal
 */
function main() {
  console.log('🧹 Removendo formatos duplicados de imagens de futebol...');
  console.log(`📁 Diretório: ${footballDir}`);
  console.log('-'.repeat(60));

  if (!fs.existsSync(footballDir)) {
    console.log(`❌ Diretório não encontrado: ${footballDir}`);
    return;
  }

  // 1. Analisar todas as imagens
  console.log('📊 Analisando imagens...');
  const images = getAllImages(footballDir);
  console.log(`📊 Encontradas ${images.length} imagens`);

  // 2. Agrupar por nome base
  const groups = groupImagesByName(images);
  const duplicateGroups = Array.from(groups.entries()).filter(([name, files]) => files.length > 1);
  
  console.log(`🔄 ${duplicateGroups.length} grupos com duplicatas encontrados`);

  // 3. Remover duplicatas
  const { removedCount, removedFiles, keptFiles } = removeDuplicateFormats(groups);

  // 4. Verificar conflitos
  checkCodeConflicts(removedFiles);

  // 5. Gerar relatório
  generateReport(removedFiles, keptFiles);

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Limpeza de formatos concluída!');
  console.log(`🗑️  ${removedCount} arquivos removidos`);
  console.log(`📊 ${keptFiles.length} imagens mantidas`);
  console.log(`💾 Espaço liberado: ${removedFiles.reduce((total, file) => total + file.size, 0)} bytes`);
  console.log('🎉 Apenas formatos JPG mantidos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { getAllImages, groupImagesByName, removeDuplicateFormats };
