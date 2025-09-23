import { Request, Response } from 'express';
import { RouteExecutionService } from '@/services/RouteExecutionService';
import { StartRouteExecutionRequest, UpdateRouteExecutionRequest, ApiResponse } from '@/types';

export class RouteExecutionController {
  private routeExecutionService: RouteExecutionService;

  constructor() {
    this.routeExecutionService = new RouteExecutionService();
  }

  async startRouteExecution(req: Request, res: Response): Promise<void> {
    try {
      const { routeId }: StartRouteExecutionRequest = req.body;
      const employeeId = req.user!.id;

      const routeExecution = await this.routeExecutionService.createRouteExecution({
        routeId,
        employeeId
      });

      res.status(201).json({
        success: true,
        data: routeExecution,
        message: 'Route execution started successfully'
      });
    } catch (error) {
      console.error('Start route execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getMyRouteExecutions(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.user!.id;
      const routeExecutions = await this.routeExecutionService.getRouteExecutionsByEmployee(employeeId);

      res.json({
        success: true,
        data: routeExecutions
      });
    } catch (error) {
      console.error('Get my route executions error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getAllRouteExecutions(req: Request, res: Response): Promise<void> {
    try {
      const routeExecutions = await this.routeExecutionService.getAllRouteExecutions();

      res.json({
        success: true,
        data: routeExecutions
      });
    } catch (error) {
      console.error('Get all route executions error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getRouteExecutionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const routeExecution = await this.routeExecutionService.getRouteExecutionById(id);

      if (!routeExecution) {
        res.status(404).json({
          success: false,
          error: 'Route execution not found'
        });
        return;
      }

      res.json({
        success: true,
        data: routeExecution
      });
    } catch (error) {
      console.error('Get route execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateRouteExecution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateRouteExecutionRequest = req.body;

      // Check if route execution exists
      const existingExecution = await this.routeExecutionService.getRouteExecutionById(id);
      if (!existingExecution) {
        res.status(404).json({
          success: false,
          error: 'Route execution not found'
        });
        return;
      }

      // Check if user is the owner of the execution or admin
      if (req.user!.role !== 'admin' && existingExecution.employeeId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: 'Access denied'
        });
        return;
      }

      const updatedExecution = await this.routeExecutionService.updateRouteExecution(id, updates);

      res.json({
        success: true,
        data: updatedExecution,
        message: 'Route execution updated successfully'
      });
    } catch (error) {
      console.error('Update route execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getRouteExecutionsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required'
        });
        return;
      }

      const routeExecutions = await this.routeExecutionService.getRouteExecutionsByDateRange(
        startDate as string,
        endDate as string
      );

      res.json({
        success: true,
        data: routeExecutions
      });
    } catch (error) {
      console.error('Get route executions by date range error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getRouteExecutionsByRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const routeExecutions = await this.routeExecutionService.getRouteExecutionsByRoute(routeId);

      res.json({
        success: true,
        data: routeExecutions
      });
    } catch (error) {
      console.error('Get route executions by route error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
