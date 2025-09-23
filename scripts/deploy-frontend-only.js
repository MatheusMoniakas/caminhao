const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando deploy do frontend para Netlify...');

// Verificar se o build do frontend existe
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (!fs.existsSync(frontendDistPath)) {
  console.log('❌ Build do frontend não encontrado. Execute "npm run build:frontend" primeiro.');
  process.exit(1);
}

console.log('✅ Build do frontend encontrado em:', frontendDistPath);

// Verificar arquivos essenciais
const essentialFiles = ['index.html', 'assets'];
const missingFiles = essentialFiles.filter(file => {
  const filePath = path.join(frontendDistPath, file);
  return !fs.existsSync(filePath);
});

if (missingFiles.length > 0) {
  console.log('❌ Arquivos essenciais não encontrados:', missingFiles);
  process.exit(1);
}

console.log('✅ Todos os arquivos essenciais estão presentes');

// Verificar tamanho do build
const stats = fs.statSync(frontendDistPath);
console.log('📦 Tamanho do build:', (stats.size / 1024 / 1024).toFixed(2), 'MB');

console.log('🎉 Frontend pronto para deploy no Netlify!');
console.log('');
console.log('📋 Instruções para deploy:');
console.log('1. Faça commit e push das alterações');
console.log('2. No Netlify, configure:');
console.log('   - Build command: npm run build');
console.log('   - Publish directory: frontend/dist');
console.log('   - Base directory: frontend');
console.log('3. Adicione as variáveis de ambiente no Netlify:');
console.log('   - VITE_API_URL: https://seu-backend-url.com/api');
console.log('');
console.log('🔗 Ou use o comando: npm run prepare-deploy');
