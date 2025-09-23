const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testando build do backend...');

try {
  // Verificar se estamos no diretório correto
  const backendPath = path.join(__dirname, '../backend');
  if (!fs.existsSync(backendPath)) {
    throw new Error('Diretório backend não encontrado');
  }

  console.log('📁 Diretório backend encontrado');

  // Verificar se o package.json existe
  const packageJsonPath = path.join(backendPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json não encontrado no backend');
  }

  console.log('📦 package.json encontrado');

  // Verificar se o tsconfig.json existe
  const tsconfigPath = path.join(backendPath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    throw new Error('tsconfig.json não encontrado no backend');
  }

  console.log('⚙️ tsconfig.json encontrado');

  // Executar build
  console.log('🔨 Executando build...');
  execSync('npm run build', { 
    cwd: backendPath, 
    stdio: 'inherit' 
  });

  // Verificar se o build foi criado
  const distPath = path.join(backendPath, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Diretório dist não foi criado');
  }

  console.log('✅ Diretório dist criado');

  // Verificar se o index.js foi criado
  const indexJsPath = path.join(distPath, 'index.js');
  if (!fs.existsSync(indexJsPath)) {
    throw new Error('index.js não foi criado no dist');
  }

  console.log('✅ index.js criado');

  // Verificar tamanho do build
  const stats = fs.statSync(distPath);
  console.log('📊 Build concluído com sucesso!');
  console.log('📁 Arquivos gerados em:', distPath);

  // Listar arquivos gerados
  const files = fs.readdirSync(distPath);
  console.log('📄 Arquivos gerados:', files.join(', '));

} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}
