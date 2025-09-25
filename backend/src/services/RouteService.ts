import { supabaseAdmin } from '@/config/database';
import { Route, CreateRouteRequest, UpdateRouteRequest, User } from '@/types';
import { WhatsAppService } from './WhatsAppService';
import { UserService } from './UserService';

export class RouteService {
  private whatsappService: WhatsAppService;
  private userService: UserService;

  constructor() {
    this.whatsappService = new WhatsAppService();
    this.userService = new UserService();
  }

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
      scheduled_date: routeData.scheduledDate,
      shift: routeData.shift,
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

    const createdRoute = this.mapRouteFromDatabase(data);

    // Enviar notificações via WhatsApp (não bloquear a criação da rota se falhar)
    this.sendWhatsAppNotifications(createdRoute).catch(error => {
      console.error('Error sending WhatsApp notifications:', error);
    });

    return createdRoute;
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

  async getRouteByName(name: string): Promise<Route | null> {
    const { data, error } = await supabaseAdmin
      .from('routes')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Route not found
      }
      throw new Error(`Failed to get route by name: ${error.message}`);
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
      .or(`driver_id.eq.${employeeId},helper_id.eq.${employeeId}`)
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

  async checkRouteDependencies(routeId: string): Promise<boolean> {
    try {
      // Verificar se a rota tem execuções associadas
      const { data: executions, error: executionsError } = await supabaseAdmin
        .from('route_executions')
        .select('id')
        .eq('route_id', routeId)
        .limit(1);

      if (executionsError) {
        console.error('Error checking route executions dependencies:', executionsError);
        return true; // Em caso de erro, assumir que tem dependências por segurança
      }

      if (executions && executions.length > 0) {
        return true; // Tem execuções de rotas associadas
      }

      return false; // Não tem dependências
    } catch (error) {
      console.error('Error in checkRouteDependencies:', error);
      return true; // Em caso de erro, assumir que tem dependências por segurança
    }
  }

  async forceDeleteRoute(id: string): Promise<void> {
    try {
      // 1. Remover execuções de rotas associadas
      await supabaseAdmin
        .from('route_executions')
        .delete()
        .eq('route_id', id);

      // 2. Deletar a rota
      const { error } = await supabaseAdmin
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to force delete route: ${error.message}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to force delete route: ${error.message}`);
    }
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
      scheduledDate: data.scheduled_date,
      shift: data.shift,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Envia notificações via WhatsApp para motorista e ajudante quando uma rota é criada
   */
  private async sendWhatsAppNotifications(route: Route): Promise<void> {
    try {
      // Buscar dados do motorista
      const driver = await this.userService.getUserById(route.driverId);
      if (!driver) {
        console.warn(`Driver not found for route ${route.id}`);
        return;
      }

      // Buscar dados do ajudante (se existir)
      let helper: User | null = null;
      if (route.helperId) {
        helper = await this.userService.getUserById(route.helperId);
      }

      // Verificar se os funcionários têm telefone cadastrado
      if (!driver.phone) {
        console.warn(`Driver ${driver.name} does not have a phone number registered`);
        return;
      }

      if (helper && !helper.phone) {
        console.warn(`Helper ${helper.name} does not have a phone number registered`);
      }

      // Preparar dados para a notificação
      const notificationData = {
        routeName: route.name,
        scheduledDate: route.scheduledDate || new Date().toISOString(),
        shift: route.shift || 'Não especificado',
        driverName: driver.name,
        helperName: helper?.name
      };

      // Enviar notificações
      const results = await this.whatsappService.sendRouteNotification(
        driver.phone,
        helper?.phone,
        notificationData
      );

      // Log dos resultados
      if (results.driverSent) {
        console.log(`WhatsApp notification sent to driver: ${driver.name} (${driver.phone})`);
      } else {
        console.warn(`Failed to send WhatsApp notification to driver: ${driver.name} (${driver.phone})`);
      }

      if (helper && results.helperSent) {
        console.log(`WhatsApp notification sent to helper: ${helper.name} (${helper.phone})`);
      } else if (helper && !results.helperSent) {
        console.warn(`Failed to send WhatsApp notification to helper: ${helper.name} (${helper.phone})`);
      }

    } catch (error: any) {
      console.error('Error in sendWhatsAppNotifications:', error.message);
      // Não relançar o erro para não afetar a criação da rota
    }
  }
}
