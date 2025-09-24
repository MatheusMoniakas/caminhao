import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';
import toast from 'react-hot-toast';

interface Route {
  id: string;
  name: string;
  description?: string;
  startPoint?: string;
  endPoint?: string;
  waypoints: string[];
  driverId: string;
  helperId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RouteExecution {
  id: string;
  routeId: string;
  employeeId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

const MyRoutes: React.FC = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [executions, setExecutions] = useState<RouteExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMyRoutes();
    }
  }, [user?.id]);

  const loadMyRoutes = async () => {
    try {
      setLoading(true);
      
      // Carregar rotas do funcionário
      const routesResponse = await apiService.getRoutesByEmployee(user!.id);
      if (routesResponse.success) {
        setRoutes(routesResponse.data);
      }

      // Carregar execuções do funcionário
      const executionsResponse = await apiService.getMyRouteExecutions();
      if (executionsResponse.success) {
        setExecutions(executionsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
      toast.error('Erro ao carregar suas rotas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const pending = executions.filter(exec => exec.status === 'pending').length;
    const inProgress = executions.filter(exec => exec.status === 'in_progress').length;
    const completedToday = executions.filter(exec => {
      if (exec.status !== 'completed' || !exec.endTime) return false;
      const today = new Date().toISOString().split('T')[0];
      return exec.endTime.startsWith(today);
    }).length;

    return { pending, inProgress, completedToday };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendente' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Play, text: 'Em Execução' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Concluída' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Cancelada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const stats = getStatusStats();

  const handleStartRoute = async (routeId: string) => {
    try {
      const response = await apiService.startRouteExecution({ routeId });
      if (response.success) {
        toast.success('Rota iniciada com sucesso!');
        loadMyRoutes(); // Recarregar dados
      } else {
        toast.error(response.error || 'Erro ao iniciar rota');
      }
    } catch (error: any) {
      console.error('Erro ao iniciar rota:', error);
      toast.error('Erro ao iniciar rota');
    }
  };

  const handleCompleteRoute = async (executionId: string) => {
    try {
      const response = await apiService.updateRouteExecution(executionId, { 
        status: 'completed' 
      });
      if (response.success) {
        toast.success('Rota concluída com sucesso!');
        loadMyRoutes(); // Recarregar dados
      } else {
        toast.error(response.error || 'Erro ao concluir rota');
      }
    } catch (error: any) {
      console.error('Erro ao concluir rota:', error);
      toast.error('Erro ao concluir rota');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Rotas</h1>
          <p className="mt-2 text-sm text-gray-700">Carregando suas rotas...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minhas Rotas</h1>
        <p className="mt-2 text-sm text-gray-700">
          Visualize e execute suas rotas atribuídas
        </p>
      </div>

      {/* Route Status Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendentes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Play className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Execução
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Concluídas Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedToday}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {routes.length === 0 ? (
          /* Empty State */
          <div className="bg-white shadow rounded-lg">
            <div className="p-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma rota atribuída</h3>
              <p className="mt-1 text-sm text-gray-500">
                Você não possui rotas atribuídas no momento.
              </p>
            </div>
          </div>
        ) : (
          routes.map((route) => {
            const execution = executions.find(exec => exec.routeId === route.id);
            const status = execution?.status || 'pending';
            
            return (
              <div key={route.id} className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-8 w-8 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {route.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {route.startPoint && route.endPoint 
                            ? `${route.startPoint} → ${route.endPoint}`
                            : route.description || 'Rota sem pontos definidos'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(status)}
                      {status === 'pending' && (
                        <button 
                          onClick={() => handleStartRoute(route.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Iniciar
                        </button>
                      )}
                      {status === 'in_progress' && (
                        <button 
                          onClick={() => handleCompleteRoute(execution!.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      {route.waypoints.length > 0 && (
                        <p><strong>Pontos de parada:</strong> {route.waypoints.length}</p>
                      )}
                      {route.description && (
                        <p><strong>Descrição:</strong> {route.description}</p>
                      )}
                      {execution && (
                        <p><strong>Status:</strong> {execution.status}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyRoutes;
