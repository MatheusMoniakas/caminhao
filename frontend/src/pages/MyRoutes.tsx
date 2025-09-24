import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<RouteExecution | null>(null);
  const [cancelReason, setCancelReason] = useState('');

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
      // Verificar se já existe uma execução para esta rota
      const existingExecution = executions.find(exec => exec.routeId === routeId);
      
      if (existingExecution) {
        // Se já existe uma execução, apenas atualizar o status para 'in_progress'
        await apiService.updateRouteExecution(existingExecution.id, { 
          status: 'in_progress' 
        });
        toast.success('Rota iniciada com sucesso!');
        loadMyRoutes(); // Recarregar dados
      } else {
        // Se não existe execução, criar uma nova
        const response = await apiService.startRouteExecution({ routeId });
        if (response.success) {
          // Atualizar status para 'in_progress'
          await apiService.updateRouteExecution(response.data.id, { 
            status: 'in_progress' 
          });
          toast.success('Rota iniciada com sucesso!');
          loadMyRoutes(); // Recarregar dados
        } else {
          toast.error(response.error || 'Erro ao iniciar rota');
        }
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

  const handleCancelRoute = (execution: RouteExecution) => {
    setSelectedExecution(execution);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancelRoute = async () => {
    if (!selectedExecution || !cancelReason.trim()) {
      toast.error('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      const response = await apiService.updateRouteExecution(selectedExecution.id, { 
        status: 'cancelled',
        observations: cancelReason.trim()
      });
      if (response.success) {
        toast.success('Rota cancelada com sucesso!');
        setShowCancelModal(false);
        setSelectedExecution(null);
        setCancelReason('');
        loadMyRoutes(); // Recarregar dados
      } else {
        toast.error(response.error || 'Erro ao cancelar rota');
      }
    } catch (error: any) {
      console.error('Erro ao cancelar rota:', error);
      toast.error('Erro ao cancelar rota');
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
    <div className="space-y-8">
      {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Rotas</h1>
            <p className="mt-2 text-blue-100 dark:text-blue-200 text-lg">
              Gerencie suas rotas atribuídas
            </p>
            <p className="mt-1 text-blue-200 dark:text-blue-300 text-sm">
              Visualize o status e execute suas entregas
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Route Status Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Pendentes
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</dd>
                  <dd className="text-xs text-yellow-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Aguardando início
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Play className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Em Execução
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</dd>
                  <dd className="text-xs text-blue-600 flex items-center mt-1">
                    <Play className="h-3 w-3 mr-1" />
                    Em andamento
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Concluídas Hoje
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completedToday}</dd>
                  <dd className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Finalizadas
                  </dd>
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
              <div key={route.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {route.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
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
                          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar Rota
                        </button>
                      )}
                      {status === 'in_progress' && (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleCompleteRoute(execution!.id)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Finalizar
                          </button>
                          <button 
                            onClick={() => handleCancelRoute(execution!)}
                            className="inline-flex items-center px-6 py-3 border border-red-300 text-sm font-semibold rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <X className="h-5 w-5 mr-2" />
                            Cancelar
                          </button>
                        </div>
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

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
            
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  Cancelar Rota
                </h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tem certeza que deseja cancelar esta rota? Por favor, informe o motivo do cancelamento.
                </p>
                
                <div className="mb-6">
                  <label htmlFor="cancelReason" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Motivo do cancelamento *
                  </label>
                  <textarea
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 sm:text-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Caminhão quebrou, problema no destino, etc."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200"
                    >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmCancelRoute}
                    className="px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-200"
                  >
                    Confirmar Cancelamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoutes;
