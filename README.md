# 🚛 Gestão de Rotas de Caminhões

Sistema completo para gestão de rotas de caminhões para pequenas empresas de transporte, desenvolvido com React, Node.js, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- **Autenticação e Autorização**: Sistema completo de login/registro com JWT
- **Gestão de Empresas**: Cadastro e gerenciamento de empresas de transporte
- **Gestão de Caminhões**: Controle completo da frota de veículos
- **Gestão de Funcionários**: Cadastro e controle de motoristas e funcionários
- **Gestão de Rotas**: Planejamento e acompanhamento de rotas
- **Relatórios**: Geração de relatórios de operação
- **Interface Responsiva**: Design moderno e responsivo com TailwindCSS

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **TailwindCSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados

### Deploy
- **Vercel** - Hospedagem e deploy automático
- **GitHub** - Controle de versão

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gestao-rotas-caminhoes.git
cd gestao-rotas-caminhoes
```

### 2. Instale as dependências
```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 3. Configure o banco de dados

#### PostgreSQL
1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE gestao_rotas;
```

2. Configure as variáveis de ambiente no arquivo `backend/.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gestao_rotas"
JWT_SECRET="sua-chave-secreta-super-forte-aqui-123456789"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

3. Execute as migrações do Prisma:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Execute a aplicação

#### Desenvolvimento
```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend em `http://localhost:3001`
- Frontend em `http://localhost:5173`

#### Produção
```bash
# Build do frontend
cd frontend
npm run build

# Iniciar backend
cd ../backend
npm start
```

## 🌐 Deploy no Vercel

### 1. Prepare o projeto
```bash
# Build do frontend
cd frontend
npm run build
```

### 2. Configure as variáveis de ambiente no Vercel
No painel do Vercel, adicione as seguintes variáveis:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
JWT_SECRET=sua-chave-secreta-super-forte-aqui-123456789
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.vercel.app
```

### 3. Deploy
```bash
# Instale o Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📁 Estrutura do Projeto

```
gestao-rotas-caminhoes/
├── api/                    # API para Vercel
│   └── index.js
├── backend/                # Backend Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   └── utils/          # Utilitários
│   ├── prisma/             # Schema e migrações
│   ├── .env                # Variáveis de ambiente
│   └── package.json
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # Contextos React
│   │   └── utils/          # Utilitários
│   ├── public/             # Arquivos estáticos
│   └── package.json
├── vercel.json             # Configuração do Vercel
└── README.md
```

## 🔧 Scripts Disponíveis

### Projeto Principal
- `npm run dev` - Inicia frontend e backend em desenvolvimento
- `npm run dev:frontend` - Inicia apenas o frontend
- `npm run dev:backend` - Inicia apenas o backend

### Backend
- `npm run dev` - Inicia em modo desenvolvimento com nodemon
- `npm start` - Inicia em modo produção
- `npm run build` - Gera o cliente Prisma
- `npm run migrate` - Executa migrações
- `npm run studio` - Abre o Prisma Studio

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run vercel-build` - Build específico para Vercel

## 🗄️ Banco de Dados

### Modelos Principais
- **Company** - Empresas de transporte
- **User** - Usuários do sistema
- **Truck** - Caminhões da frota
- **Employee** - Funcionários/motoristas
- **Route** - Rotas de transporte

### Relacionamentos
- Uma empresa tem muitos usuários
- Uma empresa tem muitos caminhões
- Uma empresa tem muitos funcionários
- Uma empresa tem muitas rotas
- Um funcionário pode dirigir muitos caminhões
- Uma rota tem um caminhão e um funcionário

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:
- Tokens expiram em 7 dias
- Refresh automático de tokens
- Middleware de autenticação em todas as rotas protegidas

## 📱 Interface

- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Tema Moderno**: Interface limpa e intuitiva
- **Componentes Reutilizáveis**: Biblioteca de componentes customizados
- **Feedback Visual**: Notificações e estados de loading

## 🚀 Próximas Funcionalidades

- [ ] Dashboard com métricas em tempo real
- [ ] Integração com GPS para rastreamento
- [ ] Notificações push
- [ ] Relatórios avançados com gráficos
- [ ] API para integração com sistemas externos
- [ ] App mobile (React Native)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ para pequenas empresas de transporte