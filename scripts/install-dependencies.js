#!/usr/bin/env node

/**
 * Script para instalar dependências necessárias para processamento de imagens
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('📦 Instalando dependências para processamento de imagens...');

try {
  // Verificar se sharp já está instalado
  try {
    require.resolve('sharp');
    console.log('✅ Sharp já está instalado');
  } catch (e) {
    console.log('📥 Instalando Sharp...');
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('✅ Sharp instalado com sucesso');
  }

  // Verificar se jimp está instalado (alternativa mais leve)
  try {
    require.resolve('jimp');
    console.log('✅ Jimp já está instalado');
  } catch (e) {
    console.log('📥 Instalando Jimp...');
    execSync('npm install jimp', { stdio: 'inherit' });
    console.log('✅ Jimp instalado com sucesso');
  }

  console.log('🎉 Todas as dependências estão prontas!');
  console.log('💡 Agora você pode executar o processamento de imagens');

} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}
