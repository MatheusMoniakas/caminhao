# 📚 DOCUMENTAÇÃO TÉCNICA
## Sistema de Gestão de Rotas de Caminhões

---

## 🏗️ 1. ARQUITETURA DO SISTEMA

### 1.1 Visão Geral da Arquitetura
O sistema segue uma arquitetura **fullstack** com separação clara entre frontend e backend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Supabase)    │
│   Port: 5173    │    │   Port: 3001    │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │   JWT Auth      │    │   File Storage  │
│   (Baileys)     │    │   Middleware    │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Padrões Arquiteturais
- **MVC (Model-View-Controller)**: Separação de responsabilidades
- **Repository Pattern**: Abstração de acesso a dados
- **Service Layer**: Lógica de negócio centralizada
- **Middleware Pattern**: Processamento de requisições
- **Context API**: Gerenciamento de estado global (React)

---

## 🎨 2. FRONTEND - REACT APPLICATION

### 2.1 Estrutura de Pastas
```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal com sidebar
│   ├── Loading.tsx     # Componente de loading
│   ├── AddEmployeeModal.tsx
│   └── AddRouteModal.tsx
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login
│   ├── Register.tsx    # Página de registro
│   ├── Dashboard.tsx   # Dashboard administrativo
│   ├── Employees.tsx   # Gestão de funcionários
│   ├── Routes.tsx      # Gestão de rotas
│   ├── MyRoutes.tsx    # Rotas do funcionário
│   └── Problems.tsx    # Gestão de problemas
├── context/            # Context API
│   ├── AuthContext.tsx # Contexto de autenticação
│   └── ThemeContext.tsx # Contexto de tema
├── services/           # Serviços de API
│   └── api.ts         # Cliente HTTP
├── types/             # Tipos TypeScript
│   └── index.ts       # Interfaces e tipos
├── App.tsx            # Componente raiz
└── main.tsx           # Ponto de entrada
```

### 2.2 Componentes Principais

#### 2.2.1 App.tsx - Roteamento Principal
```typescript
// Responsabilidades:
// - Configuração de rotas
// - Proteção de rotas baseada em roles
// - Redirecionamento baseado em autenticação

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
        } />
        
        {/* Redirecionamento baseado em role */}
        <Route path="/" element={<NavigateToRoleBasedRoute />} />
      </Routes>
    </ThemeProvider>
  );
};
```

#### 2.2.2 Layout.tsx - Layout Principal
```typescript
// Responsabilidades:
// - Sidebar com navegação
// - Header com informações do usuário
// - Toggle de tema (dark/light)
// - Logout do usuário

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Navegação filtrada por role
  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.employeeOnly && user?.role !== 'employee') return false;
    return true;
  });
};
```

