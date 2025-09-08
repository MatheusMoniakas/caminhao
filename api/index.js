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
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('empresa').notEmpty().withMessage('Nome da empresa é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha, empresa } = req.body;

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criar empresa
    const companyId = companies.length + 1;
    const newCompany = {
      id: companyId,
      nome: empresa,
      createdAt: new Date().toISOString()
    };
    companies.push(newCompany);

    // Criar usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const userId = users.length + 1;
    const newUser = {
      id: userId,
      nome,
      email,
      senha: hashedPassword,
      empresaId: companyId,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // Gerar token
    const token = jwt.sign(
      { userId: newUser.id, empresaId: companyId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        empresa: newCompany.nome
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Buscar empresa
    const company = companies.find(c => c.id === user.empresaId);

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, empresaId: user.empresaId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        empresa: company?.nome
      },
      token
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
