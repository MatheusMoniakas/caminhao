# 🚀 Deploy do Backend no Render - Guia Atualizado

## ✅ **Problema Resolvido!**

O problema era que o Render estava executando o comando `npm run build` do diretório raiz, que tentava fazer build do frontend e backend juntos. Agora está configurado para fazer build apenas do backend.

## 📋 **Configuração no Render**

### 1. **Acesse [Render](https://render.com)**
- Faça login na sua conta
- Clique em **"New +"** → **"Web Service"**

### 2. **Conecte seu Repositório**
- Selecione seu repositório GitHub: `MatheusMoniakas/caminhao`
- Clique em **"Connect"**

### 3. **Configure o Serviço**

```
Name: caminhao-backend
Environment: Node
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
Health Check Path: /health
```

### 4. **Configurações Avançadas**
- **Auto-Deploy**: ✅ Habilitado
- **Branch**: `main`
- **Node Version**: `18` (ou superior)

## 🔐 **Variáveis de Ambiente**

Adicione estas variáveis no painel do Render:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
JWT_SECRET=sua_chave_jwt_super_secreta
JWT_REFRESH_SECRET=sua_chave_jwt_refresh_super_secreta
JWT_ACCESS_TOKEN_EXPIRATION=1h
JWT_REFRESH_TOKEN_EXPIRATION=7d
```

## 🎯 **Arquivos de Configuração**

### ✅ **render.yaml** (na raiz do projeto)
```yaml
services:
  - type: web
    name: caminhao-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    healthCheckPath: /health
```

### ✅ **package-render.json** (backup para o Render)
```json
{
  "name": "caminhao-backend-render",
  "scripts": {
    "build": "cd backend && npm install && npm run build",
    "start": "cd backend && npm start"
  }
}
```

## 🔍 **Como Funciona Agora**

1. **Build Command**: `cd backend && npm install && npm run build`
   - Vai para o diretório backend
   - Instala dependências do backend
   - Compila TypeScript do backend

2. **Start Command**: `cd backend && npm start`
   - Vai para o diretório backend
   - Inicia o servidor Node.js

3. **Health Check**: `/health`
   - Endpoint para verificar se o servidor está funcionando

## 🚨 **Troubleshooting**

### Se ainda der erro de build:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que as chaves do Supabase estão corretas
3. Verifique se o Node.js version está configurado para 18+

### Se der erro de start:
1. Verifique se o build foi bem-sucedido
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Verifique os logs no painel do Render

## 🌐 **Após o Deploy**

1. **Teste o Health Check**:
   ```
   GET https://seu-backend-url.onrender.com/health
   ```

2. **Teste a API**:
   ```
   GET https://seu-backend-url.onrender.com/api/status
   ```

3. **Atualize o Frontend**:
   - No Netlify, adicione a variável:
   ```env
   VITE_API_URL=https://seu-backend-url.onrender.com/api
   ```

## 📊 **Monitoramento**

- **Logs**: Acesse "Logs" no painel do Render
- **Métricas**: Dashboard com CPU, memória e requests
- **Health Check**: Monitora automaticamente o endpoint `/health`

## 🎉 **Deploy Concluído!**

Após o deploy bem-sucedido:

1. ✅ Backend rodando no Render
2. ✅ Frontend rodando no Netlify
3. ✅ Banco de dados no Supabase
4. ✅ Sistema completo funcionando!

**URLs de exemplo:**
- Backend: `https://caminhao-backend.onrender.com`
- Frontend: `https://caminhao-frontend.netlify.app`

