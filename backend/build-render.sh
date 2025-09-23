#!/bin/bash
set -e

echo "🚀 Building backend for Render..."

# Navegar para o diretório backend
cd backend

# Instalar dependências
echo "📦 Installing dependencies..."
npm install

# Compilar TypeScript
echo "📝 Compiling TypeScript..."
npm run build

echo "✅ Backend build completed successfully!"
