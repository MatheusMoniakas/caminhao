# 🚚 Sistema de Gestão de Rotas de Caminhões - Instruções de Instalação

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)
- **PostgreSQL** (versão 12 ou superior)
- **Git**

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd gestao-rotas-caminhoes
```

### 2. Instale as Dependências
```bash
# Instala dependências do projeto principal e subprojetos
npm run install:all
```

### 3. Configure o Banco de Dados

#### 3.1. Crie o Banco PostgreSQL
```sql
-- Entre no PostgreSQL como superuser
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE gestao_rotas;

-- Crie um usuário (opcional, mas recomendado)
CREATE USER gestao_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE gestao_rotas TO gestao_user;
```

#### 3.2. Configure as Variáveis de Ambiente
```bash
# Navegue para a pasta do backend
cd backend

# Copie o arquivo de exemplo e configure
cp env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

Exemplo do arquivo `.env`:
```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://gestao_user:sua_senha_segura@localhost:5432/gestao_rotas"

# Configurações de Segurança
JWT_SECRET="sua-chave-secreta-jwt-muito-segura-aqui"
JWT_EXPIRES_IN="24h"

# Configurações do Servidor
PORT=3001
NODE_ENV="development"

# Configurações de CORS
CORS_ORIGIN="http://localhost:3000"
```

### 4. Execute as Migrações do Banco de Dados
```bash
# Ainda na pasta backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Inicie o Sistema

#### Opção 1: Iniciar Tudo Junto (Recomendado para desenvolvimento)
```bash
# Volta para a pasta raiz
cd ..

# Inicia backend e frontend simultaneamente
npm run dev
```

#### Opção 2: Iniciar Separadamente
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Acessando o Sistema

- **Frontend**: http://localhost:3000
- **Backend/API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Prisma Studio** (opcional): `cd backend && npm run studio`

## 👤 Primeiro Acesso

1. Acesse http://localhost:3000
2. Clique em "Criar nova conta"
3. Preencha os dados da empresa e do usuário administrador
4. Faça login com as credenciais criadas
5. Comece cadastrando caminhões e funcionários

## 📊 Estrutura do Sistema

### Backend (API)
- **Rotas de Autenticação**: `/api/auth/*`
- **Gestão de Empresas**: `/api/companies/*`
- **Gestão de Caminhões**: `/api/trucks/*`
- **Gestão de Funcionários**: `/api/employees/*`
- **Gestão de Rotas**: `/api/routes/*`

### Frontend (React)
- **Login/Registro**: `/login`, `/register`
- **Dashboard**: `/dashboard`
- **Caminhões**: `/trucks`
- **Funcionários**: `/employees`
- **Rotas**: `/routes`

## 🛠️ Comandos Úteis

### Backend
```bash
cd backend

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start

# Executar migrações
npm run migrate

# Gerar cliente Prisma
npm run generate

# Abrir Prisma Studio
npm run studio
```

### Frontend
```bash
cd frontend

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint
```

## 🔧 Solução de Problemas

### Erro de Conexão com Banco
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `psql -h localhost -U gestao_user -d gestao_rotas`

### Erro "Cannot find module"
```bash
# Limpe os node_modules e reinstale
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### Erro de CORS
1. Verifique se o `CORS_ORIGIN` no backend está correto
2. Confirme se o frontend está rodando na porta 3000

### Erro de JWT
1. Verifique se o `JWT_SECRET` está definido no `.env`
2. Use uma chave segura e complexa

## 📱 Funcionalidades Implementadas

### ✅ MVP Completo
- [x] Sistema de autenticação (login/registro)
- [x] Multitenant (separação por empresa)
- [x] CRUD de caminhões
- [x] CRUD de funcionários (motoristas/ajudantes)
- [x] CRUD de rotas
- [x] Validação de disponibilidade
- [x] Dashboard com estatísticas
- [x] Interface responsiva

### 🔄 Próximas Funcionalidades
- [ ] Calendário visual das rotas
- [ ] Relatórios avançados
- [ ] Notificações por email
- [ ] App mobile
- [ ] Integração com GPS
- [ ] Manutenção de caminhões

## 🎯 Conceitos Implementados

### Segurança
- Autenticação JWT
- Criptografia de senhas com bcrypt
- Validação de entrada de dados
- Isolamento por empresa (multitenant)

### Arquitetura
- API REST
- Separação backend/frontend
- ORM com Prisma
- Middleware de autenticação
- Tratamento de erros

### UX/UI
- Interface moderna com TailwindCSS
- Componentes reutilizáveis
- Feedback visual (toasts)
- Estados de loading
- Design responsivo

## 📞 Suporte

Se encontrar algum problema:

1. Verifique se todos os pré-requisitos estão instalados
2. Confirme se seguiu todos os passos de instalação
3. Verifique os logs de erro no terminal
4. Teste as conexões de rede e banco de dados

## 🔄 Backup e Manutenção

### Backup do Banco
```bash
pg_dump -h localhost -U gestao_user gestao_rotas > backup.sql
```

### Restaurar Backup
```bash
psql -h localhost -U gestao_user gestao_rotas < backup.sql
```

### Limpeza de Logs
```bash
# Limpar logs antigos
find . -name "*.log" -type f -delete
```

---

🎉 **Parabéns!** Agora você tem um sistema completo de gestão de rotas de caminhões funcionando!



