const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requireManager } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/routes
 * Lista todas as rotas da empresa
 */
router.get('/', async (req, res) => {
  try {
    const { date, shift, status } = req.query;

    const where = { companyId: req.user.companyId };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }
    
    if (shift && ['MORNING', 'AFTERNOON', 'NIGHT'].includes(shift)) {
      where.shift = shift;
    }
    
    if (status && ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status;
    }

    const routes = await prisma.route.findMany({
      where,
      include: {
        truck: {
          select: {
            id: true,
            plate: true,
            model: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            function: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            function: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(routes);
  } catch (error) {
    console.error('Erro ao listar rotas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/routes/:id
 * Busca uma rota específica
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const route = await prisma.route.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      },
      include: {
        truck: {
          select: {
            id: true,
            plate: true,
            model: true,
            capacity: true,
            year: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            function: true,
            phone: true,
            email: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            function: true,
            phone: true,
            email: true
          }
        }
      }
    });

    if (!route) {
      return res.status(404).json({ 
        error: 'Rota não encontrada' 
      });
    }

    res.json(route);
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * POST /api/routes
 * Cria uma nova rota
 */
router.post('/', requireManager, [
  // Validações
  body('origin').notEmpty().withMessage('Origem é obrigatória'),
  body('destination').notEmpty().withMessage('Destino é obrigatório'),
  body('date').isISO8601().withMessage('Data deve ser válida'),
  body('shift').isIn(['MORNING', 'AFTERNOON', 'NIGHT']).withMessage('Turno deve ser MORNING, AFTERNOON ou NIGHT'),
  body('truckId').notEmpty().withMessage('Caminhão é obrigatório'),
  body('driverId').notEmpty().withMessage('Motorista é obrigatório'),
  body('helperId').notEmpty().withMessage('Ajudante é obrigatório')
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

    const { origin, destination, date, shift, truckId, driverId, helperId, notes } = req.body;

    // Verifica se o caminhão existe e pertence à empresa
    const truck = await prisma.truck.findFirst({
      where: { 
        id: truckId,
        companyId: req.user.companyId,
        isAvailable: true
      }
    });

    if (!truck) {
      return res.status(400).json({ 
        error: 'Caminhão não encontrado ou indisponível' 
      });
    }

    // Verifica se o motorista existe e pertence à empresa
    const driver = await prisma.employee.findFirst({
      where: { 
        id: driverId,
        companyId: req.user.companyId,
        function: 'DRIVER',
        isAvailable: true
      }
    });

    if (!driver) {
      return res.status(400).json({ 
        error: 'Motorista não encontrado ou indisponível' 
      });
    }

    // Verifica se o ajudante existe e pertence à empresa
    const helper = await prisma.employee.findFirst({
      where: { 
        id: helperId,
        companyId: req.user.companyId,
        function: 'HELPER',
        isAvailable: true
      }
    });

    if (!helper) {
      return res.status(400).json({ 
        error: 'Ajudante não encontrado ou indisponível' 
      });
    }

    // Verifica conflitos de disponibilidade
    const routeDate = new Date(date);
    const startDate = new Date(routeDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(routeDate);
    endDate.setHours(23, 59, 59, 999);

    // Verifica se o caminhão já está em uso no mesmo turno
    const truckConflict = await prisma.route.findFirst({
      where: {
        truckId,
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        }
      }
    });

    if (truckConflict) {
      return res.status(400).json({ 
        error: 'Caminhão já está em uso neste turno' 
      });
    }

    // Verifica se o motorista já está em uso no mesmo turno
    const driverConflict = await prisma.route.findFirst({
      where: {
        OR: [
          { driverId },
          { helperId: driverId }
        ],
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        }
      }
    });

    if (driverConflict) {
      return res.status(400).json({ 
        error: 'Motorista já está em uso neste turno' 
      });
    }

    // Verifica se o ajudante já está em uso no mesmo turno
    const helperConflict = await prisma.route.findFirst({
      where: {
        OR: [
          { driverId: helperId },
          { helperId }
        ],
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        }
      }
    });

    if (helperConflict) {
      return res.status(400).json({ 
        error: 'Ajudante já está em uso neste turno' 
      });
    }

    // Cria a rota
    const route = await prisma.route.create({
      data: {
        origin,
        destination,
        date: routeDate,
        shift,
        notes,
        companyId: req.user.companyId,
        truckId,
        driverId,
        helperId
      },
      include: {
        truck: {
          select: {
            id: true,
            plate: true,
            model: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            function: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            function: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Rota criada com sucesso',
      route
    });

  } catch (error) {
    console.error('Erro ao criar rota:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PUT /api/routes/:id
 * Atualiza uma rota
 */
router.put('/:id', requireManager, [
  // Validações
  body('origin').notEmpty().withMessage('Origem é obrigatória'),
  body('destination').notEmpty().withMessage('Destino é obrigatório'),
  body('date').isISO8601().withMessage('Data deve ser válida'),
  body('shift').isIn(['MORNING', 'AFTERNOON', 'NIGHT']).withMessage('Turno deve ser MORNING, AFTERNOON ou NIGHT'),
  body('truckId').notEmpty().withMessage('Caminhão é obrigatório'),
  body('driverId').notEmpty().withMessage('Motorista é obrigatório'),
  body('helperId').notEmpty().withMessage('Ajudante é obrigatório')
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
    const { origin, destination, date, shift, truckId, driverId, helperId, notes } = req.body;

    // Verifica se a rota existe e pertence à empresa
    const existingRoute = await prisma.route.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!existingRoute) {
      return res.status(404).json({ 
        error: 'Rota não encontrada' 
      });
    }

    // Verifica se a rota pode ser editada
    if (existingRoute.status === 'COMPLETED') {
      return res.status(400).json({ 
        error: 'Não é possível editar uma rota já concluída' 
      });
    }

    // Verifica disponibilidade dos recursos (similar ao POST)
    const truck = await prisma.truck.findFirst({
      where: { 
        id: truckId,
        companyId: req.user.companyId,
        isAvailable: true
      }
    });

    if (!truck) {
      return res.status(400).json({ 
        error: 'Caminhão não encontrado ou indisponível' 
      });
    }

    const driver = await prisma.employee.findFirst({
      where: { 
        id: driverId,
        companyId: req.user.companyId,
        function: 'DRIVER',
        isAvailable: true
      }
    });

    if (!driver) {
      return res.status(400).json({ 
        error: 'Motorista não encontrado ou indisponível' 
      });
    }

    const helper = await prisma.employee.findFirst({
      where: { 
        id: helperId,
        companyId: req.user.companyId,
        function: 'HELPER',
        isAvailable: true
      }
    });

    if (!helper) {
      return res.status(400).json({ 
        error: 'Ajudante não encontrado ou indisponível' 
      });
    }

    // Verifica conflitos excluindo a rota atual
    const routeDate = new Date(date);
    const startDate = new Date(routeDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(routeDate);
    endDate.setHours(23, 59, 59, 999);

    const truckConflict = await prisma.route.findFirst({
      where: {
        truckId,
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        },
        NOT: { id }
      }
    });

    if (truckConflict) {
      return res.status(400).json({ 
        error: 'Caminhão já está em uso neste turno' 
      });
    }

    const driverConflict = await prisma.route.findFirst({
      where: {
        OR: [
          { driverId },
          { helperId: driverId }
        ],
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        },
        NOT: { id }
      }
    });

    if (driverConflict) {
      return res.status(400).json({ 
        error: 'Motorista já está em uso neste turno' 
      });
    }

    const helperConflict = await prisma.route.findFirst({
      where: {
        OR: [
          { driverId: helperId },
          { helperId }
        ],
        date: {
          gte: startDate,
          lte: endDate
        },
        shift,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        },
        NOT: { id }
      }
    });

    if (helperConflict) {
      return res.status(400).json({ 
        error: 'Ajudante já está em uso neste turno' 
      });
    }

    // Atualiza a rota
    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        origin,
        destination,
        date: routeDate,
        shift,
        notes,
        truckId,
        driverId,
        helperId
      },
      include: {
        truck: {
          select: {
            id: true,
            plate: true,
            model: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            function: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            function: true
          }
        }
      }
    });

    res.json({
      message: 'Rota atualizada com sucesso',
      route: updatedRoute
    });

  } catch (error) {
    console.error('Erro ao atualizar rota:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * DELETE /api/routes/:id
 * Remove uma rota
 */
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a rota existe e pertence à empresa
    const route = await prisma.route.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!route) {
      return res.status(404).json({ 
        error: 'Rota não encontrada' 
      });
    }

    // Verifica se a rota pode ser removida
    if (route.status === 'IN_PROGRESS' || route.status === 'COMPLETED') {
      return res.status(400).json({ 
        error: 'Não é possível remover uma rota em andamento ou concluída' 
      });
    }

    // Remove a rota
    await prisma.route.delete({
      where: { id }
    });

    res.json({
      message: 'Rota removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover rota:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PATCH /api/routes/:id/status
 * Atualiza o status de uma rota
 */
router.patch('/:id/status', requireManager, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido' 
      });
    }

    // Verifica se a rota existe e pertence à empresa
    const route = await prisma.route.findFirst({
      where: { 
        id,
        companyId: req.user.companyId 
      }
    });

    if (!route) {
      return res.status(404).json({ 
        error: 'Rota não encontrada' 
      });
    }

    // Atualiza o status
    const updatedRoute = await prisma.route.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: `Status da rota atualizado para ${status}`,
      route: updatedRoute
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/routes/calendar/:date
 * Busca rotas de uma data específica
 */
router.get('/calendar/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const routeDate = new Date(date);
    
    if (isNaN(routeDate.getTime())) {
      return res.status(400).json({ 
        error: 'Data inválida' 
      });
    }

    const startDate = new Date(routeDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(routeDate);
    endDate.setHours(23, 59, 59, 999);

    const routes = await prisma.route.findMany({
      where: {
        companyId: req.user.companyId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        truck: {
          select: {
            id: true,
            plate: true,
            model: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { shift: 'asc' }
    });

    res.json(routes);
  } catch (error) {
    console.error('Erro ao buscar rotas do calendário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;



