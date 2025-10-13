# 📋 ESPECIFICAÇÃO FUNCIONAL
## Sistema de Gestão de Rotas de Caminhões

---

## 📖 1. VISÃO GERAL DO SISTEMA

### 1.1 Propósito
O Sistema de Gestão de Rotas de Caminhões é uma aplicação web fullstack desenvolvida para gerenciar operações logísticas de transporte, incluindo cadastro de funcionários, criação de rotas, execução de entregas e relatórios de performance.

### 1.2 Escopo
- **Frontend**: Interface web responsiva para administradores e funcionários
- **Backend**: API REST para gerenciamento de dados e integração com WhatsApp
- **Banco de Dados**: PostgreSQL (Supabase) para persistência de dados
- **Integração**: Sistema de notificações via WhatsApp

### 1.3 Tecnologias
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Banco**: PostgreSQL (Supabase)
- **Autenticação**: JWT com refresh token
- **Notificações**: WhatsApp via Baileys

---

## 👥 2. PERFIS DE USUÁRIO

### 2.1 Administrador
**Responsabilidades:**
- Gerenciar funcionários (CRUD)
- Criar e gerenciar rotas
- Visualizar relatórios e estatísticas
- Monitorar execução de rotas
- Gerenciar problemas reportados

**Acesso:**
- Dashboard administrativo
- Gestão de funcionários
- Gestão de rotas
- Relatórios e problemas

### 2.2 Funcionário (Motorista/Ajudante)
**Responsabilidades:**
- Visualizar rotas atribuídas
- Executar rotas (iniciar, atualizar status, finalizar)
- Reportar problemas
- Adicionar observações

**Acesso:**
- Visualização de rotas atribuídas
- Execução de rotas
- Relatório de problemas

---

## 🔐 3. SISTEMA DE AUTENTICAÇÃO E AUTORIZAÇÃO

### 3.1 Autenticação
- **Login**: Email e senha
- **JWT**: Access token (1 hora) + Refresh token (7 dias)
- **Hash de Senha**: Bcrypt
- **Validação**: Joi para validação de dados

### 3.2 Autorização
- **Roles**: `admin` e `employee`
- **Proteção de Rotas**: Baseada em roles
- **Middleware**: Verificação de token em todas as rotas protegidas

### 3.3 Fluxo de Autenticação
1. Usuário faz login com email/senha
2. Sistema valida credenciais
3. Gera access token e refresh token
4. Cliente armazena tokens
5. Requisições incluem access token no header
6. Token expirado → usar refresh token para renovar

---

## 📊 4. MODELO DE DADOS

### 4.1 Entidades Principais

#### 4.1.1 Usuário (users)
```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Email único
  password: string;              // Hash da senha
  name: string;                  // Nome completo
  phone?: string;                // Telefone para WhatsApp
  role: 'admin' | 'employee';    // Papel no sistema
  isActive: boolean;             // Status ativo/inativo
  createdAt: string;             // Data de criação
  updatedAt: string;             // Data de atualização
}
```

#### 4.1.2 Rota (routes)
```typescript
interface Route {
  id: string;                    // UUID
  name: string;                  // Nome da rota
  description?: string;          // Descrição opcional
  startPoint: string;            // Ponto de partida
  endPoint: string;              // Ponto de destino
  waypoints: string[];           // Pontos intermediários
  driverId?: string;             // ID do motorista
  helperId?: string;             // ID do ajudante
  scheduledDate?: string;        // Data agendada
  shift?: string;                // Turno (manhã/tarde/noite)
  isActive: boolean;             // Status ativo/inativo
  createdAt: string;             // Data de criação
  updatedAt: string;             // Data de atualização
}
```

#### 4.1.3 Execução de Rota (route_executions)
```typescript
interface RouteExecution {
  id: string;                    // UUID
  routeId: string;               // ID da rota
  employeeId: string;            // ID do funcionário
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: string;            // Horário de início
  endTime?: string;              // Horário de fim
  observations?: string;         // Observações do funcionário
  problemResolved?: boolean;     // Problema resolvido
  createdAt: string;             // Data de criação
  updatedAt: string;             // Data de atualização
}
```

### 4.2 Relacionamentos
- **User → Route**: Um usuário pode ser motorista/ajudante de várias rotas
- **Route → RouteExecution**: Uma rota pode ter várias execuções
- **User → RouteExecution**: Um usuário pode executar várias rotas

---

