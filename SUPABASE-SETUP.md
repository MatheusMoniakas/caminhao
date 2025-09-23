# 🗄️ Configuração do Supabase - Passo a Passo

Este guia te ajudará a configurar o banco de dados PostgreSQL no Supabase para o sistema de gestão de rotas.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Navegador web
- Acesso ao projeto configurado

## 🚀 Passo 1: Criar Projeto no Supabase

### 1.1 Acesse o Supabase
1. Vá para [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"Sign up"**
3. Faça login com GitHub, Google ou email

### 1.2 Criar Novo Projeto
1. Clique em **"New Project"**
2. Preencha os dados:
   - **Name**: `caminhao-routes` (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte (salve em local seguro!)
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
3. Clique em **"Create new project"**
4. Aguarde a criação (pode levar alguns minutos)

## 🔧 Passo 2: Configurar o Banco de Dados

### 2.1 Acessar o SQL Editor
1. No painel do Supabase, vá para **"SQL Editor"** no menu lateral
2. Clique em **"New query"**

### 2.2 Executar Script de Criação das Tabelas

**Opção 1: Usar arquivo SQL (Recomendado)**
1. Baixe o arquivo `supabase-schema.sql` do projeto
2. No SQL Editor, clique em **"Upload SQL file"**
3. Selecione o arquivo `supabase-schema.sql`
4. Clique em **"Run"**

**Opção 2: Copiar e colar manualmente**
Copie e cole o seguinte SQL no editor:

```sql
-- =============================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema de Gestão de Rotas de Caminhões
-- =============================================

-- Limpar tabelas existentes (se houver)
DROP TABLE IF EXISTS route_executions CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Limpar funções existentes
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =============================================
-- CRIAÇÃO DAS TABELAS
-- =============================================

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

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_routes_assigned_employee ON routes(assigned_employee_id);
CREATE INDEX idx_route_executions_employee ON route_executions(employee_id);
CREATE INDEX idx_route_executions_route ON route_executions(route_id);
CREATE INDEX idx_route_executions_status ON route_executions(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- =============================================

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at 
    BEFORE UPDATE ON routes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_route_executions_updated_at 
    BEFORE UPDATE ON route_executions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir usuário administrador padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (email, password, name, role, is_active) 
VALUES (
  'admin@caminhao.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2a',
  'Administrador',
  'admin',
  true
);
```

### 2.3 Executar o Script
1. Clique em **"Run"** ou pressione `Ctrl+Enter`
2. Verifique se apareceu "Success. No rows returned" ou similar
3. Se houver erro, verifique a sintaxe e execute novamente

## 🔑 Passo 3: Obter Chaves de API

### 3.1 Acessar Configurações do Projeto
1. No menu lateral, vá para **"Settings"**
2. Clique em **"API"**

### 3.2 Copiar as Chaves Necessárias
Você precisará de:

1. **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
2. **anon public** key (chave pública)
3. **service_role** key (chave de serviço - **MANTENHA SECRETA!**)

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1 Backend - Criar arquivo .env
1. No projeto, vá para a pasta `backend/`
2. Crie um arquivo chamado `.env` (copie do `env.example`)
3. Preencha com suas credenciais:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Supabase)
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# JWT Configuration
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-super-secreta-aqui
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4.2 Frontend - Criar arquivo .env
1. Na pasta `frontend/`, crie um arquivo `.env`
2. Preencha com:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Sistema de Gestão de Rotas
VITE_APP_VERSION=1.0.0
```

## 👤 Passo 5: Verificar Usuário Administrador

### 5.1 Verificar Criação do Admin
O usuário administrador já foi criado automaticamente pelo script SQL. Para verificar, execute no SQL Editor:

```sql
SELECT id, email, name, role, is_active, created_at 
FROM users 
WHERE role = 'admin';
```

**📧 Login**: admin@caminhao.com  
**🔑 Senha**: admin123  
**⚠️ IMPORTANTE**: Altere a senha após o primeiro login!

## 🧪 Passo 6: Testar a Conexão

### 6.1 Instalar Dependências
```bash
# Na raiz do projeto
npm run install:all
```

### 6.2 Executar o Backend
```bash
npm run dev:backend
```

### 6.3 Verificar Logs
Se tudo estiver correto, você verá:
```
🚀 Server running on port 3001
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
⏱️  Rate limit: 100 requests per 900s
```

### 6.4 Testar API
Abra o navegador e vá para: `http://localhost:3001/health`

Deve retornar:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🚀 Passo 7: Executar o Projeto Completo

### 7.1 Executar Frontend e Backend
```bash
# Na raiz do projeto
npm run dev
```

### 7.2 Acessar a Aplicação
1. Frontend: `http://localhost:5173`
2. Backend: `http://localhost:3001`

### 7.3 Fazer Login
- **Email**: `admin@caminhao.com`
- **Senha**: `admin123`

## 🔒 Passo 8: Configurações de Segurança (Opcional)

### 8.1 Row Level Security (RLS)
Para maior segurança, você pode ativar RLS:

```sql
-- Ativar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_executions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all data" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );
```

### 8.2 Configurar Autenticação (Opcional)
Se quiser usar autenticação nativa do Supabase:

1. Vá para **"Authentication"** > **"Settings"**
2. Configure **"Site URL"**: `http://localhost:5173`
3. Adicione **"Redirect URLs"**: `http://localhost:5173/**`

## 🐛 Solução de Problemas

### Erro de Conexão
- Verifique se as URLs e chaves estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se não há firewall bloqueando

### Erro de Tabela Não Encontrada
- Execute novamente o script SQL
- Verifique se as tabelas foram criadas em **"Table Editor"**

### Erro de CORS
- Verifique se `FRONTEND_URL` está correto no `.env`
- Confirme se o frontend está rodando na porta 5173

### Erro de JWT
- Gere novas chaves JWT secretas
- Use ferramentas online para gerar strings aleatórias

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Verifique se todas as variáveis de ambiente estão corretas

---

✅ **Configuração concluída!** Seu banco de dados está pronto para uso.