#### 2.2.3 AuthContext.tsx - Gerenciamento de Autenticação
```typescript
// Responsabilidades:
// - Estado global de autenticação
// - Login/logout de usuários
// - Persistência de tokens
// - Verificação de autenticação

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### 2.3 Páginas Principais

#### 2.3.1 Dashboard.tsx - Painel Administrativo
```typescript
// Funcionalidades:
// - Métricas gerais do sistema
// - Gráficos de performance
// - Estatísticas de rotas
// - Resumo de funcionários

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRoutes: 0,
    activeRoutes: 0,
    completedRoutes: 0
  });
};
```

#### 2.3.2 Employees.tsx - Gestão de Funcionários
```typescript
// Funcionalidades:
// - Listagem de funcionários
// - Criação de novos funcionários
// - Edição de dados
// - Ativação/desativação
// - Filtros e busca

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateEmployee = async (data: CreateEmployeeRequest) => {
    // Lógica de criação
  };
};
```

#### 2.3.3 Routes.tsx - Gestão de Rotas
```typescript
// Funcionalidades:
// - Listagem de rotas
// - Criação de novas rotas
// - Duplicação de rotas
// - Atribuição de funcionários
// - Status de execução

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [executions, setExecutions] = useState<RouteExecution[]>([]);
  
  const handleDuplicateRoute = (route: Route) => {
    // Lógica de duplicação
  };
};
```

### 2.4 Serviços e Utilitários

#### 2.4.1 api.ts - Cliente HTTP
```typescript
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    this.setupInterceptors();
  }
  
  // Interceptors para:
  // - Adicionar token automaticamente
  // - Renovar token expirado
  // - Tratar erros de autenticação
  
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
}
```

---

## ⚙️ 3. BACKEND - NODE.JS API

### 3.1 Estrutura de Pastas
```
backend/src/
├── config/             # Configurações
│   ├── index.ts       # Configurações principais
│   └── database.ts    # Configuração do banco
├── controllers/        # Controladores (MVC)
│   ├── AuthController.ts
│   ├── EmployeeController.ts
│   ├── RouteController.ts
│   └── RouteExecutionController.ts
├── middleware/         # Middlewares
│   ├── auth.ts        # Autenticação JWT
│   ├── errorHandler.ts # Tratamento de erros
│   └── validation.ts  # Validação de dados
├── routes/            # Definição de rotas
│   ├── auth.ts
│   ├── employees.ts
│   ├── routes.ts
│   └── routeExecutions.ts
├── services/          # Lógica de negócio
│   ├── UserService.ts
│   ├── RouteService.ts
│   ├── RouteExecutionService.ts
│   └── WhatsAppService.ts
├── types/             # Tipos TypeScript
│   └── index.ts
└── index.ts           # Ponto de entrada
```

### 3.2 Configurações

#### 3.2.1 config/index.ts - Configurações Principais
```typescript
export const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database (Supabase)
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://admincaminhao.netlify.app',
      'https://caminhao-frontend.vercel.app'
    ],
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
```

### 3.3 Middlewares

#### 3.3.1 auth.ts - Autenticação JWT
```typescript
// Middleware de autenticação
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    (req as AuthRequest).user = decoded.user;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Middleware para verificar role de admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  if (authReq.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }
  next();
};
```

#### 3.3.2 validation.ts - Validação de Dados
```typescript
// Middleware de validação usando Joi
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      });
      return;
    }
    
    next();
  };
};

// Schemas de validação
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const createRouteSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  startPoint: Joi.string().min(2).max(100).allow('').optional(),
  endPoint: Joi.string().min(2).max(100).allow('').optional(),
  waypoints: Joi.array().items(Joi.string().min(1)).optional(),
  driverId: Joi.string().uuid().required(),
  helperId: Joi.string().uuid().allow('').optional(),
  scheduledDate: Joi.string().isoDate().required(),
  shift: Joi.string().valid('manha', 'tarde', 'noite', 'madrugada').required()
});
```

#### 3.3.3 errorHandler.ts - Tratamento de Erros
```typescript
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

### 3.4 Serviços (Business Logic)

#### 3.4.1 UserService.ts - Gerenciamento de Usuários
```typescript
export class UserService {
  // Criar usuário com hash de senha
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: 'admin' | 'employee';
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  // Verificar senha
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Mapear dados do banco para interface
  private mapUserFromDatabase(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
```

