#!/bin/bash

echo "🚀 Building frontend for Netlify..."

# Instalar dependências
echo "📦 Installing dependencies..."
npm install

# Compilar TypeScript
echo "📝 Compiling TypeScript..."
npx tsc

# Build com Vite
echo "⚡ Building with Vite..."
npx vite build

echo "✅ Frontend build completed successfully!"
