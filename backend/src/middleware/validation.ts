import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
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
  phone: Joi.string().optional()
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

export const createRouteSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  startPoint: Joi.string().min(2).max(100).required(),
  endPoint: Joi.string().min(2).max(100).required(),
  waypoints: Joi.array().items(Joi.string()).optional(),
  assignedEmployeeId: Joi.string().uuid().optional()
});

export const updateRouteSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  startPoint: Joi.string().min(2).max(100).optional(),
  endPoint: Joi.string().min(2).max(100).optional(),
  waypoints: Joi.array().items(Joi.string()).optional(),
  assignedEmployeeId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional()
});

export const startRouteExecutionSchema = Joi.object({
  routeId: Joi.string().uuid().required()
});

export const updateRouteExecutionSchema = Joi.object({
  status: Joi.string().valid('in_progress', 'completed', 'cancelled').optional(),
  observations: Joi.string().max(1000).optional()
});
