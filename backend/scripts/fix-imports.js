const fs = require('fs');
const path = require('path');

// Função para corrigir imports em um arquivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir imports com @/ por imports relativos
    content = content.replace(/require\(['"]@\/([^'"]+)['"]\)/g, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      return `require('${relativePath}')`;
    });
    
    // Substituir imports com @/controllers, @/services, etc.
    content = content.replace(/require\(['"]@\/(controllers|services|routes|middleware|types|config|utils)\/([^'"]+)['"]\)/g, (match, folder, importPath) => {
      const relativePath = getRelativePath(filePath, `${folder}/${importPath}`);
      return `require('${relativePath}')`;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing imports in ${filePath}:`, error.message);
  }
}

// Função para calcular o caminho relativo
function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  let toFile = path.join('dist', toPath);
  
  // Se o arquivo não tem extensão, verificar se é uma pasta com index.js
  if (!path.extname(toFile)) {
    const indexPath = path.join(toFile, 'index.js');
    if (fs.existsSync(indexPath)) {
      toFile = indexPath;
    } else {
      toFile += '.js';
    }
  }
  
  const relativePath = path.relative(fromDir, toFile);
  
  // Normalizar separadores de caminho para funcionar em qualquer OS
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  // Garantir que o caminho comece com ./
  return normalizedPath.startsWith('.') ? normalizedPath : './' + normalizedPath;
}

// Função para processar todos os arquivos .js na pasta dist
function processDistFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDistFiles(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  });
}

// Executar o script
console.log('🔧 Fixing imports in compiled files...');
processDistFiles('./dist');
console.log('✅ Import fixing completed!');
