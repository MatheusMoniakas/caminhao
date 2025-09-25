#!/bin/bash

# Script para instalar e configurar o servidor Baileys
echo "🚀 Instalando servidor Baileys para WhatsApp..."

# Criar diretório para o servidor
mkdir -p baileys-server
cd baileys-server

# Copiar arquivos
cp ../baileys-server.js .
cp ../package-baileys.json package.json

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo "✅ Instalação concluída!"
echo ""
echo "📋 Para iniciar o servidor:"
echo "   cd baileys-server"
echo "   npm start"
echo ""
echo "📱 Para conectar seu WhatsApp:"
echo "   1. Execute: npm start"
echo "   2. Escaneie o QR Code com seu WhatsApp"
echo "   3. Aguarde a conexão"
echo ""
echo "🔧 Para enviar mensagens:"
echo "   POST http://localhost:3001/send-message"
echo "   Body: { \"sessionId\": \"default\", \"phone\": \"11999999999\", \"message\": \"Olá!\" }"
