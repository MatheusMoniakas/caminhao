# 🚀 Deploy do Frontend no Netlify - Guia Completo

Este guia te ajudará a fazer o deploy do frontend React no Netlify.

## 📋 Pré-requisitos

- ✅ Projeto frontend configurado
- ✅ Conta no [Netlify](https://netlify.com) (gratuita)
- ✅ Repositório no GitHub/GitLab/Bitbucket
- ✅ Build do frontend funcionando

## 🚀 Passo 1: Preparar o Frontend

### 1.1 Instalar Dependências (se ainda não fez)
```bash
cd frontend
npm install
```

### 1.2 Testar Build Local
```bash
# No diretório frontend
npm run build
```

Se der erro, corrija antes de continuar.

### 1.3 Verificar Arquivos de Deploy
Certifique-se que estes arquivos existem:
- ✅ `frontend/netlify.toml` (já criado)
- ✅ `frontend/dist/` (criado após build)

## 🌐 Passo 2: Criar Conta no Netlify

### 2.1 Acessar Netlify
1. Vá para [https://netlify.com](https://netlify.com)
2. Clique em **"Sign up"**
3. Escolha **"Sign up with GitHub"** (recomendado)

### 2.2 Autorizar Aplicação
1. Autorize o Netlify a acessar seus repositórios
2. Complete o cadastro

## 📁 Passo 3: Conectar Repositório

### 3.1 Criar Novo Site
1. No dashboard do Netlify, clique em **"New site from Git"**
2. Escolha **"GitHub"** (ou sua plataforma)
3. Selecione o repositório `caminhao`

### 3.2 Configurar Build
Preencha os campos:

**Build settings:**
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

**Environment variables:**
- `VITE_API_URL`: `https://sua-api-url.com/api`

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1 Adicionar Variáveis
1. No Netlify, vá para **"Site settings"**
2. Clique em **"Environment variables"**
3. Adicione:

```
VITE_API_URL=https://sua-api-backend.com/api
VITE_APP_NAME=Sistema de Gestão de Rotas
VITE_APP_VERSION=1.0.0
```

### 4.2 URLs de Exemplo
- **Render**: `https://caminhao-backend.onrender.com/api`
- **Railway**: `https://caminhao-backend.railway.app/api`
- **Vercel**: `https://caminhao-backend.vercel.app/api`

## 🚀 Passo 5: Fazer Deploy

### 5.1 Deploy Automático
1. Clique em **"Deploy site"**
2. Aguarde o build (2-5 minutos)
3. Seu site estará disponível em: `https://nome-aleatorio.netlify.app`

### 5.2 Deploy Manual (Alternativa)
Se preferir fazer upload manual:

1. Execute o build local:
   ```bash
   cd frontend
   npm run build
   ```

2. No Netlify:
   - Vá para **"Sites"**
   - Clique em **"Add new site"** > **"Deploy manually"**
   - Arraste a pasta `frontend/dist` para a área de upload

## 🔧 Passo 6: Configurações Avançadas

### 6.1 Domínio Personalizado (Opcional)
1. No Netlify, vá para **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `caminhao.seudominio.com`)
4. Configure DNS conforme instruções

### 6.2 HTTPS Automático
- ✅ O Netlify já fornece HTTPS automático
- ✅ Certificado SSL gratuito incluído

### 6.3 Deploy Contínuo
- ✅ A cada push no GitHub, o Netlify faz deploy automático
- ✅ Preview de branches para testar antes de publicar

## 🧪 Passo 7: Testar o Deploy

### 7.1 Verificar Funcionamento
1. Acesse sua URL do Netlify
2. Teste o login: `admin@caminhao.com` / `admin123`
3. Verifique se a API está conectada

### 7.2 Logs de Deploy
Se houver problemas:
1. No Netlify, vá para **"Deploys"**
2. Clique no deploy com problema
3. Veja os logs de build

## 🐛 Solução de Problemas

### Erro de Build
```
Build failed: npm run build
```

**Soluções:**
1. Verifique se todas as dependências estão instaladas
2. Execute `npm run build` localmente para testar
3. Verifique se não há erros de TypeScript

### Erro de API
```
Failed to fetch from API
```

**Soluções:**
1. Verifique se `VITE_API_URL` está configurada
2. Confirme se o backend está rodando
3. Verifique CORS no backend

### Erro 404 em Rotas
```
Page not found on refresh
```

**Solução:**
- ✅ O arquivo `netlify.toml` já está configurado para SPA
- ✅ Redireciona todas as rotas para `index.html`

## 📊 Passo 8: Monitoramento

### 8.1 Analytics (Opcional)
1. No Netlify, vá para **"Analytics"**
2. Ative analytics gratuito
3. Veja estatísticas de visitantes

### 8.2 Formulários (Opcional)
1. No Netlify, vá para **"Forms"**
2. Ative coleta de formulários
3. Receba emails de contato

## 🔄 Passo 9: Atualizações

### 9.1 Deploy Automático
- ✅ A cada push no `main`, o Netlify faz deploy
- ✅ Deploy de branches para preview

### 9.2 Deploy Manual
```bash
# Fazer push para triggerar deploy
git add .
git commit -m "Update frontend"
git push origin main
```

## 📱 URLs Finais

Após o deploy, você terá:

- **Frontend**: `https://seu-site.netlify.app`
- **Backend**: `https://sua-api.com/api`
- **Admin**: `admin@caminhao.com` / `admin123`

## 🎯 Checklist Final

- [ ] ✅ Frontend buildando localmente
- [ ] ✅ Conta Netlify criada
- [ ] ✅ Repositório conectado
- [ ] ✅ Build settings configurados
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Deploy realizado
- [ ] ✅ Site funcionando
- [ ] ✅ Login testado
- [ ] ✅ API conectada

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de build no Netlify
2. Teste o build localmente primeiro
3. Confirme se as variáveis de ambiente estão corretas
4. Verifique se o backend está acessível

---

**🎉 Deploy concluído!** Seu frontend estará disponível globalmente no Netlify.
