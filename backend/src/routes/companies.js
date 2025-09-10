const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/companies/profile
 * Retorna o perfil da empresa do usuário logado
 */
router.get('/profile', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user.companyId },
      select: {
        id: true,
        name: true,
        cnpj: true,
        email: true,
        address: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!company) {
      return res.status(404).json({ 
        error: 'Empresa não encontrada' 
      });
    }

    res.json(company);
  } catch (error) {
    console.error('Erro ao buscar perfil da empresa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * PUT /api/companies/profile
 * Atualiza o perfil da empresa
 */
router.put('/profile', requireAdmin, [
  // Validações
  body('name').notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone deve ser válido')
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

    const { name, email, address, phone } = req.body;

    // Verifica se o email já existe em outra empresa
    const existingCompany = await prisma.company.findFirst({
      where: { 
        email,
        NOT: { id: req.user.companyId }
      }
    });

    if (existingCompany) {
      return res.status(400).json({ 
        error: 'Já existe uma empresa com este email' 
      });
    }

    // Atualiza a empresa
    const updatedCompany = await prisma.company.update({
      where: { id: req.user.companyId },
      data: {
        name,
        email,
        address,
        phone
      },
      select: {
        id: true,
        name: true,
        cnpj: true,
        email: true,
        address: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Perfil da empresa atualizado com sucesso',
      company: updatedCompany
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil da empresa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/companies/stats
 * Retorna estatísticas da empresa
 */
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    // Conta total de caminhões
    const totalTrucks = await prisma.truck.count({
      where: { companyId: req.user.companyId }
    });

    // Conta caminhões disponíveis
    const availableTrucks = await prisma.truck.count({
      where: { 
        companyId: req.user.companyId,
        isAvailable: true
      }
    });

    // Conta total de funcionários
    const totalEmployees = await prisma.employee.count({
      where: { companyId: req.user.companyId }
    });

    // Conta funcionários disponíveis
    const availableEmployees = await prisma.employee.count({
      where: { 
        companyId: req.user.companyId,
        isAvailable: true
      }
    });

    // Conta motoristas
    const totalDrivers = await prisma.employee.count({
      where: { 
        companyId: req.user.companyId,
        function: 'DRIVER'
      }
    });

    // Conta ajudantes
    const totalHelpers = await prisma.employee.count({
      where: { 
        companyId: req.user.companyId,
        function: 'HELPER'
      }
    });

    // Conta rotas por status
    const routesByStatus = await prisma.route.groupBy({
      by: ['status'],
      where: {
        companyId: req.user.companyId,
        ...dateFilter
      },
      _count: {
        status: true
      }
    });

    // Conta rotas por turno
    const routesByShift = await prisma.route.groupBy({
      by: ['shift'],
      where: {
        companyId: req.user.companyId,
        ...dateFilter
      },
      _count: {
        shift: true
      }
    });

    // Total de rotas no período
    const totalRoutes = await prisma.route.count({
      where: {
        companyId: req.user.companyId,
        ...dateFilter
      }
    });

    // Calcula utilização de caminhões
    const truckUtilization = totalTrucks > 0 ? 
      ((totalTrucks - availableTrucks) / totalTrucks * 100).toFixed(1) : 0;

    // Calcula utilização de funcionários
    const employeeUtilization = totalEmployees > 0 ? 
      ((totalEmployees - availableEmployees) / totalEmployees * 100).toFixed(1) : 0;

    const stats = {
      trucks: {
        total: totalTrucks,
        available: availableTrucks,
        utilization: `${truckUtilization}%`
      },
      employees: {
        total: totalEmployees,
        available: availableEmployees,
        drivers: totalDrivers,
        helpers: totalHelpers,
        utilization: `${employeeUtilization}%`
      },
      routes: {
        total: totalRoutes,
        byStatus: routesByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {}),
        byShift: routesByShift.reduce((acc, item) => {
          acc[item.shift] = item._count.shift;
          return acc;
        }, {})
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

/**
 * GET /api/companies/dashboard
 * Retorna dados para o dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Rotas da semana
    const weeklyRoutes = await prisma.route.findMany({
      where: {
        companyId: req.user.companyId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      },
      include: {
        truck: {
          select: {
            plate: true,
            model: true
          }
        },
        driver: {
          select: {
            name: true
          }
        },
        helper: {
          select: {
            name: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Próximas rotas (hoje e amanhã)
    const upcomingRoutes = await prisma.route.findMany({
      where: {
        companyId: req.user.companyId,
        date: {
          gte: today
        },
        status: 'SCHEDULED'
      },
      include: {
        truck: {
          select: {
            plate: true
          }
        },
        driver: {
          select: {
            name: true
          }
        }
      },
      orderBy: { date: 'asc' },
      take: 5
    });

    // Caminhões com manutenção necessária (exemplo: mais de 5 anos)
    const trucksNeedingMaintenance = await prisma.truck.findMany({
      where: {
        companyId: req.user.companyId,
        year: {
          lte: today.getFullYear() - 5
        }
      },
      select: {
        id: true,
        plate: true,
        model: true,
        year: true
      }
    });

    const dashboard = {
      weeklyRoutes,
      upcomingRoutes,
      trucksNeedingMaintenance,
      summary: {
        totalRoutesThisWeek: weeklyRoutes.length,
        routesToday: weeklyRoutes.filter(r => 
          r.date.toDateString() === today.toDateString()
        ).length,
        upcomingRoutesCount: upcomingRoutes.length,
        maintenanceNeeded: trucksNeedingMaintenance.length
      }
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;



