#!/usr/bin/env node

/**
 * Script para corrigir caminhos específicos das imagens de futebol
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';

// Mapeamento específico de correções baseado nos arquivos disponíveis
const specificCorrections = {
  // CamisaJogador - PNG disponível
  '/images/Futebol/CamisaJogador/FlamengoJogador.jpg': '/images/Futebol/CamisaJogador/FlamengoJogador.png',
  '/images/Futebol/CamisaJogador/CamisaJogadorInglaterra.jpg': '/images/Futebol/CamisaJogador/(G).png',
  
  // CamisasFutebolRetro - PNG disponível
  '/images/Futebol/CamisasFutebolRetro/Flamengo2009.jpg': '/images/Futebol/CamisasFutebolRetro/Flamengo2009.png',
  '/images/Futebol/CamisasFutebolRetro/Parma95.jpg': '/images/Futebol/CamisasFutebolRetro/Parma95.png',
  '/images/Futebol/CamisasFutebolRetro/Brasil2018.jpg': '/images/Futebol/CamisasFutebolRetro/Brasil2018.png',
  '/images/Futebol/CamisasFutebolRetro/Brasil2019.jpg': '/images/Futebol/CamisasFutebolRetro/Brasil2019.png',
  '/images/Futebol/CamisasFutebolRetro/Brasil94.jpg': '/images/Futebol/CamisasFutebolRetro/Brasil94.png',
  '/images/Futebol/CamisasFutebolRetro/BrasilRetro.jpg': '/images/Futebol/CamisasFutebolRetro/BrasilRetro.png',
  '/images/Futebol/CamisasFutebolRetro/BrasilTreino2011.jpg': '/images/Futebol/CamisasFutebolRetro/BrasilTreino2011.png',
  '/images/Futebol/CamisasFutebolRetro/ManUnited2021.jpg': '/images/Futebol/CamisasFutebolRetro/ManUnited2021.png',
  '/images/Futebol/CamisasFutebolRetro/ManUnited2022.jpg': '/images/Futebol/CamisasFutebolRetro/ManUnited2022.png',
  '/images/Futebol/CamisasFutebolRetro/PSG2021Camisa2.jpg': '/images/Futebol/CamisasFutebolRetro/PSG2021Camisa2.png',
  
  // CamisasFutebolRegatas - PNG disponível
  '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.jpg': '/images/Futebol/CamisasFutebolRegatas/RegataFlamengoTreino.png',
  
  // CamisasFutebolFeminina - PNG disponível
  '/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.jpg': '/images/Futebol/CamisasFutebolFeminina/FluminensePatchFeminio3.png',
  
  // ShortsFutebolMasculino - PNG disponível
  '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.jpg': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.png',
  '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo2.jpg': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo2.png',
  '/images/Futebol/ShortsFutebolMasculino/ShortFlamengoTreino.jpg': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengoTreino.png',
  
  // Camisas25-26 - PNG/WEBP disponível
  '/images/Futebol/Camisas25-26/Arsenal25-26.jpg': '/images/Futebol/Camisas25-26/Arsenal25-26.webp',
  '/images/Futebol/Camisas25-26/Barcelona25-26.jpg': '/images/Futebol/Camisas25-26/Barcelona25-26.png',
  '/images/Futebol/Camisas25-26/Bayer25-26.jpg': '/images/Futebol/Camisas25-26/Bayer25-26.png',
  '/images/Futebol/Camisas25-26/Chelsea25-26.jpg': '/images/Futebol/Camisas25-26/Chelsea25-26.png',
  
  // Camisas24-25 - PNG disponível
  '/images/Futebol/Camisas24-25/BrasilComemorativa24-25.jpg': '/images/Futebol/Camisas24-25/BrasilComemorativa24-25.png'
};

/**
 * Aplica as correções específicas
 */
function applySpecificCorrections() {
  console.log('🔧 Aplicando correções específicas...');
  
  let content = fs.readFileSync(productsFile, 'utf8');
  let correctedCount = 0;
  
  // Aplicar cada correção
  Object.entries(specificCorrections).forEach(([oldPath, newPath]) => {
    const oldPattern = `image: '${oldPath}'`;
    const newPattern = `image: '${newPath}'`;
    
    if (content.includes(oldPattern)) {
      console.log(`✅ Corrigindo: ${oldPath} -> ${newPath}`);
      content = content.replace(oldPattern, newPattern);
      correctedCount++;
    }
  });
  
  // Salvar arquivo atualizado
  if (correctedCount > 0) {
    fs.writeFileSync(productsFile, content);
    console.log(`📝 ${correctedCount} caminhos corrigidos`);
  } else {
    console.log('ℹ️  Nenhuma correção necessária');
  }
  
  return correctedCount;
}

/**
 * Verifica se todos os caminhos estão corretos
 */
function verifyAllPaths() {
  console.log('\n🔍 Verificando todos os caminhos após correção...');
  
  const content = fs.readFileSync(productsFile, 'utf8');
  const regex = /image:\s*['"`]([^'"`]+)['"`]/g;
  let match;
  let foundCount = 0;
  let notFoundCount = 0;
  
  while ((match = regex.exec(content)) !== null) {
    if (match[1].includes('/images/Futebol/')) {
      const fullPath = path.join('public', match[1]);
      if (fs.existsSync(fullPath)) {
        foundCount++;
        console.log(`✅ ${match[1]}`);
      } else {
        notFoundCount++;
        console.log(`❌ ${match[1]}`);
      }
    }
  }
  
  console.log(`\n📊 Resultado: ${foundCount} encontrados, ${notFoundCount} não encontrados`);
  return { foundCount, notFoundCount };
}

/**
 * Função principal
 */
function main() {
  console.log('🔧 Corrigindo caminhos específicos das imagens de futebol...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log('-'.repeat(60));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  // Fazer backup
  const backupFile = productsFile + '.backup_specific_fix';
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Aplicar correções
  const correctedCount = applySpecificCorrections();
  
  // Verificar resultado
  const result = verifyAllPaths();

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Correção específica concluída!');
  console.log(`📊 Caminhos corrigidos: ${correctedCount}`);
  console.log(`✅ Arquivos encontrados: ${result.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.notFoundCount === 0) {
    console.log('🎉 Todos os caminhos estão corretos!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { applySpecificCorrections, verifyAllPaths };
