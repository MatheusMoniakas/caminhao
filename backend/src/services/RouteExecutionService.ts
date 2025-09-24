import { supabaseAdmin } from '@/config/database';
import { RouteExecution, StartRouteExecutionRequest, UpdateRouteExecutionRequest } from '@/types';

export class RouteExecutionService {
  async createRouteExecution(executionData: {
    routeId: string;
    employeeId: string;
  }): Promise<RouteExecution> {
    // Verificar se já existe uma execução para esta rota e funcionário
    const existingExecution = await this.getRouteExecutionByRouteAndEmployee(
      executionData.routeId, 
      executionData.employeeId
    );

    if (existingExecution) {
      // Se já existe uma execução, retornar a existente
      return existingExecution;
    }

    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .insert({
        route_id: executionData.routeId,
        employee_id: executionData.employeeId,
        status: 'pending',
        start_time: null,
        end_time: null,
        observations: null
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create route execution: ${error.message}`);
    }

    return this.mapRouteExecutionFromDatabase(data);
  }

  async getRouteExecutionById(id: string): Promise<RouteExecution | null> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Route execution not found
      }
      throw new Error(`Failed to get route execution: ${error.message}`);
    }

    return this.mapRouteExecutionFromDatabase(data);
  }

  async getRouteExecutionByRouteAndEmployee(routeId: string, employeeId: string): Promise<RouteExecution | null> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .eq('route_id', routeId)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Se não encontrar nenhuma execução, retornar null (não é um erro)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get route execution: ${error.message}`);
    }

    return this.mapRouteExecutionFromDatabase(data);
  }

  async getRouteExecutionsByEmployee(employeeId: string): Promise<RouteExecution[]> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get route executions by employee: ${error.message}`);
    }

    return data.map(execution => this.mapRouteExecutionFromDatabase(execution));
  }

  async getRouteExecutionsByRoute(routeId: string): Promise<RouteExecution[]> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .eq('route_id', routeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get route executions by route: ${error.message}`);
    }

    return data.map(execution => this.mapRouteExecutionFromDatabase(execution));
  }

  async getAllRouteExecutions(): Promise<RouteExecution[]> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get route executions: ${error.message}`);
    }

    return data.map(execution => this.mapRouteExecutionFromDatabase(execution));
  }

  async updateRouteExecution(id: string, updates: UpdateRouteExecutionRequest): Promise<RouteExecution> {
    const updateData: any = {};
    
    if (updates.status !== undefined) {
      updateData.status = updates.status;
      
      // Set start_time when status changes to 'in_progress'
      if (updates.status === 'in_progress') {
        updateData.start_time = new Date().toISOString();
      }
      
      // Set end_time when status changes to 'completed' or 'cancelled'
      if (updates.status === 'completed' || updates.status === 'cancelled') {
        updateData.end_time = new Date().toISOString();
      }
    }
    
    if (updates.observations !== undefined) updateData.observations = updates.observations;
    
    // Tentar adicionar problem_resolved apenas se for fornecido
    if (updates.problemResolved !== undefined) {
      updateData.problem_resolved = updates.problemResolved;
    }

    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Failed to update route execution: ${error.message} (Code: ${error.code})`);
    }

    return this.mapRouteExecutionFromDatabase(data);
  }

  async deleteRouteExecution(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('route_executions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete route execution: ${error.message}`);
    }
  }

  async getRouteExecutionsByDateRange(startDate: string, endDate: string): Promise<RouteExecution[]> {
    const { data, error } = await supabaseAdmin
      .from('route_executions')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get route executions by date range: ${error.message}`);
    }

    return data.map(execution => this.mapRouteExecutionFromDatabase(execution));
  }

  private mapRouteExecutionFromDatabase(data: any): RouteExecution {
    return {
      id: data.id,
      routeId: data.route_id,
      employeeId: data.employee_id,
      status: data.status,
      startTime: data.start_time,
      endTime: data.end_time,
      observations: data.observations,
      problemResolved: data.problem_resolved,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
