# 🚚 Sistema de Gestão de Rotas de Caminhões

Sistema completo para gerenciamento de rotas, caminhões, funcionários e empresas de transporte.

## ✨ **Funcionalidades**

- 🔐 **Autenticação e Autorização** - Sistema de login com JWT
- 🏢 **Gestão de Empresas** - Cadastro e administração de empresas
- 🚛 **Gestão de Caminhões** - Controle de frota
- 👥 **Gestão de Funcionários** - Cadastro de motoristas e ajudantes
- 🗺️ **Gestão de Rotas** - Planejamento e acompanhamento de rotas
- 📊 **Dashboard** - Visão geral da operação
- 🌐 **Interface Web** - Frontend moderno com React + Vite
- 🔧 **API REST** - Backend robusto com Node.js + Express

## 🛠️ **Tecnologias**

### **Backend**
- **Node.js** + **Express**
- **Prisma** (ORM)
- **SQLite** (banco de dados)
- **JWT** (autenticação)
- **bcryptjs** (criptografia)

### **Frontend**
- **React** + **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios** (requisições HTTP)

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/gestao-rotas-caminhoes.git
cd gestao-rotas-caminhoes
```

### **2. Instale as dependências**
```bash
# Instalar dependências do projeto raiz
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### **3. Configure o banco de dados**
```bash
cd ../backend

# Gerar cliente Prisma
npx prisma generate

# Criar banco de dados
npx prisma db push

# Criar usuário administrador
node create-admin.js
```

### **4. Execute o projeto**
```bash
# Voltar para o diretório raiz
cd ..

# Executar backend e frontend simultaneamente
npm run dev
```

## 🌐 **Acessos**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🔑 **Credenciais Padrão**

- **Email**: `admin@transportadora.com`
- **Senha**: `admin123`

## 📁 **Estrutura do Projeto**

```
gestao-rotas-caminhoes/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── config.js       # Configurações
│   │   └── server.js       # Servidor principal
│   ├── prisma/             # Schema do banco
│   └── package.json
├── frontend/                # Interface Web
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Serviços API
│   │   └── App.jsx         # App principal
│   └── package.json
├── package.json             # Scripts do projeto raiz
└── README.md
```

## 🔧 **Scripts Disponíveis**

### **Projeto Raiz**
- `npm run dev` - Executa backend e frontend simultaneamente

### **Backend**
- `npm run dev` - Executa com nodemon (desenvolvimento)
- `npm start` - Executa em produção

### **Frontend**
- `npm run dev` - Executa servidor de desenvolvimento
- `npm run build` - Gera build de produção

## 📝 **API Endpoints**

### **Autenticação**
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de empresa
- `GET /api/auth/me` - Dados do usuário logado

### **Empresas**
- `GET /api/companies/dashboard` - Dashboard da empresa
- `PUT /api/companies/profile` - Atualizar perfil

### **Caminhões**
- `GET /api/trucks` - Listar caminhões
- `POST /api/trucks` - Cadastrar caminhão
- `PUT /api/trucks/:id` - Atualizar caminhão
- `DELETE /api/trucks/:id` - Remover caminhão

### **Funcionários**
- `GET /api/employees` - Listar funcionários
- `POST /api/employees` - Cadastrar funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Remover funcionário

### **Rotas**
- `GET /api/routes` - Listar rotas
- `POST /api/routes` - Cadastrar rota
- `PUT /api/routes/:id` - Atualizar rota
- `DELETE /api/routes/:id` - Remover rota

## 🚀 **Deploy**

### **Backend (Produção)**
```bash
cd backend
npm run build
npm start
```

### **Frontend (Produção)**
```bash
cd frontend
npm run build
# Servir arquivos da pasta dist/
```

## 🤝 **Contribuição**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Suporte**

Para dúvidas ou suporte, abra uma [issue](https://github.com/SEU_USUARIO/gestao-rotas-caminhoes/issues) no GitHub.

---

**Desenvolvido com ❤️ para otimizar a gestão de transportes**

