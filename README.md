# 🚛 Sistema de Gestão de Rotas de Caminhões

Sistema completo para gestão de rotas de caminhões com funcionalidades de cadastro de funcionários, criação de rotas, execução de entregas e relatórios.

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **React Query** para gerenciamento de estado
- **React Hook Form** para formulários
- **Lucide React** para ícones

### Backend
- **Node.js** com TypeScript
- **Express.js** para API REST
- **Supabase** como banco de dados PostgreSQL
- **JWT** para autenticação
- **Joi** para validação
- **Bcrypt** para hash de senhas
- **WhatsApp Integration** com Baileys

## 📁 Estrutura do Projeto

```
caminhao/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Serviços de API
│   │   ├── context/        # Context API
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   ├── public/             # Arquivos estáticos
│   └── dist/               # Build de produção
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de dados
│   │   ├── services/       # Lógica de negócio
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── utils/          # Utilitários
│   │   ├── types/          # Tipos TypeScript
│   │   └── config/         # Configurações
│   └── dist/               # Build de produção
└── README.md
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm 8+
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd caminhao
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configure o banco de dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL abaixo para criar as tabelas:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de rotas
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_point VARCHAR(255) NOT NULL,
  end_point VARCHAR(255) NOT NULL,
  waypoints TEXT[] DEFAULT '{}',
  assigned_employee_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de execuções de rota
CREATE TABLE route_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id),
  employee_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_routes_assigned_employee ON routes(assigned_employee_id);
CREATE INDEX idx_route_executions_employee ON route_executions(employee_id);
CREATE INDEX idx_route_executions_route ON route_executions(route_id);
CREATE INDEX idx_route_executions_status ON route_executions(status);
```

### 4. Configure as variáveis de ambiente

#### Backend (`backend/.env`)
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Supabase)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (`frontend/.env`)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Sistema de Gestão de Rotas
VITE_APP_VERSION=1.0.0
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
# Executa frontend e backend simultaneamente
npm run dev

# Ou execute separadamente:
npm run dev:frontend  # Frontend na porta 5173
npm run dev:backend   # Backend na porta 3001
```

### Produção
```bash
# Build do projeto
npm run build

# Executa apenas o backend
cd backend && npm start
```

## 📱 Funcionalidades

### 👥 Gestão de Funcionários (Admin)
- ✅ Cadastro de funcionários
- ✅ Edição de dados
- ✅ Ativação/desativação
- ✅ Listagem com filtros

### 🗺️ Gestão de Rotas (Admin)
- ✅ Criação de rotas
- ✅ Definição de pontos de parada
- ✅ Atribuição a funcionários
- ✅ Ativação/desativação

### 🚛 Execução de Rotas (Funcionário)
- ✅ Login no sistema
- ✅ Visualização de rotas atribuídas
- ✅ Início de execução
- ✅ Marcação de progresso
- ✅ Adição de observações
- ✅ Finalização de rotas

### 📊 Relatórios (Admin)
- ✅ Rotas concluídas por período
- ✅ Desempenho por funcionário
- ✅ Estatísticas gerais

## 🔐 Autenticação

O sistema utiliza JWT com refresh token para autenticação:

- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido por 7 dias
- **Roles**: Admin e Employee
- **Proteção de rotas**: Baseada em roles

## 🚀 Deploy

### Frontend
1. Conecte o repositório ao seu provedor (Netlify, Vercel, etc.)
2. Configure as variáveis de ambiente
3. Build command: `cd frontend && npm run build`
4. Publish directory: `frontend/dist`

### Backend
1. Conecte o repositório ao seu provedor (Render, Railway, etc.)
2. Configure as variáveis de ambiente
3. Build command: `cd backend && npm run build`
4. Start command: `cd backend && npm start`

## 🧪 Testes

```bash
# Testes do backend
cd backend && npm test

# Testes do frontend
cd frontend && npm test
```

## 📝 Scripts Disponíveis

### Raiz do projeto
- `npm run dev` - Executa frontend e backend
- `npm run build` - Build de produção
- `npm run lint` - Lint de todo o projeto
- `npm run format` - Formatação de código

### Backend
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build TypeScript
- `npm start` - Executa em produção
- `npm run lint` - ESLint
- `npm run format` - Prettier

### Frontend
- `npm run dev` - Desenvolvimento com Vite
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - ESLint
- `npm run format` - Prettier

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: seu@email.com
- GitHub Issues: [Link para issues]

---

Desenvolvido com ❤️ por [Seu Nome]