## 🎯 5. FUNCIONALIDADES PRINCIPAIS

### 5.1 Gestão de Funcionários (Admin)

#### 5.1.1 Cadastro de Funcionário
**Funcionalidade**: Criar novo funcionário no sistema
**Campos Obrigatórios**:
- Nome completo
- Email (único)
- Senha (mínimo 6 caracteres)
- Telefone (opcional, para WhatsApp)

**Validações**:
- Email único no sistema
- Senha com mínimo 6 caracteres
- Telefone no formato brasileiro

#### 5.1.2 Listagem de Funcionários
**Funcionalidade**: Visualizar todos os funcionários
**Filtros Disponíveis**:
- Status (ativo/inativo)
- Role (admin/employee)
- Busca por nome ou email

**Ações Disponíveis**:
- Editar dados
- Ativar/desativar
- Visualizar detalhes

#### 5.1.3 Edição de Funcionário
**Funcionalidade**: Atualizar dados do funcionário
**Campos Editáveis**:
- Nome
- Email
- Telefone
- Status ativo/inativo

### 5.2 Gestão de Rotas (Admin)

#### 5.2.1 Criação de Rota
**Funcionalidade**: Criar nova rota de entrega
**Campos Obrigatórios**:
- Nome da rota
- Ponto de partida
- Ponto de destino

**Campos Opcionais**:
- Descrição
- Pontos intermediários (waypoints)
- Motorista atribuído
- Ajudante atribuído
- Data agendada
- Turno

**Ações Automáticas**:
- Envio de notificação WhatsApp para motorista/ajudante
- Criação automática de execução de rota

#### 5.2.2 Listagem de Rotas
**Funcionalidade**: Visualizar todas as rotas
**Filtros Disponíveis**:
- Status (ativa/inativa)
- Motorista atribuído
- Status de execução
- Data de criação

**Ações Disponíveis**:
- Editar rota
- Duplicar rota
- Ativar/desativar
- Visualizar execuções

#### 5.2.3 Duplicação de Rota
**Funcionalidade**: Criar nova rota baseada em rota existente
**Dados Copiados**:
- Nome (com sufixo "Cópia")
- Pontos de partida e destino
- Waypoints
- Descrição

**Dados Não Copiados**:
- Motorista/ajudante (deve ser reatribuído)
- Data agendada
- Execuções

### 5.3 Execução de Rotas (Funcionário)

#### 5.3.1 Visualização de Rotas Atribuídas
**Funcionalidade**: Listar rotas atribuídas ao funcionário
**Informações Exibidas**:
- Nome da rota
- Pontos de partida e destino
- Data agendada
- Status atual
- Observações

#### 5.3.2 Início de Execução
**Funcionalidade**: Iniciar execução de uma rota
**Ações**:
- Marcar status como "in_progress"
- Registrar horário de início
- Criar registro de execução se não existir

#### 5.3.3 Atualização de Status
**Funcionalidade**: Atualizar progresso da execução
**Status Disponíveis**:
- `pending`: Aguardando início
- `in_progress`: Em execução
- `completed`: Concluída
- `cancelled`: Cancelada

**Campos Opcionais**:
- Observações
- Indicação de problema resolvido

#### 5.3.4 Finalização de Rota
**Funcionalidade**: Finalizar execução da rota
**Ações**:
- Marcar status como "completed" ou "cancelled"
- Registrar horário de fim
- Permitir adicionar observações finais

### 5.4 Dashboard e Relatórios (Admin)

#### 5.4.1 Dashboard Principal
**Métricas Exibidas**:
- Total de funcionários ativos
- Total de rotas criadas
- Rotas em execução
- Rotas concluídas no período
- Taxa de conclusão

#### 5.4.2 Relatórios de Performance
**Funcionalidade**: Visualizar estatísticas de execução
**Métricas Disponíveis**:
- Rotas concluídas por funcionário
- Tempo médio de execução
- Taxa de problemas reportados
- Performance por período

### 5.5 Gestão de Problemas (Admin)

#### 5.5.1 Visualização de Problemas
**Funcionalidade**: Monitorar problemas reportados
**Informações Exibidas**:
- Rota com problema
- Funcionário que reportou
- Status do problema
- Observações
- Data do reporte

#### 5.5.2 Resolução de Problemas
**Funcionalidade**: Marcar problemas como resolvidos
**Ações**:
- Atualizar status do problema
- Adicionar observações de resolução
- Notificar funcionário sobre resolução

---

