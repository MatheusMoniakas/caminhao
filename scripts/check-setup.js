const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto...\n');

// Verificar estrutura de pastas
const requiredFolders = [
  'frontend',
  'backend',
  'frontend/src',
  'backend/src',
  'backend/scripts'
];

console.log('📁 Verificando estrutura de pastas:');
requiredFolders.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`  ✅ ${folder}`);
  } else {
    console.log(`  ❌ ${folder} - FALTANDO`);
  }
});

// Verificar arquivos importantes
const requiredFiles = [
  'package.json',
  'frontend/package.json',
  'backend/package.json',
  'frontend/vite.config.ts',
  'backend/tsconfig.json',
  'frontend/tsconfig.json',
  'backend/src/index.ts',
  'frontend/src/main.tsx',
  'frontend/netlify.toml'
];

console.log('\n📄 Verificando arquivos importantes:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANDO`);
  }
});

// Verificar variáveis de ambiente
console.log('\n🔧 Verificando configuração de ambiente:');

// Backend .env
if (fs.existsSync('backend/.env')) {
  console.log('  ✅ backend/.env existe');
  
  const backendEnv = fs.readFileSync('backend/.env', 'utf8');
  const requiredBackendVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];
  
  requiredBackendVars.forEach(varName => {
    if (backendEnv.includes(varName) && !backendEnv.includes(`${varName}=your_`)) {
      console.log(`    ✅ ${varName} configurado`);
    } else {
      console.log(`    ❌ ${varName} não configurado ou com valor padrão`);
    }
  });
} else {
  console.log('  ❌ backend/.env não existe - CRIE baseado no env.example');
}

// Frontend .env
if (fs.existsSync('frontend/.env')) {
  console.log('  ✅ frontend/.env existe');
  
  const frontendEnv = fs.readFileSync('frontend/.env', 'utf8');
  if (frontendEnv.includes('VITE_API_URL') && !frontendEnv.includes('your_')) {
    console.log('    ✅ VITE_API_URL configurado');
  } else {
    console.log('    ❌ VITE_API_URL não configurado ou com valor padrão');
  }
} else {
  console.log('  ❌ frontend/.env não existe - CRIE baseado no env.example');
}

// Verificar node_modules
console.log('\n📦 Verificando dependências:');
if (fs.existsSync('node_modules')) {
  console.log('  ✅ node_modules (raiz)');
} else {
  console.log('  ❌ node_modules (raiz) - Execute: npm install');
}

if (fs.existsSync('frontend/node_modules')) {
  console.log('  ✅ frontend/node_modules');
} else {
  console.log('  ❌ frontend/node_modules - Execute: cd frontend && npm install');
}

if (fs.existsSync('backend/node_modules')) {
  console.log('  ✅ backend/node_modules');
} else {
  console.log('  ❌ backend/node_modules - Execute: cd backend && npm install');
}

// Verificar git
console.log('\n🔗 Verificando Git:');
if (fs.existsSync('.git')) {
  console.log('  ✅ Repositório Git inicializado');
} else {
  console.log('  ❌ Repositório Git não inicializado');
}

console.log('\n🎯 Próximos passos:');
console.log('1. Configure o Supabase seguindo SUPABASE-SETUP.md');
console.log('2. Instale as dependências: npm run install:all');
console.log('3. Execute o projeto: npm run dev');
console.log('4. Acesse: http://localhost:5173');

console.log('\n✨ Verificação concluída!');
