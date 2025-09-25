import { Request, Response } from 'express';
import { UserService } from '@/services/UserService';
import { CreateEmployeeRequest, UpdateEmployeeRequest, ApiResponse } from '@/types';

export class EmployeeController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData: CreateEmployeeRequest = req.body;

      // Check if user already exists
      const existingUser = await this.userService.getUserByEmail(employeeData.email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Employee already exists with this email'
        });
        return;
      }

      // Create employee (role will be 'employee')
      const employee = await this.userService.createUser({
        email: employeeData.email,
        password: employeeData.password,
        name: employeeData.name,
        phone: employeeData.phone,
        role: 'employee'
      });

      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      console.error('Create employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.userService.getAllUsers();
      
      // Filter only employees (not admins)
      const employeeList = employees.filter(user => user.role === 'employee');

      res.json({
        success: true,
        data: employeeList
      });
    } catch (error) {
      console.error('Get employees error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await this.userService.getUserById(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      if (employee.role !== 'employee') {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      console.error('Get employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateEmployeeRequest = req.body;

      // Check if employee exists
      const existingEmployee = await this.userService.getUserById(id);
      if (!existingEmployee) {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      if (existingEmployee.role !== 'employee') {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      // Check if email is being updated and if it's already taken
      if (updates.email && updates.email !== existingEmployee.email) {
        const emailExists = await this.userService.getUserByEmail(updates.email);
        if (emailExists) {
          res.status(400).json({
            success: false,
            error: 'Email already exists'
          });
          return;
        }
      }

      const updatedEmployee = await this.userService.updateUser(id, updates);

      res.json({
        success: true,
        data: updatedEmployee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      console.error('Update employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if employee exists
      const existingEmployee = await this.userService.getUserById(id);
      if (!existingEmployee) {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      if (existingEmployee.role !== 'employee') {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      console.error('Delete employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async toggleEmployeeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if employee exists
      const existingEmployee = await this.userService.getUserById(id);
      if (!existingEmployee) {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      if (existingEmployee.role !== 'employee') {
        res.status(404).json({
          success: false,
          error: 'Employee not found'
        });
        return;
      }

      // Toggle status
      const updatedEmployee = await this.userService.updateUser(id, {
        isActive: !existingEmployee.isActive
      });

      res.json({
        success: true,
        data: updatedEmployee,
        message: `Employee ${updatedEmployee.isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Toggle employee status error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
