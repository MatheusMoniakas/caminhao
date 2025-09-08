const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

// Mock data (simulando banco de dados)
let users = [];
let companies = [];
let trucks = [];
let employees = [];
let routes = [];

// Auth Routes
app.post('/api/auth/register', [
  body('company.name').notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('company.cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  body('company.email').isEmail().withMessage('Email da empresa deve ser válido'),
  body('company.password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('user.name').notEmpty().withMessage('Nome do usuário é obrigatório'),
  body('user.email').isEmail().withMessage('Email do usuário deve ser válido'),
  body('user.password').isLength({ min: 6 }).withMessage('Senha do usuário deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, user } = req.body;

    // Verificar se empresa já existe
    const existingCompany = companies.find(c => c.cnpj === company.cnpj || c.email === company.email);
    if (existingCompany) {
      return res.status(400).json({ error: 'Empresa já cadastrada com este CNPJ ou email' });
    }

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já cadastrado com este email' });
    }

    // Criar empresa
    const companyId = companies.length + 1;
    const companyPasswordHash = await bcrypt.hash(company.password, 10);
    const newCompany = {
      id: companyId,
      name: company.name,
      cnpj: company.cnpj,
      email: company.email,
      password: companyPasswordHash,
      address: company.address,
      phone: company.phone,
      createdAt: new Date().toISOString()
    };
    companies.push(newCompany);

    // Criar usuário
    const userPasswordHash = await bcrypt.hash(user.password, 10);
    const userId = users.length + 1;
    const newUser = {
      id: userId,
      name: user.name,
      email: user.email,
      password: userPasswordHash,
      role: 'ADMIN',
      companyId: companyId,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // Gerar token
    const token = jwt.sign(
      { userId: newUser.id, companyId: companyId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Empresa e usuário criados com sucesso',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      company: {
        id: newCompany.id,
        name: newCompany.name,
        cnpj: newCompany.cnpj
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Buscar empresa
    const company = companies.find(c => c.id === user.companyId);

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, companyId: user.companyId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      company: company ? {
        id: company.id,
        name: company.name,
        cnpj: company.cnpj
      } : null
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Company Routes
app.get('/api/empresa', (req, res) => {
  res.json({
    message: 'Lista de empresas',
    data: companies
  });
});

// Truck Routes
app.get('/api/caminhoes', (req, res) => {
  res.json({
    message: 'Lista de caminhões',
    data: trucks
  });
});

app.post('/api/caminhoes', (req, res) => {
  const { placa, modelo, marca, ano } = req.body;
  const newTruck = {
    id: trucks.length + 1,
    placa,
    modelo,
    marca,
    ano,
    createdAt: new Date().toISOString()
  };
  trucks.push(newTruck);
  res.status(201).json({
    message: 'Caminhão criado com sucesso',
    data: newTruck
  });
});

// Employee Routes
app.get('/api/funcionarios', (req, res) => {
  res.json({
    message: 'Lista de funcionários',
    data: employees
  });
});

app.post('/api/funcionarios', (req, res) => {
  const { nome, cpf, cargo, telefone } = req.body;
  const newEmployee = {
    id: employees.length + 1,
    nome,
    cpf,
    cargo,
    telefone,
    createdAt: new Date().toISOString()
  };
  employees.push(newEmployee);
  res.status(201).json({
    message: 'Funcionário criado com sucesso',
    data: newEmployee
  });
});

// Route Routes
app.get('/api/rotas', (req, res) => {
  res.json({
    message: 'Lista de rotas',
    data: routes
  });
});

app.post('/api/rotas', (req, res) => {
  const { origem, destino, distancia, tempoEstimado } = req.body;
  const newRoute = {
    id: routes.length + 1,
    origem,
    destino,
    distancia,
    tempoEstimado,
    createdAt: new Date().toISOString()
  };
  routes.push(newRoute);
  res.status(201).json({
    message: 'Rota criada com sucesso',
    data: newRoute
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message || 'Algo deu errado',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Rota não encontrada:', req.originalUrl);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Para Vercel, não iniciar servidor se for serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚛 Servidor de teste rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📋 Rotas disponíveis:`);
    console.log(`   GET /api/health`);
    console.log(`   GET /api/test`);
    console.log(`   GET /api`);
  });
}

module.exports = app;
