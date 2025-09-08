# 🚚 GUIA COMPLETO DE CONFIGURAÇÃO - Sistema de Gestão de Rotas

## 📋 CREDENCIAIS DE ACESSO (Criadas Automaticamente)
```
🔑 Email: admin@transportadora.com
🔑 Senha: admin123
```

## 🗄️ PASSO A PASSO - CONFIGURAÇÃO DO BANCO DE DADOS

### 1️⃣ INSTALAR POSTGRESQL
- **Windows**: Baixe e instale do site oficial: https://www.postgresql.org/download/windows/
- **Durante a instalação**:
  - Anote a senha do usuário `postgres`
  - Mantenha a porta padrão `5432`
  - Instale o pgAdmin (interface gráfica)

### 2️⃣ CRIAR BANCO DE DADOS
- Abra o **pgAdmin**
- Conecte no servidor local
- Clique com botão direito em **Databases**
- Selecione **Create** → **Database**
- Nome: `gestao_rotas`
- Clique em **Save**

### 3️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE
- No projeto, copie o arquivo `.env.example` para `.env`
- Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/gestao_rotas"

# Configurações de Segurança
JWT_SECRET="sua-chave-secreta-jwt-aqui"
JWT_EXPIRES_IN="24h"

# Configurações do Servidor
PORT=3001
NODE_ENV="development"

# Configurações de CORS
CORS_ORIGIN="http://localhost:3000"
```

**⚠️ IMPORTANTE**: Substitua `SUA_SENHA_AQUI` pela senha que você definiu para o usuário `postgres`

### 4️⃣ INSTALAR DEPENDÊNCIAS
```bash
# Na pasta raiz do projeto
npm run install:all
```

### 5️⃣ EXECUTAR MIGRAÇÕES DO BANCO
```bash
# Na pasta backend
cd backend
npm run migrate
```

### 6️⃣ CRIAR USUÁRIO ADMINISTRADOR
```bash
# Na pasta raiz do projeto
node create-admin.js
```

### 7️⃣ INICIAR O SISTEMA
```bash
# Na pasta raiz do projeto
npm run dev
```

## 🚀 COMO ACESSAR O SISTEMA

### 1️⃣ Abrir o navegador
- Acesse: `http://localhost:3000`

### 2️⃣ Fazer login
- **Email**: `admin@transportadora.com`
- **Senha**: `admin123`

### 3️⃣ Primeiro acesso
- Altere a senha do administrador
- Configure os dados da sua empresa
- Comece a cadastrar caminhões, funcionários e rotas

## 🔧 VERIFICAÇÃO DE FUNCIONAMENTO

### ✅ Backend funcionando
- Acesse: `http://localhost:3001/api/health`
- Deve retornar: `{"status":"OK","message":"API funcionando!"}`

### ✅ Frontend funcionando
- Acesse: `http://localhost:3000`
- Deve mostrar a tela de login

### ✅ Banco conectado
- Se não houver erros no terminal, o banco está conectado
- Verifique no pgAdmin se as tabelas foram criadas

## 🚨 SOLUÇÃO DE PROBLEMAS

### ❌ Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme a senha no arquivo `.env`
- Teste a conexão no pgAdmin

### ❌ Erro de porta em uso
- Verifique se as portas 3000 e 3001 estão livres
- Feche outros aplicativos que possam estar usando essas portas

### ❌ Erro de dependências
- Delete as pastas `node_modules` e `package-lock.json`
- Execute `npm run install:all` novamente

## 📱 FUNCIONALIDADES DISPONÍVEIS

- ✅ **Dashboard** com visão geral
- ✅ **Gestão de Caminhões** (CRUD completo)
- ✅ **Gestão de Funcionários** (motoristas e ajudantes)
- ✅ **Agendamento de Rotas** com validações
- ✅ **Sistema de Usuários** com perfis
- ✅ **Relatórios** básicos de operação

## 🔐 SEGURANÇA

- ✅ **JWT** para autenticação
- ✅ **Senhas criptografadas** com bcrypt
- ✅ **Validação** de entrada de dados
- ✅ **Multitenant** (cada empresa tem sua área)

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs no terminal
2. Confirme as configurações do banco
3. Verifique se todas as dependências foram instaladas
4. Teste a conexão com o banco no pgAdmin

---

**🎯 Sistema pronto para uso após seguir todos os passos!**

