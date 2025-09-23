import { Router } from 'express';
import { RouteController } from '@/controllers/RouteController';
import { validateRequest, createRouteSchema, updateRouteSchema } from '@/middleware/validation';
import { authenticateToken, requireAdmin, requireEmployee } from '@/middleware/auth';

const router = Router();
const routeController = new RouteController();

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.post('/', requireAdmin, validateRequest(createRouteSchema), routeController.createRoute.bind(routeController));
router.get('/', requireAdmin, routeController.getAllRoutes.bind(routeController));
router.get('/:id', requireAdmin, routeController.getRouteById.bind(routeController));
router.put('/:id', requireAdmin, validateRequest(updateRouteSchema), routeController.updateRoute.bind(routeController));
router.delete('/:id', requireAdmin, routeController.deleteRoute.bind(routeController));
router.patch('/:id/toggle-status', requireAdmin, routeController.toggleRouteStatus.bind(routeController));

// Employee routes
router.get('/employee/:employeeId', requireEmployee, routeController.getRoutesByEmployee.bind(routeController));

export default router;
