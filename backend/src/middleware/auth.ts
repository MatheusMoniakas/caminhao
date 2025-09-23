import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { User } from '@/types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user: User;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    (req as AuthRequest).user = decoded.user;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
    return;
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (authReq.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }

  next();
};

export const requireEmployee = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (authReq.user.role !== 'employee' && authReq.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Employee access required'
    });
    return;
  }

  next();
};
