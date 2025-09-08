const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes with error handling
let authRoutes, empresaRoutes, caminhaoRoutes, funcionarioRoutes, rotaRoutes, relatorioRoutes;

try {
  authRoutes = require('./src/routes/auth');
  empresaRoutes = require('./src/routes/companies');
  caminhaoRoutes = require('./src/routes/trucks');
  funcionarioRoutes = require('./src/routes/employees');
  rotaRoutes = require('./src/routes/routes');
  // relatorioRoutes = require('./src/routes/relatorio'); // Não existe ainda
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
if (relatorioRoutes) app.use('/api/relatorios', relatorioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  // Ensure response is sent as JSON string
  const errorResponse = {
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
    timestamp: new Date().toISOString()
  };
  
  res.status(500).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
