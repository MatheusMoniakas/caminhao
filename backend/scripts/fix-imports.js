#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeamento de paths para caminhos relativos
const pathMappings = {
  '@/config': './config',
  '@/controllers': './controllers',
  '@/models': './models',
  '@/services': './services',
  '@/routes': './routes',
  '@/middleware': './middleware',
  '@/utils': './utils',
  '@/types': './types'
};

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Substituir imports com path mapping
    for (const [alias, relativePath] of Object.entries(pathMappings)) {
      const regex = new RegExp(`require\\("${alias.replace('@', '\\@')}([^"]*)"\\)`, 'g');
      const newContent = content.replace(regex, (match, suffix) => {
        modified = true;
        // Adicionar .js se não tiver extensão
        const finalSuffix = suffix && !suffix.endsWith('.js') ? `${suffix}.js` : suffix;
        return `require("${relativePath}${finalSuffix}")`;
      });
      content = newContent;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function fixImportsInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImportsInDirectory(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  }
}

// Executar o script
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log('Fixing imports in dist directory...');
  fixImportsInDirectory(distPath);
  console.log('Import fixing completed!');
} else {
  console.error('Dist directory not found!');
  process.exit(1);
}
