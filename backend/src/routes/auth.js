const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Registra uma nova empresa e usuário administrador
 */
router.post('/register', [
  // Validações
  body('company.name').notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('company.cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  body('company.email').isEmail().withMessage('Email da empresa deve ser válido'),
  body('company.password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('user.name').notEmpty().withMessage('Nome do usuário é obrigatório'),
  body('user.email').isEmail().withMessage('Email do usuário deve ser válido'),
  body('user.password').isLength({ min: 6 }).withMessage('Senha do usuário deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: errors.array() 
      });
    }

    const { company, user } = req.body;

    // Verifica se empresa já existe
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { cnpj: company.cnpj },
          { email: company.email }
        ]
      }
    });

    if (existingCompany) {
      return res.status(400).json({ 
        error: 'Empresa já cadastrada com este CNPJ ou email' 
      });
    }

    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Usuário já cadastrado com este email' 
      });
    }

    // Criptografa senhas
    const companyPasswordHash = await bcrypt.hash(company.password, 10);
    const userPasswordHash = await bcrypt.hash(user.password, 10);

    // Cria empresa e usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Cria a empresa
      const newCompany = await tx.company.create({
        data: {
          name: company.name,
          cnpj: company.cnpj,
          email: company.email,
          password: companyPasswordHash,
          address: company.address,
          phone: company.phone
        }
      });

      // Cria o usuário administrador
      const newUser = await tx.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: userPasswordHash,
          role: 'ADMIN',
          companyId: newCompany.id
        }
      });

      return { company: newCompany, user: newUser };
    });

    // Gera token JWT
    const token = jwt.sign(
      { 
        userId: result.user.id, 
        companyId: result.company.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'Empresa e usuário criados com sucesso',
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      company: {
        id: result.company.id,
        name: result.company.name,
        cnpj: result.company.cnpj
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * POST /api/auth/login
 * Login de usuário da empresa
 */
router.post('/login', [
  // Validações
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Busca usuário com dados da empresa
    const user = await prisma.user.findUnique({
      where: { email },
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
        error: 'Email ou senha incorretos' 
      });
    }

    // Verifica senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Email ou senha incorretos' 
      });
    }

    // Gera token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        companyId: user.companyId 
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
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
      company: user.company
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/auth/me
 * Retorna informações do usuário logado
 */
router.get('/me', async (req, res) => {
  try {
    // Este endpoint será protegido pelo middleware de autenticação
    // req.user será preenchido pelo middleware
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;

