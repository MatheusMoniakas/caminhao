const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares básicos
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check chamado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    message: 'API funcionando corretamente'
  });
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
  console.log('Test route chamado');
  res.json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
});

// Rota raiz da API
app.get('/api', (req, res) => {
  console.log('API root chamado');
  res.json({
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    routes: ['/api/health', '/api/test']
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
