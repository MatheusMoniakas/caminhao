import { supabaseAdmin } from '@/config/database';
import { User, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types';
import bcrypt from 'bcryptjs';

export class UserService {
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: 'admin' | 'employee';
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  async getUserByName(name: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user by name: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  async updateUser(id: string, updates: Partial<{
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
  }>): Promise<User> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return this.mapUserFromDatabase(data);
  }

  async checkUserDependencies(userId: string): Promise<boolean> {
    try {
      // Verificar se o usuário tem rotas associadas (como motorista ou ajudante)
      const { data: routes, error: routesError } = await supabaseAdmin
        .from('routes')
        .select('id')
        .or(`driver_id.eq.${userId},helper_id.eq.${userId}`)
        .limit(1);

      if (routesError) {
        console.error('Error checking routes dependencies:', routesError);
        return true; // Em caso de erro, assumir que tem dependências por segurança
      }

      if (routes && routes.length > 0) {
        return true; // Tem rotas associadas
      }

      // Verificar se o usuário tem execuções de rotas associadas
      const { data: executions, error: executionsError } = await supabaseAdmin
        .from('route_executions')
        .select('id')
        .eq('employee_id', userId)
        .limit(1);

      if (executionsError) {
        console.error('Error checking route executions dependencies:', executionsError);
        return true; // Em caso de erro, assumir que tem dependências por segurança
      }

      if (executions && executions.length > 0) {
        return true; // Tem execuções de rotas associadas
      }

      // Verificar se o usuário tem rotas atribuídas (coluna antiga)
      const { data: assignedRoutes, error: assignedError } = await supabaseAdmin
        .from('routes')
        .select('id')
        .eq('assigned_employee_id', userId)
        .limit(1);

      if (assignedError) {
        console.error('Error checking assigned routes dependencies:', assignedError);
        return true; // Em caso de erro, assumir que tem dependências por segurança
      }

      if (assignedRoutes && assignedRoutes.length > 0) {
        return true; // Tem rotas atribuídas
      }

      return false; // Não tem dependências
    } catch (error) {
      console.error('Error in checkUserDependencies:', error);
      return true; // Em caso de erro, assumir que tem dependências por segurança
    }
  }

  async forceDeleteUser(id: string): Promise<void> {
    try {
      // 1. Remover execuções de rotas associadas
      await supabaseAdmin
        .from('route_executions')
        .delete()
        .eq('employee_id', id);

      // 2. Atualizar rotas que têm este usuário como motorista ou ajudante
      await supabaseAdmin
        .from('routes')
        .update({ driver_id: null })
        .eq('driver_id', id);

      await supabaseAdmin
        .from('routes')
        .update({ helper_id: null })
        .eq('helper_id', id);

      // 3. Atualizar rotas que têm este usuário como assigned_employee_id
      await supabaseAdmin
        .from('routes')
        .update({ assigned_employee_id: null })
        .eq('assigned_employee_id', id);

      // 4. Finalmente, deletar o usuário
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to force delete user: ${error.message}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to force delete user: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }

    return data.map(user => this.mapUserFromDatabase(user));
  }

  async getUserByEmailWithPassword(email: string): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private mapUserFromDatabase(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
