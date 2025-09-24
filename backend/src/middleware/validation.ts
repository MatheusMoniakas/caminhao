import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'employee').optional()
});

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'employee', 'driver').optional(),
  phone: Joi.string().optional()
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('admin', 'employee', 'driver').optional(),
  phone: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

export const createRouteSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  startPoint: Joi.string().min(2).max(100).allow('').optional(),
  endPoint: Joi.string().min(2).max(100).allow('').optional(),
  waypoints: Joi.array().items(Joi.string().min(1)).optional(),
  driverId: Joi.string().uuid().required(),
  helperId: Joi.string().uuid().allow('').optional(),
  scheduledDate: Joi.string().isoDate().required(),
  shift: Joi.string().valid('manha', 'tarde', 'noite', 'madrugada').required()
});

export const updateRouteSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  startPoint: Joi.string().min(2).max(100).optional(),
  endPoint: Joi.string().min(2).max(100).optional(),
  waypoints: Joi.array().items(Joi.string()).optional(),
  driverId: Joi.string().uuid().optional(),
  helperId: Joi.string().uuid().optional(),
  scheduledDate: Joi.string().isoDate().optional(),
  shift: Joi.string().valid('manha', 'tarde', 'noite', 'madrugada').optional(),
  isActive: Joi.boolean().optional()
});

export const startRouteExecutionSchema = Joi.object({
  routeId: Joi.string().uuid().required()
});

export const updateRouteExecutionSchema = Joi.object({
  status: Joi.string().valid('in_progress', 'completed', 'cancelled').optional(),
  observations: Joi.string().max(1000).optional()
});
