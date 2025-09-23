# 🚀 Guia Rápido - Sistema de Gestão de Rotas

## ⚡ Comandos Essenciais

### 📦 Instalação
```bash
# Instalar todas as dependências
npm run install:all
```

### 🔍 Verificar Configuração
```bash
# Verificar se tudo está configurado corretamente
npm run check-setup

# Testar conexão com o banco de dados
npm run test-database
```

### 🗄️ Configurar Supabase
1. Siga o guia completo: [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)
2. Execute o SQL fornecido no Supabase
3. Configure as variáveis de ambiente

### 👤 Criar Usuário Administrador
```bash
# Criar usuário admin automaticamente
npm run create-admin
```

### 🚀 Executar o Projeto
```bash
# Executar frontend e backend simultaneamente
npm run dev
```

### 🌐 Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Login**: admin@caminhao.com / admin123

## 📋 Checklist de Configuração

- [ ] ✅ Projeto clonado
- [ ] ✅ Dependências instaladas (`npm run install:all`)
- [ ] ✅ Supabase configurado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados criado (SQL executado)
- [ ] ✅ Usuário admin criado
- [ ] ✅ Projeto executando (`npm run dev`)

## 🆘 Solução Rápida de Problemas

### Erro de Conexão com Banco
```bash
# Verificar configuração
npm run check-setup
```

### Erro de Dependências
```bash
# Reinstalar tudo
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Erro de Porta em Uso
```bash
# Matar processos nas portas 3001 e 5173
npx kill-port 3001 5173
```

### Reset Completo
```bash
# Limpar tudo e reinstalar
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
npm run create-admin
npm run dev
```

## 📱 Funcionalidades Disponíveis

### 👨‍💼 Admin
- Gerenciar funcionários
- Criar e gerenciar rotas
- Visualizar relatórios
- Dashboard com estatísticas

### 👷‍♂️ Funcionário
- Visualizar rotas atribuídas
- Executar rotas
- Adicionar observações
- Marcar progresso

## 🔧 Comandos de Desenvolvimento

```bash
# Lint e formatação
npm run lint
npm run format

# Build para produção
npm run build

# Executar apenas frontend
npm run dev:frontend

# Executar apenas backend
npm run dev:backend
```

## 🚀 Deploy

### Frontend (Netlify)
```bash
# Preparar para deploy
npm run prepare-deploy

# Depois siga o guia: NETLIFY-DEPLOY.md
```

**Configuração no Netlify:**
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment: `VITE_API_URL=https://sua-api-url.com/api`

### Backend (Render/Railway)
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Build command: `cd backend && npm run build`
4. Start command: `cd backend && npm start`

## 📞 Suporte

- 📖 Documentação completa: [README.md](./README.md)
- 🗄️ Setup Supabase: [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)
- 🚀 Deploy Netlify: [NETLIFY-DEPLOY.md](./NETLIFY-DEPLOY.md)
- 🔍 Verificar setup: `npm run check-setup`

---

**🎉 Pronto para usar!** Se tudo estiver configurado, execute `npm run dev` e acesse http://localhost:5173
