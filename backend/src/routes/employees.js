const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requireManager } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/employees
 * Lista todos os funcionários da empresa
 */
router.get('/', async (req, res) => {
  try {
    const { function: employeeFunction } = req.query;

    const where = { companyId: req.user.companyId };
    
    if (employeeFunction && ['DRIVER', 'HELPER'].includes(employeeFunction)) {
      where.function = employeeFunction;
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(employees);
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/employees/:id
 * Busca um funcionário específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        error: 'Funcionário não encontrado' 
      });
    }

    res.json(employee);
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * POST /api/employees
 * Cria um novo funcionário
 */
router.post('/', requireManager, [
  // Validações
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('function').isIn(['DRIVER', 'HELPER']).withMessage('Função deve ser DRIVER ou HELPER'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone deve ser válido'),
  body('email').optional().isEmail().withMessage('Email deve ser válido')
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

    const { name, cpf, function: employeeFunction, phone, email } = req.body;

    // Verifica se o CPF já existe na empresa
    const existingEmployee = await prisma.employee.findFirst({
      where: { 
        cpf,
        companyId: req.user.companyId 
      }
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        error: 'Já existe um funcionário com este CPF' 
      });
    }

    // Cria o funcionário
    const employee = await prisma.employee.create({
      data: {
        name,
        cpf,
        function: employeeFunction,
        phone,
        email,
        companyId: req.user.companyId
      }
    });

    res.status(201).json({
      message: 'Funcionário criado com sucesso',
      employee
    });

  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PUT /api/employees/:id
 * Atualiza um funcionário
 */
router.put('/:id', requireManager, [
  // Validações
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('function').isIn(['DRIVER', 'HELPER']).withMessage('Função deve ser DRIVER ou HELPER'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone deve ser válido'),
  body('email').optional().isEmail().withMessage('Email deve ser válido')
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

    const { id } = req.params;
    const { name, cpf, function: employeeFunction, phone, email } = req.body;

    // Verifica se o funcionário existe e pertence à empresa
    const existingEmployee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!existingEmployee) {
      return res.status(404).json({ 
        error: 'Funcionário não encontrado' 
      });
    }

    // Verifica se o novo CPF já existe em outro funcionário da empresa
    if (cpf !== existingEmployee.cpf) {
      const employeeWithSameCpf = await prisma.employee.findFirst({
        where: { 
          cpf,
          companyId: req.user.companyId,
          NOT: { id }
        }
      });

      if (employeeWithSameCpf) {
        return res.status(400).json({ 
          error: 'Já existe outro funcionário com este CPF' 
        });
      }
    }

    // Atualiza o funcionário
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        cpf,
        function: employeeFunction,
        phone,
        email
      }
    });

    res.json({
      message: 'Funcionário atualizado com sucesso',
      employee: updatedEmployee
    });

  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * DELETE /api/employees/:id
 * Remove um funcionário
 */
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o funcionário existe e pertence à empresa
    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      },
      include: {
        routes: true
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        error: 'Funcionário não encontrado' 
      });
    }

    // Verifica se o funcionário tem rotas associadas
    if (employee.routes.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível remover um funcionário que possui rotas associadas' 
      });
    }

    // Remove o funcionário
    await prisma.employee.delete({
      where: { id }
    });

    res.json({
      message: 'Funcionário removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover funcionário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PATCH /api/employees/:id/availability
 * Atualiza a disponibilidade de um funcionário
 */
router.patch('/:id/availability', requireManager, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ 
        error: 'isAvailable deve ser um valor booleano' 
      });
    }

    // Verifica se o funcionário existe e pertence à empresa
    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        error: 'Funcionário não encontrado' 
      });
    }

    // Atualiza a disponibilidade
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { isAvailable }
    });

    res.json({
      message: `Funcionário ${isAvailable ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
      employee: updatedEmployee
    });

  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/employees/available
 * Lista funcionários disponíveis por função
 */
router.get('/available', async (req, res) => {
  try {
    const { function: employeeFunction } = req.query;

    const where = { 
      companyId: req.user.companyId,
      isAvailable: true 
    };
    
    if (employeeFunction && ['DRIVER', 'HELPER'].includes(employeeFunction)) {
      where.function = employeeFunction;
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(employees);
  } catch (error) {
    console.error('Erro ao listar funcionários disponíveis:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/employees/drivers
 * Lista apenas motoristas
 */
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await prisma.employee.findMany({
      where: { 
        companyId: req.user.companyId,
        function: 'DRIVER'
      },
      orderBy: { name: 'asc' }
    });

    res.json(drivers);
  } catch (error) {
    console.error('Erro ao listar motoristas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/employees/helpers
 * Lista apenas ajudantes
 */
router.get('/helpers', async (req, res) => {
  try {
    const helpers = await prisma.employee.findMany({
      where: { 
        companyId: req.user.companyId,
        function: 'HELPER'
      },
      orderBy: { name: 'asc' }
    });

    res.json(helpers);
  } catch (error) {
    console.error('Erro ao listar ajudantes:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;

