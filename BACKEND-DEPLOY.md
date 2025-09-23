# 🚀 Deploy do Backend - Render/Railway

Este guia mostra como fazer deploy do backend no Render ou Railway.

## 📋 Pré-requisitos

- ✅ Backend configurado e funcionando localmente
- ✅ Conta no [Render](https://render.com) ou [Railway](https://railway.app)
- ✅ Projeto no Supabase configurado
- ✅ Repositório no GitHub

## 🎯 Opção 1: Deploy no Render

### 1. Configuração no Render

1. **Acesse [Render](https://render.com)** e faça login
2. **Clique em "New +"** → **"Web Service"**
3. **Conecte seu repositório GitHub**
4. **Configure o serviço:**

```
Name: caminhao-backend
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### 2. Variáveis de Ambiente no Render

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

### 3. Configurações Avançadas

- **Health Check Path**: `/health`
- **Auto-Deploy**: ✅ Habilitado
- **Branch**: `main`

## 🎯 Opção 2: Deploy no Railway

### 1. Configuração no Railway

1. **Acesse [Railway](https://railway.app)** e faça login
2. **Clique em "New Project"** → **"Deploy from GitHub repo"**
3. **Selecione seu repositório**
4. **Configure o serviço:**

```
Build Command: npm install && npm run build
Start Command: npm start
Health Check Path: /health
```

### 2. Variáveis de Ambiente no Railway

Adicione estas variáveis no painel do Railway:

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

## 🔧 Configurações do Projeto

### Arquivos de Configuração

- ✅ `render.yaml` - Configuração para Render
- ✅ `railway.json` - Configuração para Railway
- ✅ `env.production.example` - Exemplo de variáveis de produção

### Scripts do Package.json

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",
    "postbuild": "echo 'Build completed successfully!'"
  }
}
```

## 🌐 Configuração do Frontend

Após o deploy do backend, atualize a variável no Netlify:

```env
VITE_API_URL=https://seu-backend-url.onrender.com/api
# ou
VITE_API_URL=https://seu-backend-url.railway.app/api
```

## 🔍 Health Check

O backend inclui um endpoint de health check:

```
GET /health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 📊 Monitoramento

### Logs
- **Render**: Acesse "Logs" no painel do serviço
- **Railway**: Acesse "Deployments" → "View Logs"

### Métricas
- **Render**: Dashboard com métricas de CPU, memória e requests
- **Railway**: Métricas em tempo real no painel

## 🚨 Troubleshooting

### Erro de Build
```bash
# Verifique se o TypeScript compila localmente
cd backend
npm run build
```

### Erro de Start
```bash
# Verifique se o servidor inicia localmente
npm start
```

### Erro de Variáveis de Ambiente
- Verifique se todas as variáveis estão configuradas
- Certifique-se de que as chaves do Supabase estão corretas
- Verifique se as chaves JWT são seguras

### Erro de Conexão com Supabase
- Verifique se a URL do Supabase está correta
- Verifique se as chaves de API estão corretas
- Verifique se o projeto Supabase está ativo

## 🔐 Segurança

### Chaves JWT
- Use chaves longas e aleatórias (mínimo 32 caracteres)
- Diferentes chaves para access e refresh tokens
- Nunca commite as chaves no repositório

### Supabase
- Use a Service Role Key apenas no backend
- Nunca exponha a Service Role Key no frontend
- Configure RLS (Row Level Security) no Supabase

## 📈 Otimizações

### Performance
- ✅ Compression habilitado
- ✅ Rate limiting configurado
- ✅ Helmet para segurança
- ✅ CORS configurado

### Monitoramento
- ✅ Health check endpoint
- ✅ Logs estruturados
- ✅ Error handling centralizado

## 🎉 Deploy Concluído!

Após o deploy:

1. ✅ Teste o health check: `GET /health`
2. ✅ Teste a API: `GET /api/status`
3. ✅ Atualize o frontend com a nova URL
4. ✅ Teste o login e funcionalidades

**URLs de exemplo:**
- Render: `https://caminhao-backend.onrender.com`
- Railway: `https://caminhao-backend.railway.app`