#### 3.4.2 RouteService.ts - Gerenciamento de Rotas
```typescript
export class RouteService {
  private whatsappService: WhatsAppService;
  private userService: UserService;

  constructor() {
    this.whatsappService = new WhatsAppService();
    this.userService = new UserService();
  }

  // Criar rota com notificação WhatsApp
  async createRoute(routeData: CreateRouteRequest): Promise<Route> {
    const insertData = {
      name: routeData.name,
      description: routeData.description || null,
      start_point: routeData.startPoint || null,
      end_point: routeData.endPoint || null,
      waypoints: routeData.waypoints || [],
      driver_id: routeData.driverId || null,
      helper_id: routeData.helperId || null,
      scheduled_date: routeData.scheduledDate || null,
      shift: routeData.shift || null,
      is_active: true
    };

    const { data, error } = await supabaseAdmin
      .from('routes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create route: ${error.message}`);
    }

    const route = this.mapRouteFromDatabase(data);

    // Enviar notificação WhatsApp
    await this.sendWhatsAppNotifications(route);

    return route;
  }

  // Enviar notificações WhatsApp
  private async sendWhatsAppNotifications(route: Route): Promise<void> {
    try {
      const driver = await this.userService.getUserById(route.driverId);
      const helper = route.helperId ? await this.userService.getUserById(route.helperId) : null;

      if (!driver?.phone) {
        console.warn(`Driver ${driver?.name} does not have a phone number registered`);
        return;
      }

      const notificationData = {
        routeName: route.name,
        scheduledDate: route.scheduledDate || new Date().toISOString(),
        shift: route.shift || 'Não especificado',
        driverName: driver.name,
        helperName: helper?.name
      };

      const results = await this.whatsappService.sendRouteNotification(
        driver.phone,
        helper?.phone,
        notificationData
      );

      // Log dos resultados
      if (results.driverSent) {
        console.log(`WhatsApp notification sent to driver: ${driver.name}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp notifications:', error);
    }
  }
}
```

#### 3.4.3 WhatsAppService.ts - Integração WhatsApp
```typescript
export class WhatsAppService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || '';
    this.apiToken = process.env.WHATSAPP_API_TOKEN || '';
  }

  // Enviar mensagem via WhatsApp
  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.apiUrl) {
      console.warn('WhatsApp API not configured. Message not sent to:', phoneNumber);
      return false;
    }

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      // Detectar tipo de API
      const isBaileys = this.apiUrl.includes('baileys') || this.apiUrl.includes('localhost:3001');
      
      let requestData: any;
      let headers: any;

      if (isBaileys) {
        // Formato para Baileys
        requestData = {
          sessionId: 'default',
          phone: formattedPhone,
          message: message
        };
        headers = { 'Content-Type': 'application/json' };
      } else {
        // Formato genérico
        requestData = {
          to: formattedPhone,
          message: message
        };
        headers = {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        };
      }

      const response = await axios.post(this.apiUrl, requestData, {
        headers,
        timeout: 10000
      });

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Criar mensagem formatada para rota
  private createRouteMessage(routeData: RouteNotificationData): string {
    const { routeName, scheduledDate, shift, driverName, helperName } = routeData;
    
    const date = new Date(scheduledDate).toLocaleDateString('pt-BR');
    const teamInfo = helperName ? `${driverName} (Motorista) e ${helperName} (Ajudante)` : driverName;

    return `🚛 *Nova Rota Criada*

📋 *Rota:* ${routeName}
📅 *Data:* ${date}
⏰ *Turno:* ${shift}
👥 *Equipe:* ${teamInfo}

✅ Rota criada com sucesso! Verifique os detalhes no sistema.`;
  }
}
```

### 3.5 Controladores (Controllers)

#### 3.5.1 AuthController.ts - Autenticação
```typescript
export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Login do usuário
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await this.userService.getUserByEmailWithPassword(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      const isValidPassword = await this.userService.verifyPassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      if (!user.is_active) {
        res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
        return;
      }

      const accessToken = jwt.sign(
        { user: this.userService.mapUserFromDatabase(user) },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      res.json({
        success: true,
        data: {
          user: this.userService.mapUserFromDatabase(user),
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
```

### 3.6 Rotas (Routes)

#### 3.6.1 Estrutura de Rotas
```typescript
// auth.ts
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

// employees.ts
router.get('/', authenticateToken, requireAdmin, employeeController.getAllEmployees);
router.post('/', authenticateToken, requireAdmin, validateRequest(createEmployeeSchema), employeeController.createEmployee);
router.get('/:id', authenticateToken, requireAdmin, employeeController.getEmployeeById);
router.put('/:id', authenticateToken, requireAdmin, validateRequest(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', authenticateToken, requireAdmin, employeeController.deleteEmployee);

// routes.ts
router.get('/', authenticateToken, requireAdmin, routeController.getAllRoutes);
router.post('/', authenticateToken, requireAdmin, validateRequest(createRouteSchema), routeController.createRoute);
router.get('/:id', authenticateToken, requireAdmin, routeController.getRouteById);
router.put('/:id', authenticateToken, requireAdmin, validateRequest(updateRouteSchema), routeController.updateRoute);
router.delete('/:id', authenticateToken, requireAdmin, routeController.deleteRoute);
```

---

## 🗄️ 4. BANCO DE DADOS - SUPABASE

### 4.1 Estrutura das Tabelas

#### 4.1.1 Tabela `users`
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.2 Tabela `routes`
```sql
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_point VARCHAR(255),
  end_point VARCHAR(255),
  waypoints TEXT[] DEFAULT '{}',
  driver_id UUID REFERENCES users(id),
  helper_id UUID REFERENCES users(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  shift VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.3 Tabela `route_executions`
```sql
CREATE TABLE route_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id),
  employee_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  observations TEXT,
  problem_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Índices para Performance
```sql
-- Índices para otimização de consultas
CREATE INDEX idx_routes_driver_id ON routes(driver_id);
CREATE INDEX idx_routes_helper_id ON routes(helper_id);
CREATE INDEX idx_route_executions_employee ON route_executions(employee_id);
CREATE INDEX idx_route_executions_route ON route_executions(route_id);
CREATE INDEX idx_route_executions_status ON route_executions(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 4.3 Funções e Triggers
```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_route_executions_updated_at BEFORE UPDATE ON route_executions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔧 5. CONFIGURAÇÃO E DEPLOY

### 5.1 Variáveis de Ambiente

#### 5.1.1 Backend (.env)
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

# WhatsApp Configuration
WHATSAPP_API_URL=http://localhost:3001/send-message
WHATSAPP_API_TOKEN=nao_precisa_para_baileys
```

#### 5.1.2 Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Sistema de Gestão de Rotas
VITE_APP_VERSION=1.0.0
```

### 5.2 Scripts de Build

#### 5.2.1 Backend Build
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc && node scripts/fix-imports.js",
    "start": "node dist/index.js"
  }
}
```

#### 5.2.2 Frontend Build
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 5.3 Deploy

#### 5.3.1 Frontend (Netlify/Vercel)
- **Build Command**: `cd frontend && npm run build`
- **Publish Directory**: `frontend/dist`
- **Environment Variables**: `VITE_API_URL`

#### 5.3.2 Backend (Render/Railway)
- **Build Command**: `cd backend && npm run build`
- **Start Command**: `cd backend && npm start`
- **Environment Variables**: Todas as variáveis do backend

---

## 🧪 6. TESTES E QUALIDADE

### 6.1 Estrutura de Testes
```
tests/
├── unit/              # Testes unitários
│   ├── services/      # Testes de serviços
│   ├── controllers/   # Testes de controladores
│   └── utils/         # Testes de utilitários
├── integration/       # Testes de integração
│   ├── api/          # Testes de API
│   └── database/     # Testes de banco
└── e2e/              # Testes end-to-end
    ├── auth/         # Testes de autenticação
    └── routes/       # Testes de rotas
```

### 6.2 Ferramentas de Qualidade
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **TypeScript**: Verificação de tipos
- **Jest**: Framework de testes
- **Supertest**: Testes de API

---

## 📊 7. MONITORAMENTO E LOGS

### 7.1 Logs de Sistema
```typescript
// Estrutura de logs
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
}

