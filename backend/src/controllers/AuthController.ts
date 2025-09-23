import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { UserService } from '@/services/UserService';
import { LoginRequest, RegisterRequest, AuthTokens, ApiResponse } from '@/types';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Find user by email
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Get user with password for verification
      const { data: userWithPassword } = await this.userService['supabaseAdmin']
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!userWithPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Verify password
      const isValidPassword = await this.userService.verifyPassword(password, userWithPassword.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
        return;
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      res.json({
        success: true,
        data: {
          user,
          ...tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role = 'employee' }: RegisterRequest = req.body;

      // Check if user already exists
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
        return;
      }

      // Create user
      const user = await this.userService.createUser({
        email,
        password,
        name,
        role
      });

      // Generate tokens
      const tokens = this.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user,
          ...tokens
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: 'Refresh token required'
        });
        return;
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      const user = await this.userService.getUserById(decoded.userId);

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
        return;
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  private generateTokens(user: User): AuthTokens {
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        }
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }
}
