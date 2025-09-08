const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes with error handling
let authRoutes, empresaRoutes, caminhaoRoutes, funcionarioRoutes, rotaRoutes;

try {
  authRoutes = require('../backend/src/routes/auth');
  empresaRoutes = require('../backend/src/routes/companies');
  caminhaoRoutes = require('../backend/src/routes/trucks');
  funcionarioRoutes = require('../backend/src/routes/employees');
  rotaRoutes = require('../backend/src/routes/routes');
} catch (error) {
  console.error('Erro ao carregar rotas:', error.message);
}

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

// Routes with error handling
if (authRoutes) app.use('/api/auth', authRoutes);
if (empresaRoutes) app.use('/api/empresa', empresaRoutes);
if (caminhaoRoutes) app.use('/api/caminhoes', caminhaoRoutes);
if (funcionarioRoutes) app.use('/api/funcionarios', funcionarioRoutes);
if (rotaRoutes) app.use('/api/rotas', rotaRoutes);

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