// Exemplo de log
console.log('User login:', {
  timestamp: new Date().toISOString(),
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.get('User-Agent')
});
```

### 7.2 Métricas de Performance
- **Tempo de Resposta**: APIs
- **Taxa de Erro**: Requisições com falha
- **Uso de Recursos**: CPU, memória
- **Conexões de Banco**: Pool de conexões
- **Cache Hit Rate**: Taxa de acerto do cache

---

## 🔒 8. SEGURANÇA

### 8.1 Autenticação e Autorização
- **JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash de senhas com salt
- **Rate Limiting**: Proteção contra ataques
- **CORS**: Configuração de origens permitidas

### 8.2 Validação e Sanitização
- **Joi**: Validação de dados de entrada
- **Helmet**: Headers de segurança
- **Input Sanitization**: Limpeza de dados
- **SQL Injection Protection**: Supabase ORM

### 8.3 Logs de Segurança
```typescript
// Log de tentativas de login
console.warn('Failed login attempt:', {
  email: req.body.email,
  ip: req.ip,
  timestamp: new Date().toISOString()
});

// Log de acesso negado
console.warn('Access denied:', {
  userId: req.user?.id,
  route: req.path,
  method: req.method,
  timestamp: new Date().toISOString()
});
```

---

## 🚀 9. OTIMIZAÇÕES

### 9.1 Performance
- **Paginação**: Listas grandes paginadas
- **Índices**: Banco otimizado
- **Cache**: React Query para cache
- **Compressão**: Respostas comprimidas
- **Lazy Loading**: Carregamento sob demanda

### 9.2 Escalabilidade
- **Stateless**: API sem estado
- **Horizontal Scaling**: Múltiplas instâncias
- **Database Pooling**: Pool de conexões
- **CDN**: Arquivos estáticos
- **Load Balancing**: Distribuição de carga

---

*Esta documentação técnica fornece uma visão completa da arquitetura, componentes e implementação do Sistema de Gestão de Rotas de Caminhões, servindo como referência para desenvolvedores, manutenção e evolução do sistema.*