## 📱 6. INTEGRAÇÃO WHATSAPP

### 6.1 Notificações Automáticas
**Funcionalidade**: Envio automático de notificações via WhatsApp

#### 6.1.1 Notificação de Nova Rota
**Trigger**: Criação de nova rota
**Destinatários**: Motorista e ajudante atribuídos
**Conteúdo da Mensagem**:
```
🚛 *Nova Rota Criada*

📋 *Rota:* [Nome da Rota]
📅 *Data:* [Data Agendada]
⏰ *Turno:* [Turno]
👥 *Equipe:* [Motorista] e [Ajudante]

✅ Rota criada com sucesso! Verifique os detalhes no sistema.
```

#### 6.1.2 Configuração WhatsApp
**Requisitos**:
- Número de telefone cadastrado no perfil do funcionário
- Servidor WhatsApp (Baileys) configurado
- Variáveis de ambiente configuradas

**Tratamento de Erros**:
- Falha no envio não impede criação da rota
- Log de tentativas de envio
- Aviso quando funcionário não tem telefone cadastrado

---

## 🔧 7. API REST

### 7.1 Endpoints de Autenticação
```
POST /api/auth/login          # Login do usuário
POST /api/auth/register       # Registro de usuário
POST /api/auth/refresh        # Renovar access token
POST /api/auth/logout         # Logout do usuário
```

### 7.2 Endpoints de Funcionários
```
GET    /api/employees         # Listar funcionários
POST   /api/employees         # Criar funcionário
GET    /api/employees/:id     # Obter funcionário
PUT    /api/employees/:id     # Atualizar funcionário
DELETE /api/employees/:id     # Deletar funcionário
```

### 7.3 Endpoints de Rotas
```
GET    /api/routes            # Listar rotas
POST   /api/routes            # Criar rota
GET    /api/routes/:id        # Obter rota
PUT    /api/routes/:id        # Atualizar rota
DELETE /api/routes/:id        # Deletar rota
```

### 7.4 Endpoints de Execução de Rotas
```
GET    /api/route-executions           # Listar execuções
POST   /api/route-executions/start     # Iniciar execução
PUT    /api/route-executions/:id       # Atualizar execução
GET    /api/route-executions/:id       # Obter execução
```

### 7.5 Endpoints de Sistema
```
GET    /health               # Health check
GET    /api                  # Informações da API
GET    /api/test             # Teste de conectividade
GET    /api/test-auth        # Teste de autenticação
```

---

## 🛡️ 8. SEGURANÇA

### 8.1 Autenticação
- **JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash de senhas com salt
- **Rate Limiting**: Proteção contra ataques de força bruta

### 8.2 Autorização
- **Middleware de Autenticação**: Verificação de token em rotas protegidas
- **Controle de Acesso**: Baseado em roles (admin/employee)
- **Validação de Dados**: Joi para validação de entrada

### 8.3 Segurança de Dados
- **CORS**: Configuração de origens permitidas
- **Helmet**: Headers de segurança
- **Compression**: Compressão de respostas
- **Environment Variables**: Configurações sensíveis em variáveis de ambiente

---

## 📊 9. MONITORAMENTO E LOGS

### 9.1 Logs de Sistema
- **Autenticação**: Tentativas de login
- **Operações**: Criação, edição e exclusão de dados
- **WhatsApp**: Envio de notificações
- **Erros**: Logs de erros com stack trace

### 9.2 Métricas de Performance
- **Tempo de Resposta**: APIs
- **Taxa de Erro**: Requisições com falha
- **Uso de Recursos**: CPU, memória, banco de dados

---

## 🚀 10. DEPLOY E INFRAESTRUTURA

### 10.1 Ambiente de Desenvolvimento
- **Frontend**: Vite dev server (porta 5173)
- **Backend**: Node.js com nodemon (porta 3001)
- **Banco**: Supabase (desenvolvimento)

### 10.2 Ambiente de Produção
- **Frontend**: Build estático (Netlify/Vercel)
- **Backend**: Node.js em servidor (Render/Railway)
- **Banco**: Supabase (produção)
- **WhatsApp**: Servidor Baileys independente

### 10.3 Variáveis de Ambiente
**Backend**:
- `SUPABASE_URL`: URL do Supabase
- `SUPABASE_ANON_KEY`: Chave anônima
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço
- `JWT_SECRET`: Chave secreta JWT
- `JWT_REFRESH_SECRET`: Chave refresh token
- `WHATSAPP_API_URL`: URL do servidor WhatsApp
- `WHATSAPP_API_TOKEN`: Token do WhatsApp

