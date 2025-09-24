import { supabaseAdmin } from '@/config/database';
import { Route, CreateRouteRequest, UpdateRouteRequest } from '@/types';

export class RouteService {
  async createRoute(routeData: CreateRouteRequest): Promise<Route> {
    // Preparar dados para inserção, convertendo strings vazias para null
    const insertData = {
      name: routeData.name,
      description: routeData.description && routeData.description.trim() !== '' ? routeData.description : null,
      start_point: routeData.startPoint && routeData.startPoint.trim() !== '' ? routeData.startPoint : null,
      end_point: routeData.endPoint && routeData.endPoint.trim() !== '' ? routeData.endPoint : null,
      waypoints: routeData.waypoints && routeData.waypoints.length > 0 ? routeData.waypoints : [],
      driver_id: routeData.driverId,
      helper_id: routeData.helperId && routeData.helperId.trim() !== '' ? routeData.helperId : null,
      is_active: true
    };

    console.log('Inserting route data:', insertData);

    const { data, error } = await supabaseAdmin
      .from('routes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to create route: ${error.message}`);
    }

    return this.mapRouteFromDatabase(data);
  }

  async getRouteById(id: string): Promise<Route | null> {
    const { data, error } = await supabaseAdmin
      .from('routes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Route not found
      }
      throw new Error(`Failed to get route: ${error.message}`);
    }

    return this.mapRouteFromDatabase(data);
  }

  async getAllRoutes(): Promise<Route[]> {
    const { data, error } = await supabaseAdmin
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get routes: ${error.message}`);
    }

    return data.map(route => this.mapRouteFromDatabase(route));
  }

  async getRoutesByEmployee(employeeId: string): Promise<Route[]> {
    const { data, error } = await supabaseAdmin
      .from('routes')
      .select('*')
      .eq('assigned_employee_id', employeeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get routes by employee: ${error.message}`);
    }

    return data.map(route => this.mapRouteFromDatabase(route));
  }

  async updateRoute(id: string, updates: UpdateRouteRequest): Promise<Route> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.startPoint !== undefined) updateData.start_point = updates.startPoint;
    if (updates.endPoint !== undefined) updateData.end_point = updates.endPoint;
    if (updates.waypoints !== undefined) updateData.waypoints = updates.waypoints;
    if (updates.driverId !== undefined) updateData.driver_id = updates.driverId;
    if (updates.helperId !== undefined) updateData.helper_id = updates.helperId;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabaseAdmin
      .from('routes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update route: ${error.message}`);
    }

    return this.mapRouteFromDatabase(data);
  }

  async deleteRoute(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('routes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete route: ${error.message}`);
    }
  }

  private mapRouteFromDatabase(data: any): Route {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      startPoint: data.start_point,
      endPoint: data.end_point,
      waypoints: data.waypoints || [],
      driverId: data.driver_id,
      helperId: data.helper_id,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
