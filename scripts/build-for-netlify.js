const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Netlify...');

try {
  // Limpar pastas de build
  console.log('🧹 Cleaning build directories...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }

  // Fazer build
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log('📁 Output directory: out/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