**Frontend**:
- `VITE_API_URL`: URL da API backend

---

## 📋 11. CASOS DE USO PRINCIPAIS

### 11.1 Caso de Uso: Criar Nova Rota
**Ator**: Administrador
**Fluxo Principal**:
1. Admin acessa página de rotas
2. Clica em "Nova Rota"
3. Preenche dados da rota
4. Seleciona motorista e ajudante
5. Salva a rota
6. Sistema envia notificação WhatsApp
7. Sistema cria execução de rota

**Fluxos Alternativos**:
- Motorista/ajudante sem telefone: Rota criada sem notificação
- Falha no WhatsApp: Rota criada, erro logado

### 11.2 Caso de Uso: Executar Rota
**Ator**: Funcionário (Motorista)
**Fluxo Principal**:
1. Funcionário faz login
2. Acessa "Minhas Rotas"
3. Visualiza rotas atribuídas
4. Clica em "Iniciar" em uma rota
5. Sistema marca como "in_progress"
6. Funcionário atualiza status conforme necessário
7. Funcionário finaliza rota
8. Sistema marca como "completed"

**Fluxos Alternativos**:
- Cancelar rota: Marcar como "cancelled"
- Reportar problema: Adicionar observações

### 11.3 Caso de Uso: Gerenciar Funcionários
**Ator**: Administrador
**Fluxo Principal**:
1. Admin acessa página de funcionários
2. Visualiza lista de funcionários
3. Pode criar, editar ou desativar funcionários
4. Sistema valida dados
5. Sistema atualiza banco de dados

---

## 🔄 12. FLUXOS DE TRABALHO

### 12.1 Fluxo de Criação de Rota
```
Admin → Criar Rota → Validar Dados → Salvar no Banco → 
Enviar WhatsApp → Criar Execução → Notificar Sucesso
```

### 12.2 Fluxo de Execução de Rota
```
Funcionário → Visualizar Rotas → Iniciar Execução → 
Atualizar Status → Finalizar → Registrar Observações
```

### 12.3 Fluxo de Autenticação
```
Usuário → Login → Validar Credenciais → Gerar Tokens → 
Armazenar Tokens → Acessar Sistema
```

---

## 📈 13. MÉTRICAS E KPIs

### 13.1 Métricas Operacionais
- **Taxa de Conclusão de Rotas**: % de rotas concluídas
- **Tempo Médio de Execução**: Tempo entre início e fim
- **Taxa de Problemas**: % de rotas com problemas reportados
- **Eficiência por Funcionário**: Rotas concluídas por funcionário

### 13.2 Métricas de Sistema
- **Uptime**: Disponibilidade do sistema
- **Tempo de Resposta**: Latência das APIs
- **Taxa de Erro**: % de requisições com falha
- **Uso de Recursos**: CPU, memória, banco

---

## 🎯 14. OBJETIVOS DO SISTEMA

### 14.1 Objetivos Primários
- **Automatizar** gestão de rotas de entrega
- **Otimizar** comunicação entre admin e funcionários
- **Centralizar** informações de operações logísticas
- **Facilitar** acompanhamento de performance

### 14.2 Objetivos Secundários
- **Reduzir** tempo de planejamento de rotas
- **Melhorar** comunicação via WhatsApp
- **Aumentar** visibilidade das operações
- **Simplificar** relatórios e análises

---

## 📝 15. CONSIDERAÇÕES TÉCNICAS

### 15.1 Performance
- **Paginação**: Listas grandes paginadas
- **Índices**: Banco otimizado com índices
- **Cache**: React Query para cache de dados
- **Compressão**: Respostas comprimidas

### 15.2 Escalabilidade
- **Arquitetura**: Separação frontend/backend
- **Banco**: Supabase com escalabilidade automática
- **API**: RESTful para fácil integração
- **Deploy**: Infraestrutura cloud

### 15.3 Manutenibilidade
- **TypeScript**: Tipagem estática
- **Estrutura**: Código organizado em módulos
- **Documentação**: Código documentado
- **Testes**: Estrutura preparada para testes

---

*Esta especificação funcional documenta todas as funcionalidades, regras de negócio e aspectos técnicos do Sistema de Gestão de Rotas de Caminhões, servindo como referência para desenvolvimento, manutenção e evolução do sistema.*

