import { Request, Response } from 'express';
import { RouteService } from '@/services/RouteService';
import { CreateRouteRequest, UpdateRouteRequest, ApiResponse } from '@/types';

export class RouteController {
  private routeService: RouteService;

  constructor() {
    this.routeService = new RouteService();
  }

  async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeData: CreateRouteRequest = req.body;
      console.log('Creating route with data:', routeData);
      
      // Check if route already exists by name
      const existingRoute = await this.routeService.getRouteByName(routeData.name);
      if (existingRoute) {
        res.status(400).json({
          success: false,
          error: 'Já existe uma rota com este nome'
        });
        return;
      }
      
      const route = await this.routeService.createRoute(routeData);

      res.status(201).json({
        success: true,
        data: route,
        message: 'Route created successfully'
      });
    } catch (error: any) {
      console.error('Create route error:', error);
      
      // Se for erro de validação do banco, retornar 400
      if (error.message && error.message.includes('Failed to create route')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await this.routeService.getAllRoutes();

      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      console.error('Get routes error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const route = await this.routeService.getRouteById(id);

      if (!route) {
        res.status(404).json({
          success: false,
          error: 'Route not found'
        });
        return;
      }

      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      console.error('Get route error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getRoutesByEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const routes = await this.routeService.getRoutesByEmployee(employeeId);

      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      console.error('Get routes by employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateRouteRequest = req.body;

      // Check if route exists
      const existingRoute = await this.routeService.getRouteById(id);
      if (!existingRoute) {
        res.status(404).json({
          success: false,
          error: 'Route not found'
        });
        return;
      }

      const updatedRoute = await this.routeService.updateRoute(id, updates);

      res.json({
        success: true,
        data: updatedRoute,
        message: 'Route updated successfully'
      });
    } catch (error) {
      console.error('Update route error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { force } = req.query; // Parâmetro para exclusão forçada

      // Check if route exists
      const existingRoute = await this.routeService.getRouteById(id);
      if (!existingRoute) {
        res.status(404).json({
          success: false,
          error: 'Route not found'
        });
        return;
      }

      // Se não for exclusão forçada, verificar dependências
      if (force !== 'true') {
        const hasDependencies = await this.routeService.checkRouteDependencies(id);
        if (hasDependencies) {
          res.status(400).json({
            success: false,
            error: 'Não é possível excluir esta rota pois ela possui execuções associadas. Use force=true para exclusão forçada.'
          });
          return;
        }
      }

      // Exclusão forçada: remover dependências primeiro
      if (force === 'true') {
        await this.routeService.forceDeleteRoute(id);
      } else {
        await this.routeService.deleteRoute(id);
      }

      res.json({
        success: true,
        message: force === 'true' ? 'Route force deleted successfully' : 'Route deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete route error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async toggleRouteStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if route exists
      const existingRoute = await this.routeService.getRouteById(id);
      if (!existingRoute) {
        res.status(404).json({
          success: false,
          error: 'Route not found'
        });
        return;
      }

      // Toggle status
      const updatedRoute = await this.routeService.updateRoute(id, {
        isActive: !existingRoute.isActive
      });

      res.json({
        success: true,
        data: updatedRoute,
        message: `Route ${updatedRoute.isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Toggle route status error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
