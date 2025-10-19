#!/usr/bin/env node

/**
 * Script para atualizar os caminhos das imagens de futebol com base nos arquivos disponíveis
 */

const fs = require('fs');
const path = require('path');

const productsFile = 'lib/data/products-futebol.ts';

// Mapeamento de correções baseado nos arquivos disponíveis
const pathMappings = {
  // CamisaJogador
  '/images/Futebol/CamisaJogador/FlamengoJogador2.jpg': '/images/Futebol/CamisaJogador/JogadorFlamengo2.jpg',
  '/images/Futebol/CamisaJogador/(G).webp': '/images/Futebol/CamisaJogador/CamisaJogadorInglaterra.jpg',
  
  // CamisasFutebolFeminina
  '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino2.jpg': '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminio2.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminino3.jpg': '/images/Futebol/CamisasFutebolFeminina/FlamengoFeminio3.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FlamengoRosaFeminino.jpg': '/images/Futebol/CamisasFutebolFeminina/FlamengoRosaFeminio.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino1.jpg': '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminio1.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminio2.jpg': '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminio2.jpg',
  '/images/Futebol/CamisasFutebolFeminina/FluminenseFeminino3.jpg': '/images/Futebol/CamisasFutebolFeminina/FluminensFeminio3.jpg',
  
  // CamisasFutebolRetro
  '/images/Futebol/CamisasFutebolRetro/PSG98.png': '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg',
  '/images/Futebol/CamisasFutebolRetro/Brasil2018.webp': '/images/Futebol/CamisasFutebolRetro/Brasil2018.jpg',
  '/images/Futebol/CamisasFutebolRetro/BrasilTreino20211.jpg': '/images/Futebol/CamisasFutebolRetro/BrasilTreino2011.jpg',
  '/images/Futebol/CamisasFutebolRetro/PSG2020.jpg': '/images/Futebol/CamisasFutebolRetro/PSG2021.jpg',
  
  // Camisas25-26
  '/images/Futebol/Camisas25-26/Flamengo2-25-26 (2).jpg': '/images/Futebol/Camisas25-26/Flamengo2-25-26.jpg',
  '/images/Futebol/Camisas25-26/FlamengoTreino2-25-26.jpg': '/images/Futebol/Camisas25-26/FlamengoTreino25-26.jpg',
  '/images/Futebol/Camisas25-26/Inter25-26.png': '/images/Futebol/Camisas25-26/Inter25-26.jpg',
  
  // Camisas23-24
  '/images/Futebol/Camisas23-24/Flamengo23-24.webp': '/images/Futebol/Camisas23-24/Flamengo23-24.jpg',
  
  // Camisas24-25
  '/images/Futebol/Camisas24-25/Alnasser24-25.webp': '/images/Futebol/Camisas24-25/Alnasser24-25.jpg',
  '/images/Futebol/Camisas24-25/Brasil24-25.jpg': '/images/Futebol/Camisas24-25/Brasil24-25 (2).jpg',
  '/images/Futebol/Camisas24-25/Flamengo24-25.png': '/images/Futebol/Camisas24-25/Flamengo24-25.jpg',
  '/images/Futebol/Camisas24-25/FluminensePatch24-25.png': '/images/Futebol/Camisas24-25/FluminensePatch24-25.jpg',
  '/images/Futebol/Camisas24-25/RealMadrid24-25.webp': '/images/Futebol/Camisas24-25/RealMadrid24-25.jpg',
  '/images/Futebol/Camisas24-25/RealMadridTreino24-25.png': '/images/Futebol/Camisas24-25/RealMadridTreino24-25.jpg',
  '/images/Futebol/Camisas24-25/Vasco2-2425.webp': '/images/Futebol/Camisas24-25/Vasco2-2425.jpg',
  '/images/Futebol/Camisas24-25/VascoComemorativa24-25.jpg': '/images/Futebol/Camisas24-25/VascoComemorativa.jpg',
  
  // ShortFutebolFeminino
  '/images/Futebol/ShortFutebolFeminino/ShortFemininoFlamengo.jpg': '/images/Futebol/ShortsFutebolMasculino/ShortFlamengo1.jpg'
};

/**
 * Atualiza os caminhos das imagens no arquivo de produtos
 */
function updateImagePaths() {
  console.log('🔄 Atualizando caminhos das imagens de futebol...');
  
  let content = fs.readFileSync(productsFile, 'utf8');
  let updatedCount = 0;
  
  // Aplicar cada mapeamento
  Object.entries(pathMappings).forEach(([oldPath, newPath]) => {
    const oldPattern = `image: '${oldPath}'`;
    const newPattern = `image: '${newPath}'`;
    
    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPattern);
      console.log(`✅ Atualizado: ${oldPath} -> ${newPath}`);
      updatedCount++;
    }
  });
  
  // Salvar arquivo atualizado
  if (updatedCount > 0) {
    fs.writeFileSync(productsFile, content);
    console.log(`📝 Arquivo atualizado com ${updatedCount} correções`);
  } else {
    console.log('ℹ️  Nenhuma correção necessária');
  }
  
  return updatedCount;
}

/**
 * Verifica se os arquivos existem após a atualização
 */
function verifyUpdatedPaths() {
  console.log('\n🔍 Verificando caminhos após atualização...');
  
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
  console.log('⚽ Atualizando caminhos das imagens de futebol...');
  console.log(`📄 Arquivo: ${productsFile}`);
  console.log('-'.repeat(50));

  if (!fs.existsSync(productsFile)) {
    console.log(`❌ Arquivo não encontrado: ${productsFile}`);
    return;
  }

  // Fazer backup do arquivo original
  const backupFile = productsFile + '.backup';
  fs.copyFileSync(productsFile, backupFile);
  console.log(`📦 Backup criado: ${backupFile}`);

  // Atualizar caminhos
  const updatedCount = updateImagePaths();
  
  // Verificar resultado
  const result = verifyUpdatedPaths();

  console.log('\n' + '-'.repeat(50));
  console.log('✅ Atualização concluída!');
  console.log(`📊 Caminhos atualizados: ${updatedCount}`);
  console.log(`✅ Arquivos encontrados: ${result.foundCount}`);
  console.log(`❌ Arquivos não encontrados: ${result.notFoundCount}`);
  
  if (result.notFoundCount === 0) {
    console.log('🎉 Todos os caminhos estão corretos!');
  } else {
    console.log('⚠️  Alguns arquivos ainda não foram encontrados. Verifique manualmente.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { updateImagePaths, verifyUpdatedPaths };
