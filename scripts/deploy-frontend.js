const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparando frontend para deploy no Netlify...\n');

// Verificar se estamos no diretório correto
if (!fs.existsSync('frontend')) {
  console.error('❌ Diretório frontend não encontrado!');
  console.log('💡 Execute este script na raiz do projeto');
  process.exit(1);
}

try {
  // 1. Verificar se as dependências estão instaladas
  console.log('1. Verificando dependências do frontend...');
  if (!fs.existsSync('frontend/node_modules')) {
    console.log('📦 Instalando dependências do frontend...');
    execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });
  } else {
    console.log('✅ Dependências já instaladas');
  }

  // 2. Verificar arquivos de configuração
  console.log('\n2. Verificando arquivos de configuração...');
  const requiredFiles = [
    'frontend/package.json',
    'frontend/vite.config.ts',
    'frontend/netlify.toml',
    'frontend/tsconfig.json'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - FALTANDO`);
    }
  }

  // 3. Verificar variáveis de ambiente
  console.log('\n3. Verificando variáveis de ambiente...');
  if (fs.existsSync('frontend/.env')) {
    console.log('✅ frontend/.env existe');
    const envContent = fs.readFileSync('frontend/.env', 'utf8');
    if (envContent.includes('VITE_API_URL')) {
      console.log('✅ VITE_API_URL configurada');
    } else {
      console.log('⚠️  VITE_API_URL não encontrada no .env');
    }
  } else {
    console.log('⚠️  frontend/.env não existe - criando exemplo...');
    const envExample = `# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Sistema de Gestão de Rotas
VITE_APP_VERSION=1.0.0`;
    fs.writeFileSync('frontend/.env', envExample);
    console.log('✅ Arquivo .env criado com valores padrão');
  }

  // 4. Executar build
  console.log('\n4. Executando build do frontend...');
  try {
    execSync('npm run build', { cwd: 'frontend', stdio: 'inherit' });
    console.log('✅ Build executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no build:', error.message);
    process.exit(1);
  }

  // 5. Verificar se o build foi criado
  console.log('\n5. Verificando build...');
  if (fs.existsSync('frontend/dist')) {
    console.log('✅ Pasta dist criada');
    
    // Listar arquivos principais
    const distFiles = fs.readdirSync('frontend/dist');
    console.log('📁 Arquivos no build:');
    distFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log('❌ Pasta dist não foi criada');
    process.exit(1);
  }

  // 6. Verificar netlify.toml
  console.log('\n6. Verificando configuração do Netlify...');
  if (fs.existsSync('frontend/netlify.toml')) {
    console.log('✅ netlify.toml configurado');
  } else {
    console.log('❌ netlify.toml não encontrado');
  }

  console.log('\n🎉 Frontend pronto para deploy!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Faça commit e push do código para o GitHub');
  console.log('2. Acesse https://netlify.com');
  console.log('3. Conecte seu repositório');
  console.log('4. Configure:');
  console.log('   - Base directory: frontend');
  console.log('   - Build command: npm run build');
  console.log('   - Publish directory: frontend/dist');
  console.log('5. Adicione variáveis de ambiente:');
  console.log('   - VITE_API_URL: https://sua-api-url.com/api');
  console.log('\n📖 Guia completo: NETLIFY-DEPLOY.md');

} catch (error) {
  console.error('💥 Erro durante preparação:', error.message);
  process.exit(1);
}
