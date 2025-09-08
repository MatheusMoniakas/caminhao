// Configurações para desenvolvimento e produção
module.exports = {
  // Configurações do Banco de Dados
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  
  // Configurações de Segurança
  JWT_SECRET: process.env.JWT_SECRET || "chave-secreta-jwt-gestao-rotas-2024-desenvolvimento",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  
  // Configurações do Servidor
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Configurações de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
};
