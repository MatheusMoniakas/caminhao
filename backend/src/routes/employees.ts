import { Router } from 'express';
import { EmployeeController } from '@/controllers/EmployeeController';
import { validateRequest, createEmployeeSchema, updateEmployeeSchema } from '@/middleware/validation';
import { authenticateToken, requireAdmin } from '@/middleware/auth';

const router = Router();
const employeeController = new EmployeeController();

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.post('/', requireAdmin, validateRequest(createEmployeeSchema), employeeController.createEmployee.bind(employeeController));
router.get('/', requireAdmin, employeeController.getAllEmployees.bind(employeeController));
router.get('/:id', requireAdmin, employeeController.getEmployeeById.bind(employeeController));
router.put('/:id', requireAdmin, validateRequest(updateEmployeeSchema), employeeController.updateEmployee.bind(employeeController));
router.delete('/:id', requireAdmin, employeeController.deleteEmployee.bind(employeeController));
router.patch('/:id/toggle-status', requireAdmin, employeeController.toggleEmployeeStatus.bind(employeeController));

export default router;
