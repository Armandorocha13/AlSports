#!/usr/bin/env node

/**
 * Script para limpar imagens duplicadas da pasta futebol
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const footballDir = 'public/images/Futebol';

/**
 * Calcula hash MD5 de um arquivo
 */
function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

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
          images.push({
            path: fullPath,
            name: file.name,
            size: fs.statSync(fullPath).size,
            ext: ext,
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
 * Encontra imagens duplicadas por hash
 */
function findDuplicateImages(images) {
  const hashMap = new Map();
  const duplicates = [];
  
  console.log('🔍 Analisando imagens para encontrar duplicatas...');
  
  for (const image of images) {
    try {
      const hash = calculateFileHash(image.path);
      
      if (hashMap.has(hash)) {
        const existing = hashMap.get(hash);
        duplicates.push({
          original: existing,
          duplicate: image,
          hash: hash
        });
        console.log(`🔄 Duplicata encontrada: ${image.name} (igual a ${existing.name})`);
      } else {
        hashMap.set(hash, image);
      }
    } catch (error) {
      console.log(`❌ Erro ao processar ${image.name}: ${error.message}`);
    }
  }
  
  return duplicates;
}

/**
 * Encontra nomes similares
 */
function findSimilarNames(images) {
  const nameMap = new Map();
  const similarNames = [];
  
  console.log('\n🔍 Analisando nomes similares...');
  
  for (const image of images) {
    const baseName = path.basename(image.name, image.ext).toLowerCase();
    const normalizedName = baseName.replace(/[^a-z0-9]/g, '');
    
    if (nameMap.has(normalizedName)) {
      const existing = nameMap.get(normalizedName);
      similarNames.push({
        original: existing,
        similar: image,
        normalizedName: normalizedName
      });
      console.log(`📝 Nome similar: ${image.name} (similar a ${existing.name})`);
    } else {
      nameMap.set(normalizedName, image);
    }
  }
  
  return similarNames;
}

/**
 * Remove arquivos duplicados
 */
function removeDuplicates(duplicates) {
  console.log('\n🗑️  Removendo arquivos duplicados...');
  
  let removedCount = 0;
  const removedFiles = [];
  
  for (const duplicate of duplicates) {
    try {
      // Manter o arquivo com nome mais "limpo" ou menor
      const keepOriginal = duplicate.original.name.length <= duplicate.duplicate.name.length;
      const toRemove = keepOriginal ? duplicate.duplicate : duplicate.original;
      const toKeep = keepOriginal ? duplicate.original : duplicate.duplicate;
      
      console.log(`🗑️  Removendo: ${toRemove.name} (mantendo ${toKeep.name})`);
      
      fs.unlinkSync(toRemove.path);
      removedFiles.push(toRemove);
      removedCount++;
    } catch (error) {
      console.log(`❌ Erro ao remover ${duplicate.duplicate.name}: ${error.message}`);
    }
  }
  
  return { removedCount, removedFiles };
}

/**
 * Organiza estrutura de pastas
 */
function organizeStructure() {
  console.log('\n📁 Organizando estrutura de pastas...');
  
  const subfolders = [
    'CamisaJogador',
    'Camisas23-24',
    'Camisas24-25', 
    'Camisas25-26',
    'CamisasFutebolFeminina',
    'CamisasFutebolRegatas',
    'CamisasFutebolRetro',
    'ShortsFutebolMasculino'
  ];
  
  const structure = {};
  
  subfolders.forEach(folder => {
    const folderPath = path.join(footballDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
      );
      
      structure[folder] = imageFiles.length;
      console.log(`📂 ${folder}: ${imageFiles.length} imagens`);
    }
  });
  
  return structure;
}

/**
 * Gera relatório de limpeza
 */
function generateCleanupReport(images, duplicates, similarNames, removedFiles, structure) {
  const reportPath = path.join(footballDir, 'cleanup-report.txt');
  
  const report = `
RELATÓRIO DE LIMPEZA DE IMAGENS DE FUTEBOL
==========================================

Data: ${new Date().toLocaleString()}
Diretório: ${footballDir}

ESTATÍSTICAS INICIAIS:
- Total de imagens encontradas: ${images.length}
- Duplicatas por hash: ${duplicates.length}
- Nomes similares: ${similarNames.length}

ARQUIVOS REMOVIDOS:
${removedFiles.map(file => `- ${file.name} (${file.relativePath})`).join('\n')}

ESTRUTURA FINAL:
${Object.entries(structure).map(([folder, count]) => `- ${folder}: ${count} imagens`).join('\n')}

RESULTADO:
- Arquivos removidos: ${removedFiles.length}
- Imagens restantes: ${images.length - removedFiles.length}
- Espaço liberado: ${removedFiles.reduce((total, file) => total + file.size, 0)} bytes

PRÓXIMOS PASSOS:
1. Verificar se os caminhos no código ainda estão corretos
2. Testar carregamento das imagens no site
3. Fazer commit das mudanças se necessário
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);
}

/**
 * Função principal
 */
function main() {
  console.log('🧹 Limpando imagens duplicadas da pasta futebol...');
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

  // 2. Encontrar duplicatas por hash
  const duplicates = findDuplicateImages(images);
  console.log(`🔄 ${duplicates.length} duplicatas encontradas por hash`);

  // 3. Encontrar nomes similares
  const similarNames = findSimilarNames(images);
  console.log(`📝 ${similarNames.length} nomes similares encontrados`);

  // 4. Remover duplicatas
  const { removedCount, removedFiles } = removeDuplicates(duplicates);

  // 5. Organizar estrutura
  const structure = organizeStructure();

  // 6. Gerar relatório
  generateCleanupReport(images, duplicates, similarNames, removedFiles, structure);

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Limpeza concluída!');
  console.log(`🗑️  ${removedCount} arquivos removidos`);
  console.log(`📊 ${images.length - removedCount} imagens restantes`);
  console.log(`💾 Espaço liberado: ${removedFiles.reduce((total, file) => total + file.size, 0)} bytes`);
  console.log('🎉 Pasta futebol organizada e limpa!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { 
  getAllImages, 
  findDuplicateImages, 
  findSimilarNames, 
  removeDuplicates 
};
