import { Router } from 'express';
import { RouteExecutionController } from '@/controllers/RouteExecutionController';
import { validateRequest, startRouteExecutionSchema, updateRouteExecutionSchema } from '@/middleware/validation';
import { authenticateToken, requireAdmin, requireEmployee } from '@/middleware/auth';

const router = Router();
const routeExecutionController = new RouteExecutionController();

// All routes require authentication
router.use(authenticateToken);

// Employee routes
router.post('/start', requireEmployee, validateRequest(startRouteExecutionSchema), routeExecutionController.startRouteExecution.bind(routeExecutionController));
router.get('/my-executions', requireEmployee, routeExecutionController.getMyRouteExecutions.bind(routeExecutionController));
router.put('/:id', requireEmployee, validateRequest(updateRouteExecutionSchema), routeExecutionController.updateRouteExecution.bind(routeExecutionController));

// Admin routes
router.get('/', requireAdmin, routeExecutionController.getAllRouteExecutions.bind(routeExecutionController));
router.get('/:id', requireAdmin, routeExecutionController.getRouteExecutionById.bind(routeExecutionController));
router.get('/route/:routeId', requireAdmin, routeExecutionController.getRouteExecutionsByRoute.bind(routeExecutionController));
router.get('/reports/date-range', requireAdmin, routeExecutionController.getRouteExecutionsByDateRange.bind(routeExecutionController));

export default router;
