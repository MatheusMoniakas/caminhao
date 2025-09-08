const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

/**
 * Middleware para autenticar tokens JWT
 * Verifica se o token é válido e adiciona informações do usuário ao req
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso não fornecido' 
      });
    }

    // Verifica o token JWT
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    // Adiciona informações do usuário e empresa ao req
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      company: user.company
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado' 
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro na autenticação' 
    });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de admin
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
  }
  next();
};

/**
 * Middleware para verificar se o usuário tem permissão de manager ou admin
 */
const requireManager = (req, res, next) => {
  if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas gerentes e administradores podem acessar este recurso.' 
    });
  }
  next();
};

/**
 * Middleware para verificar se o usuário está acessando recursos da sua própria empresa
 */
const requireSameCompany = (req, res, next) => {
  const resourceCompanyId = req.params.companyId || req.body.companyId;
  
  if (resourceCompanyId && resourceCompanyId !== req.user.companyId) {
    return res.status(403).json({ 
      error: 'Acesso negado. Você só pode acessar recursos da sua empresa.' 
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManager,
  requireSameCompany
};

