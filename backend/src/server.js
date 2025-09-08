const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const truckRoutes = require('./routes/trucks');
const employeeRoutes = require('./routes/employees');
const routeRoutes = require('./routes/routes');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = config.PORT;

// Middleware de segurança
app.use(helmet());

// Middleware de CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
app.use('/api', authenticateToken);

// Rotas protegidas
app.use('/api/companies', companyRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/routes', routeRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API de Gestão de Rotas funcionando!' 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Erro de validação', 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Token inválido ou expirado' 
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: config.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚚 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

