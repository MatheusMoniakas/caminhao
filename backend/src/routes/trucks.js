const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requireManager } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/trucks
 * Lista todos os caminhões da empresa
 */
router.get('/', async (req, res) => {
  try {
    const trucks = await prisma.truck.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trucks);
  } catch (error) {
    console.error('Erro ao listar caminhões:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/trucks/:id
 * Busca um caminhão específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const truck = await prisma.truck.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!truck) {
      return res.status(404).json({ 
        error: 'Caminhão não encontrado' 
      });
    }

    res.json(truck);
  } catch (error) {
    console.error('Erro ao buscar caminhão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * POST /api/trucks
 * Cria um novo caminhão
 */
router.post('/', requireManager, [
  // Validações
  body('plate').notEmpty().withMessage('Placa é obrigatória'),
  body('model').notEmpty().withMessage('Modelo é obrigatório'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacidade deve ser um número positivo'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Ano inválido')
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

    const { plate, model, capacity, year } = req.body;

    // Verifica se a placa já existe na empresa
    const existingTruck = await prisma.truck.findFirst({
      where: { 
        plate,
        companyId: req.user.companyId 
      }
    });

    if (existingTruck) {
      return res.status(400).json({ 
        error: 'Já existe um caminhão com esta placa' 
      });
    }

    // Cria o caminhão
    const truck = await prisma.truck.create({
      data: {
        plate: plate.toUpperCase(),
        model,
        capacity: parseFloat(capacity),
        year: parseInt(year),
        companyId: req.user.companyId
      }
    });

    res.status(201).json({
      message: 'Caminhão criado com sucesso',
      truck
    });

  } catch (error) {
    console.error('Erro ao criar caminhão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PUT /api/trucks/:id
 * Atualiza um caminhão
 */
router.put('/:id', requireManager, [
  // Validações
  body('plate').notEmpty().withMessage('Placa é obrigatória'),
  body('model').notEmpty().withMessage('Modelo é obrigatório'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacidade deve ser um número positivo'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Ano inválido')
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
    const { plate, model, capacity, year } = req.body;

    // Verifica se o caminhão existe e pertence à empresa
    const existingTruck = await prisma.truck.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!existingTruck) {
      return res.status(404).json({ 
        error: 'Caminhão não encontrado' 
      });
    }

    // Verifica se a nova placa já existe em outro caminhão da empresa
    if (plate !== existingTruck.plate) {
      const truckWithSamePlate = await prisma.truck.findFirst({
        where: { 
          plate,
          companyId: req.user.companyId,
          NOT: { id }
        }
      });

      if (truckWithSamePlate) {
        return res.status(400).json({ 
          error: 'Já existe outro caminhão com esta placa' 
        });
      }
    }

    // Atualiza o caminhão
    const updatedTruck = await prisma.truck.update({
      where: { id },
      data: {
        plate: plate.toUpperCase(),
        model,
        capacity: parseFloat(capacity),
        year: parseInt(year)
      }
    });

    res.json({
      message: 'Caminhão atualizado com sucesso',
      truck: updatedTruck
    });

  } catch (error) {
    console.error('Erro ao atualizar caminhão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * DELETE /api/trucks/:id
 * Remove um caminhão
 */
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o caminhão existe e pertence à empresa
    const truck = await prisma.truck.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      },
      include: {
        routes: true
      }
    });

    if (!truck) {
      return res.status(404).json({ 
        error: 'Caminhão não encontrado' 
      });
    }

    // Verifica se o caminhão tem rotas associadas
    if (truck.routes.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível remover um caminhão que possui rotas associadas' 
      });
    }

    // Remove o caminhão
    await prisma.truck.delete({
      where: { id }
    });

    res.json({
      message: 'Caminhão removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover caminhão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PATCH /api/trucks/:id/availability
 * Atualiza a disponibilidade de um caminhão
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

    // Verifica se o caminhão existe e pertence à empresa
    const truck = await prisma.truck.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!truck) {
      return res.status(404).json({ 
        error: 'Caminhão não encontrado' 
      });
    }

    // Atualiza a disponibilidade
    const updatedTruck = await prisma.truck.update({
      where: { id },
      data: { isAvailable }
    });

    res.json({
      message: `Caminhão ${isAvailable ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
      truck: updatedTruck
    });

  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/trucks/available
 * Lista caminhões disponíveis
 */
router.get('/available', async (req, res) => {
  try {
    const trucks = await prisma.truck.findMany({
      where: { 
        companyId: req.user.companyId,
        isAvailable: true 
      },
      orderBy: { plate: 'asc' }
    });

    res.json(trucks);
  } catch (error) {
    console.error('Erro ao listar caminhões disponíveis:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;

